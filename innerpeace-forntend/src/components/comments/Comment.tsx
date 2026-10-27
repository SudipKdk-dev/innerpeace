import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteComment } from '@/features/comments/queries';
import type { Comment as CommentType } from '@/features/comments/types';

interface CommentProps {
    comment: CommentType;
    postId: number;
}

export function Comment({ comment, postId }: CommentProps) {
    const { isAuthenticated } = useAuth();
    const confirm = useConfirm();
    const deleteComment = useDeleteComment(postId);

    const timeAgo = formatDistanceToNow(new Date(comment.commentedAt), {
        addSuffix: true,
    });

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Comment',
            message: 'Are you sure you want to delete this comment? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (confirmed) {
            try {
                await deleteComment.mutateAsync(comment.id);
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        }
    };

    return (
        <Card className="p-4 space-y-2 animate-fade-in hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-ink/50">
                    Anonymous
                </span>
                <div className="flex items-center gap-2">
                    <time className="text-xs text-ink/50" dateTime={comment.commentedAt}>
                        {timeAgo}
                    </time>
                    {isAuthenticated && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteComment.isPending}
                            className="p-1.5 rounded-lg text-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            aria-label="Delete comment"
                            title="Delete comment"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
            <p className="text-ink/90 leading-relaxed whitespace-pre-wrap break-words">
                {comment.comment}
            </p>
        </Card>
    );
}
