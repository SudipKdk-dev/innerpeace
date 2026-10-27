import { z } from 'zod';

export const journeyStatusSchema = z.enum(['draft', 'published']);

export const journeySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  eventDate: z.string(),
  image: z.string().nullable().optional(),
  status: journeyStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Journey = z.infer<typeof journeySchema>;
