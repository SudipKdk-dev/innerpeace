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
import { usePostMutations, usePosts } from '@/features/posts/queries';
import { useComments } from '@/features/comments/queries';
import { Comment } from '@/components/comments/Comment';
import type { Post } from '@/features/posts/types';
import { formatDate, truncateText } from '@/lib/format';
import { useToast } from '@/components/ui/toast';
import { resolveMediaUrl } from '@/lib/media';
import { Plus, Image as ImageIcon, X, Edit2, Trash2, BookOpen, ChevronDown, MessageCircle } from 'lucide-react';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  image: z.any().optional()
});

type FormValues = z.infer<typeof schema>;

// Inline component for expandable comments section
function PostCommentsSection({ postId }: { postId: number }) {
  const { data, isLoading, error } = useComments(postId, 1, 50);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-sm text-red-500 py-4">
        Failed to load comments
      </p>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <p className="text-center text-sm text-ink/50 py-4">
        No comments on this post yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={16} className="text-ink/50" />
        <span className="text-sm font-medium text-ink/70">
          {data.meta.total} {data.meta.total === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
      {data.data.map((comment) => (
        <Comment key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}

export default function AdminBlogs() {
  const { data: posts, isLoading } = usePosts({ page: 1, limit: 100 });
  const { create, update, remove } = usePostMutations();
  const { push } = useToast();
  const [editing, setEditing] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

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
      // Reset form with editing post data
      reset({
        title: editing.title,
        content: editing.content ?? '',
        status: editing.status,
        image: undefined
      });
    } else if (!isCreating) {
      reset({ title: '', content: '', status: 'draft', image: undefined });
    }
  }, [editing, isCreating, reset]);

  const onSubmit = async (values: FormValues) => {
    const form = new FormData();
    form.append('title', values.title.trim());
    if (values.content) form.append('content', values.content);
    form.append('status', values.status);

    const fileList = values.image as FileList | undefined;
    if (fileList && fileList[0]) {
      form.append('image', fileList[0]);
    }

    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, form });
        push({ type: 'success', message: 'Post updated successfully!' });
      } else {
        await create.mutateAsync(form);
        push({ type: 'success', message: 'Post created successfully!' });
      }
      setEditing(null);
      setIsCreating(false);
      reset();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to save post. Please try again.';
      push({ type: 'error', message });
      console.error('Save post error:', err);
    }
  };

  const onDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      await remove.mutateAsync(post.id);
      push({ type: 'success', message: 'Post deleted successfully!' });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to delete post.';
      push({ type: 'error', message });
    }
  };

  const list = useMemo(() => posts ?? [], [posts]);

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-end justify-between">
        <SectionHeading title="Manage Blogs" subtitle="Admin" />
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus size={18} /> New Post
          </Button>
        )}
      </div>

      {/* New Post form - only shown when creating, not editing */}
      {isCreating && !editing && (
        <Card className="glass border-2 border-white/50 p-6 shadow-soft animate-scale-in">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-ink">New Post</h2>
            <Button variant="ghost" size="icon" onClick={() => { setIsCreating(false); setEditing(null); }}>
              <X size={20} />
            </Button>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title</label>
                <Input placeholder="Enter a catchy title..." className="font-serif text-lg" {...register('title')} />
                {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Content</label>
                <Textarea placeholder="Write your story..." rows={12} className="leading-relaxed" {...register('content')} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Status</label>
                  <Select {...register('status')}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-ink/20 hover:border-ink/40 hover:bg-white/50">
                      <span className="flex items-center gap-2 text-sm text-ink/60">
                        <ImageIcon size={16} /> Choose file
                      </span>
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" {...register('image')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-6">
              <Button type="button" variant="ghost" onClick={() => { setIsCreating(false); setEditing(null); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
            <p className="mt-4 text-sm text-ink/60">Loading your stories...</p>
          </div>
        ) : list.length > 0 ? (
          <div className="grid gap-4">
            {list.map((post) => {
              const imageUrl = resolveMediaUrl(post.image);
              const isExpanded = expandedPostId === post.id;
              const isEditing = editing?.id === post.id;

              return (
                <Card
                  key={post.id}
                  className="group overflow-hidden transition-all hover:bg-white/60 hover:shadow-soft"
                >
                  {isEditing ? (
                    /* Inline Edit Form */
                    <div className="p-5 animate-fade-in">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-serif text-xl font-bold text-ink">Edit Post</h2>
                        <Button variant="ghost" size="icon" onClick={() => setEditing(null)}>
                          <X size={18} />
                        </Button>
                      </div>

                      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Title</label>
                            <Input placeholder="Enter a catchy title..." className="font-serif text-lg" {...register('title')} />
                            {errors.title ? <p className="text-xs text-red-600">{errors.title.message}</p> : null}
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Content</label>
                            <Textarea placeholder="Write your story..." rows={8} className="leading-relaxed" {...register('content')} />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Status</label>
                              <Select {...register('status')}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-ink/50">Cover Image</label>
                              <div className="flex items-center gap-4">
                                <div className="relative flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-ink/20 hover:border-ink/40 hover:bg-white/50">
                                  <span className="flex items-center gap-2 text-sm text-ink/60">
                                    <ImageIcon size={16} /> {imageUrl ? 'Replace image' : 'Choose file'}
                                  </span>
                                  <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" {...register('image')} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
                          <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Post'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Normal post view */
                    <>
                      {/* Main post row */}
                      <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center md:justify-between">
                        {/* Clickable post info area */}
                        <div
                          className="flex gap-6 flex-1 cursor-pointer"
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        >
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-sand/30 shadow-inner">
                            {imageUrl ? (
                              <img src={imageUrl} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-ink/20">
                                <ImageIcon size={24} />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col justify-center space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="uppercase tracking-wider text-[10px]">
                                {post.status}
                              </Badge>
                              <span className="text-xs text-ink/40">#{post.id}</span>
                              <div className="flex items-center gap-1 text-xs text-ink/50 ml-2">
                                <MessageCircle size={12} />
                                <span>Comments</span>
                              </div>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-ink">{post.title}</h3>
                            <p className="line-clamp-1 text-sm text-ink/60 max-w-md">{truncateText(post.content ?? '', 80)}</p>
                            <p className="text-xs text-ink/40 pt-1">
                              Updated {formatDate(post.updatedAt ?? post.createdAt)}
                            </p>
                          </div>

                          {/* Expand indicator */}
                          <div className="flex items-center">
                            <ChevronDown
                              size={20}
                              className={`text-ink/40 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </div>

                        {/* Action buttons - separate from clickable area */}
                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 md:flex-row" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" onClick={() => setEditing(post)} className="hover:bg-moss/20 hover:text-moss">
                            <Edit2 size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(post)} className="hover:bg-red-100 hover:text-red-600">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>

                      {/* Expandable comments section */}
                      {isExpanded && (
                        <div className="border-t border-ink/10 bg-sand/20 p-5 animate-fade-in">
                          <PostCommentsSection postId={post.id} />
                        </div>
                      )}
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <BookOpen size={48} strokeWidth={1} className="mb-4 text-ink/40" />
            <p className="text-lg font-medium">No stories yet</p>
            <p className="text-sm">Create your first blog post to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
