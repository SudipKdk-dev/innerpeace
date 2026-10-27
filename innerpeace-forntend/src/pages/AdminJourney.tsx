import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionHeading } from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJourneyMutations, useJourneysAdmin } from '@/features/journey/queries';
import type { Journey } from '@/features/journey/types';
import { formatDate, truncateText } from '@/lib/format';
import { useToast } from '@/components/ui/toast';
import { resolveMediaUrl } from '@/lib/media';
import { useAuth } from '@/hooks/useAuth';
import { Plus, X, Edit2, Trash2, Map, Image as ImageIcon } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(140, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  status: z.enum(['draft', 'published', 'archived']),
  image: z.any().optional()
});

type FormValues = z.infer<typeof schema>;

export default function AdminJourney() {
  const { token } = useAuth();
  const { data: journeys, isLoading } = useJourneysAdmin(Boolean(token));
  const { create, update, remove } = useJourneyMutations();
  const { push } = useToast();
  const [editing, setEditing] = useState<Journey | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'draft'
    }
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        description: editing.description,
        eventDate: editing.eventDate.split('T')[0],
        status: editing.status,
        image: undefined
      });
    } else if (!isCreating) {
      reset({ title: '', description: '', eventDate: '', status: 'draft', image: undefined });
    }
  }, [editing, isCreating, reset]);

  const onSubmit = async (values: FormValues) => {
    const form = new FormData();
    form.append('title', values.title.trim());
    form.append('description', values.description);
    form.append('eventDate', new Date(values.eventDate).toISOString());
    form.append('status', values.status);

    const fileList = values.image as FileList | undefined;
    if (fileList && fileList[0]) {
      form.append('image', fileList[0]);
    }

    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, form });
        push({ type: 'success', message: 'Journey item updated!' });
      } else {
        await create.mutateAsync(form);
        push({ type: 'success', message: 'Journey item created!' });
      }
      setEditing(null);
      setIsCreating(false);
      reset();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to save journey item.';
      push({ type: 'error', message });
      console.error('Save journey error:', err);
    }
  };

  const onDelete = async (item: Journey) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await remove.mutateAsync(item.id);
      push({ type: 'success', message: 'Journey item deleted!' });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to delete item.';
      push({ type: 'error', message });
    }
  };

  const list = useMemo(() => journeys ?? [], [journeys]);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-end justify-between">
        <SectionHeading title="Manage Journey" subtitle="Admin" />
        {!isCreating && (
          <Button onClick={() => { setIsCreating(true); setEditing(null); }} className="gap-2">
            <Plus size={18} /> New Item
          </Button>
        )}
      </div>

      {/* New Item Form - only shown when creating, not editing */}
      {isCreating && !editing && (
        <Card className="glass border-2 border-white/50 p-6 shadow-soft animate-scale-in">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-ink">New Journey Item</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
              <X size={20} />
            </Button>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title</label>
              <Input placeholder="Title (max 140 chars)" {...register('title')} maxLength={140} />
              {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Description</label>
              <Textarea placeholder="Description" rows={4} {...register('description')} />
              {errors.description ? <p className="text-xs text-red-600">{errors.description.message}</p> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Event Date</label>
                <Input type="date" {...register('eventDate')} />
                {errors.eventDate ? <p className="text-xs text-red-600">{errors.eventDate.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Status</label>
                <Select {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Image</label>
                <Input type="file" accept="image/*" {...register('image')} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Item'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Journey Items List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
            <p className="mt-4 text-sm text-ink/60">Loading journey items...</p>
          </div>
        ) : list.length > 0 ? (
          <div className="grid gap-4">
            {list.map((item) => {
              const imageUrl = resolveMediaUrl(item.image);
              const isEditing = editing?.id === item.id;

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden transition-all hover:bg-white/60 hover:shadow-soft"
                >
                  {isEditing ? (
                    /* Inline Edit Form */
                    <div className="p-5 animate-fade-in">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-serif text-xl font-bold text-ink">Edit Journey Item</h2>
                        <Button variant="ghost" size="icon" onClick={() => setEditing(null)}>
                          <X size={18} />
                        </Button>
                      </div>

                      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title</label>
                          <Input placeholder="Title (max 140 chars)" {...register('title')} maxLength={140} />
                          {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Description</label>
                          <Textarea placeholder="Description" rows={4} {...register('description')} />
                          {errors.description ? <p className="text-xs text-red-600">{errors.description.message}</p> : null}
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Event Date</label>
                            <Input type="date" {...register('eventDate')} />
                            {errors.eventDate ? <p className="text-xs text-red-600">{errors.eventDate.message}</p> : null}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Status</label>
                            <Select {...register('status')}>
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Image</label>
                            <div className="relative flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-ink/20 hover:border-ink/40 hover:bg-white/50">
                              <span className="flex items-center gap-2 text-sm text-ink/60">
                                <ImageIcon size={14} /> {imageUrl ? 'Replace' : 'Choose'}
                              </span>
                              <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" {...register('image')} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
                          <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Item'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Normal item view */
                    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sand/30 shadow-inner">
                          {imageUrl ? (
                            <img src={imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink/20">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={item.status === 'published' ? 'default' : 'secondary'} className="uppercase tracking-wider text-[10px]">
                              {item.status}
                            </Badge>
                            <span className="text-xs text-ink/40">#{item.id}</span>
                          </div>
                          <h3 className="font-serif text-lg font-bold text-ink">{item.title}</h3>
                          <p className="text-sm text-ink/60 line-clamp-1">{truncateText(item.description, 100)}</p>
                          <p className="text-xs text-ink/40">
                            {formatDate(item.eventDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(item)} className="hover:bg-moss/20 hover:text-moss">
                          <Edit2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="hover:bg-red-100 hover:text-red-600">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Map size={48} strokeWidth={1} className="mb-4 text-ink/40" />
            <p className="text-lg font-medium">No journey items yet</p>
            <p className="text-sm">Create your first journey item to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
