import { z } from 'zod';

export const postStatusSchema = z.enum(['draft', 'published', 'archived']);

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  status: postStatusSchema,
  publishedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Post = z.infer<typeof postSchema>;
