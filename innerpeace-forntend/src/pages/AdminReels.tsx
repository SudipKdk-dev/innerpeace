import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, Plus, Eye, EyeOff, Youtube, X, Image as ImageIcon } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReelsAdmin, useReelMutations } from '@/features/reels/queries';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import type { Reel } from '@/features/reels/types';

const schema = z.object({
    title: z.string().max(140).optional(),
    youtubeUrl: z.string().min(1, 'YouTube URL is required'),
    displayOrder: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

function extractYoutubeId(url: string): string {
    const cleanUrl = url.split('?')[0];
    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) return match[1];
    }
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];
    return cleanUrl;
}

export default function AdminReels() {
    const { token } = useAuth();
    const { data: reels, isLoading } = useReelsAdmin(Boolean(token));
    const { create, update, remove } = useReelMutations();
    const { push } = useToast();
    const [editingReel, setEditingReel] = useState<Reel | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { displayOrder: 0 }
    });

    useEffect(() => {
        if (editingReel) {
            setValue('title', editingReel.title ?? '');
            setValue('youtubeUrl', editingReel.youtubeUrl);
            setValue('displayOrder', editingReel.displayOrder);
        } else if (!isCreating) {
            reset({ title: '', youtubeUrl: '', displayOrder: 0 });
        }
    }, [editingReel, isCreating, setValue, reset]);

    const onSubmit = async (values: FormValues) => {
        try {
            if (editingReel) {
                await update.mutateAsync({
                    id: editingReel.id,
                    input: {
                        title: values.title || undefined,
                        youtubeUrl: values.youtubeUrl,
                        displayOrder: values.displayOrder ?? 0,
                    }
                });
                push({ type: 'success', message: 'Reel updated!' });
            } else {
                await create.mutateAsync({
                    title: values.title || undefined,
                    youtubeUrl: values.youtubeUrl,
                    displayOrder: values.displayOrder ?? 0,
                });
                push({ type: 'success', message: 'Reel added!' });
            }
            reset();
            setEditingReel(null);
            setIsCreating(false);
        } catch (err: any) {
            push({ type: 'error', message: err?.message ?? 'Failed to save reel.' });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this reel?')) return;
        try {
            await remove.mutateAsync(id);
            push({ type: 'success', message: 'Reel deleted!' });
        } catch {
            push({ type: 'error', message: 'Failed to delete reel.' });
        }
    };

    const handleToggleActive = async (reel: Reel) => {
        try {
            await update.mutateAsync({
                id: reel.id,
                input: { isActive: !reel.isActive }
            });
            push({ type: 'success', message: `Reel ${reel.isActive ? 'hidden' : 'shown'}!` });
        } catch {
            push({ type: 'error', message: 'Failed to update reel.' });
        }
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex items-end justify-between">
                <SectionHeading title="Manage Reels" subtitle="Admin" />
                {!isCreating && (
                    <Button onClick={() => { setIsCreating(true); setEditingReel(null); }} className="gap-2">
                        <Plus size={18} /> Add Reel
                    </Button>
                )}
            </div>

            {/* New Reel Form - only shown when creating, not editing */}
            {isCreating && !editingReel && (
                <Card className="glass border-2 border-white/50 p-6 shadow-soft animate-scale-in">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
                            <Youtube size={20} /> Add New Reel
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                            <X size={20} />
                        </Button>
                    </div>

                    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">YouTube URL *</label>
                                <Input placeholder="https://youtube.com/shorts/..." {...register('youtubeUrl')} />
                                {errors.youtubeUrl && <p className="text-xs text-red-500">{errors.youtubeUrl.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title (optional)</label>
                                <Input placeholder="My awesome reel" {...register('title')} />
                            </div>
                        </div>
                        <div className="max-w-[200px] space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Display Order</label>
                            <Input type="number" min="0" {...register('displayOrder')} />
                        </div>
                        <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting || create.isPending}>
                                {isSubmitting ? 'Saving...' : 'Add Reel'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Reels List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-12 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
                        <p className="mt-4 text-sm text-ink/60">Loading reels...</p>
                    </div>
                ) : (reels ?? []).length > 0 ? (
                    <div className="grid gap-4">
                        {(reels ?? []).map((reel) => {
                            const videoId = extractYoutubeId(reel.youtubeUrl);
                            const isEditing = editingReel?.id === reel.id;

                            return (
                                <Card
                                    key={reel.id}
                                    className="group overflow-hidden transition-all hover:bg-white/60 hover:shadow-soft"
                                >
                                    {isEditing ? (
                                        /* Inline Edit Form */
                                        <div className="p-5 animate-fade-in">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                                                    <Youtube size={18} /> Edit Reel
                                                </h2>
                                                <Button variant="ghost" size="icon" onClick={() => setEditingReel(null)}>
                                                    <X size={18} />
                                                </Button>
                                            </div>

                                            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-ink/50">YouTube URL *</label>
                                                        <Input placeholder="https://youtube.com/shorts/..." {...register('youtubeUrl')} />
                                                        {errors.youtubeUrl && <p className="text-xs text-red-500">{errors.youtubeUrl.message}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title (optional)</label>
                                                        <Input placeholder="My awesome reel" {...register('title')} />
                                                    </div>
                                                </div>
                                                <div className="max-w-[200px] space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Display Order</label>
                                                    <Input type="number" min="0" {...register('displayOrder')} />
                                                </div>
                                                <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
                                                    <Button type="button" variant="ghost" onClick={() => setEditingReel(null)}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isSubmitting || update.isPending}>
                                                        {isSubmitting ? 'Saving...' : 'Update Reel'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        /* Normal reel view */
                                        <div className="flex flex-col sm:flex-row gap-4 p-5">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                    alt={reel.title || 'Reel thumbnail'}
                                                    className="w-32 h-20 object-cover rounded-xl transition-transform group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant={reel.isActive ? 'default' : 'secondary'}>
                                                        {reel.isActive ? 'Active' : 'Hidden'}
                                                    </Badge>
                                                    <span className="text-sm font-semibold">
                                                        {reel.title || `Reel #${reel.id}`}
                                                    </span>
                                                    <span className="text-xs text-ink/60">Order: {reel.displayOrder}</span>
                                                </div>
                                                <p className="text-xs text-ink/60 truncate max-w-md">{reel.youtubeUrl}</p>
                                                <p className="text-xs text-ink/40">{formatDate(reel.createdAt)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(reel)}
                                                    title={reel.isActive ? 'Hide' : 'Show'}
                                                    className="hover:bg-blue-100 hover:text-blue-600"
                                                >
                                                    {reel.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingReel(reel)}
                                                    title="Edit"
                                                    className="hover:bg-moss/20 hover:text-moss"
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(reel.id)}
                                                    title="Delete"
                                                    className="hover:bg-red-100 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
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
                        <Youtube size={48} strokeWidth={1} className="mb-4 text-ink/40" />
                        <p className="text-lg font-medium">No reels yet</p>
                        <p className="text-sm">Add your first YouTube reel to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
