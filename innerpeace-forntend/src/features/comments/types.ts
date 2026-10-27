import { z } from 'zod';

export const commentSchema = z.object({
    id: z.number(),
    comment: z.string(),
    commentedAt: z.string(),
});

export const commentResponseSchema = z.object({
    data: z.array(commentSchema),
    meta: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});

export type Comment = z.infer<typeof commentSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
