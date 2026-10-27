import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateComment } from '@/features/comments/queries';
import { Send } from 'lucide-react';

interface CommentFormProps {
    postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const createComment = useCreateComment(postId);

    const maxLength = 2000;
    const remaining = maxLength - comment.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!comment.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (comment.length > maxLength) {
            setError(`Comment is too long (max ${maxLength} characters)`);
            return;
        }

        try {
            await createComment.mutateAsync(comment);
            setComment('');
            setError('');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to post comment. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="resize-none"
                    disabled={createComment.isPending}
                />
                <div className="flex items-center justify-between text-xs">
                    <span className={remaining < 0 ? 'text-red-500' : 'text-ink/50'}>
                        {remaining} characters remaining
                    </span>
                    {error && <span className="text-red-500">{error}</span>}
                </div>
            </div>

            <Button
                type="submit"
                disabled={createComment.isPending || !comment.trim() || remaining < 0}
                className="w-full sm:w-auto"
            >
                {createComment.isPending ? (
                    <>
                        <span className="animate-pulse">Posting...</span>
                    </>
                ) : (
                    <>
                        <Send size={16} className="mr-2" />
                        Post Comment
                    </>
                )}
            </Button>

            {createComment.isSuccess && !error && (
                <p className="text-sm text-green-600 animate-fade-in">
                    ✓ Comment posted successfully!
                </p>
            )}
        </form>
    );
}
