import { api } from '@/lib/api';
import { commentResponseSchema, type CommentResponse } from './types';

export async function fetchComments(
    postId: number,
    page: number = 1,
    limit: number = 20
): Promise<CommentResponse> {
    const { data } = await api.get(`/posts/${postId}/comments`, {
        params: { page, limit },
    });
    return commentResponseSchema.parse(data);
}

export async function createComment(postId: number, comment: string) {
    const { data } = await api.post(`/posts/${postId}/comments`, { comment });
    return data;
}

export async function deleteComment(postId: number, commentId: number) {
    const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return data;
}
