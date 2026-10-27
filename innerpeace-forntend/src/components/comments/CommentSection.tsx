import { MessageCircle } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { useComments } from '@/features/comments/queries';

interface CommentSectionProps {
    postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const { data } = useComments(postId, 1, 20);
    const commentCount = data?.meta.total ?? 0;

    return (
        <section className="space-y-8 animate-fade-in">
            {/* Section Header */}
            <div className="flex items-center gap-3 border-t border-ink/10 pt-8">
                <MessageCircle size={24} className="text-cocoa" />
                <h2 className="font-serif text-2xl font-semibold">
                    Comments
                    {commentCount > 0 && (
                        <span className="ml-2 text-lg text-ink/50">({commentCount})</span>
                    )}
                </h2>
            </div>

            {/* Comment Form */}
            <div className="rounded-2xl border border-ink/10 bg-white/50 p-6 shadow-soft backdrop-blur-sm">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-ink/70">
                    Leave a Comment
                </h3>
                <CommentForm postId={postId} />
            </div>

            {/* Comment List */}
            <div>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-ink/70">
                    {commentCount > 0 ? `All Comments (${commentCount})` : 'Comments'}
                </h3>
                <CommentList postId={postId} />
            </div>
        </section>
    );
}
