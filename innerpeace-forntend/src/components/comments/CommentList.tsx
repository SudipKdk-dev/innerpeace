import { useState } from 'react';
import { Comment } from './Comment';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useComments } from '@/features/comments/queries';

interface CommentListProps {
    postId: number;
}

export function CommentList({ postId }: CommentListProps) {
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading, error } = useComments(postId, page, limit);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="text-center py-8">
                <p className="text-ink/60">Unable to load comments. Please try again later.</p>
            </Card>
        );
    }

    if (!data || data.data.length === 0) {
        return (
            <Card className="text-center py-12">
                <p className="text-ink/60">No comments yet. Be the first to share your thoughts!</p>
            </Card>
        );
    }

    const { data: comments, meta } = data;

    return (
        <div className="space-y-6">
            <div className="space-y-4 stagger-in">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} postId={postId} />
                ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        size="sm"
                    >
                        ← Previous
                    </Button>
                    <span className="text-sm text-ink/70">
                        Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        size="sm"
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    );
}
