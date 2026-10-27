import { z } from 'zod';

export const momentStatusSchema = z.enum(['UPLOADED', 'PENDING']);

export const momentSchema = z.object({
  id: z.number(),
  status: momentStatusSchema,
  rawKey: z.string(),
  mimeType: z.string(),
  createdAt: z.string()
});

export const presignSchema = z.object({
  momentId: z.number(),
  key: z.string(),
  uploadUrl: z.string()
});

export const playSchema = z.object({
  url: z.string()
});

export type Moment = z.infer<typeof momentSchema>;
export type PresignResponse = z.infer<typeof presignSchema>;
export type PlayResponse = z.infer<typeof playSchema>;
