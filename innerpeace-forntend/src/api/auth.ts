import { api } from '@/lib/api';
import { z } from 'zod';

// export const userSchema = z.object({
//   id: z.number(),
//   username: z.string(),
//   email: z.string(),
//   role: z.string(),
//   createdAt: z.string().optional(),
//   posts: z.any().optional()
// });

// Relaxed schema for debugging
export const userSchema = z.any();

export type User = any;

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return z.object({ access_token: z.string() }).parse(data);
}

export async function fetchMe() {
  try {
    const { data } = await api.get('/auth/me');
    console.log('fetchMe response:', data);
    return userSchema.parse(data);
  } catch (error) {
    console.error('fetchMe error:', error);
    throw error;
  }
}
