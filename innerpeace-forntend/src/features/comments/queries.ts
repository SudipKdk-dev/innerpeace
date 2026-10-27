import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, fetchComments } from './api';

export function useComments(postId: number, page: number = 1, limit: number = 20) {
    return useQuery({
        queryKey: ['comments', postId, page, limit],
        queryFn: () => fetchComments(postId, page, limit),
        enabled: Boolean(postId),
    });
}

export function useCreateComment(postId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: string) => createComment(postId, comment),
        onSuccess: () => {
            // Invalidate all comment queries for this post to refetch
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}

export function useDeleteComment(postId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => deleteComment(postId, commentId),
        onSuccess: () => {
            // Invalidate all comment queries for this post to refetch
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}
