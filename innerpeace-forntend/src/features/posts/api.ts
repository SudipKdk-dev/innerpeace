import { api } from '@/lib/api';
import { postSchema, type Post } from './types';
import { z } from 'zod';

const postsSchema = z.array(postSchema);

export async function fetchPosts(params?: { page?: number; limit?: number }) {
  const { data } = await api.get('/posts', { params });
  return postsSchema.parse(data);
}

export async function fetchPostBySlug(slug: string) {
  const { data } = await api.get(`/posts/${encodeURIComponent(slug)}`);
  return postSchema.parse(data);
}

export async function createPost(form: FormData) {
  const { data } = await api.post('/posts', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return postSchema.parse(data);
}

export async function updatePost(id: number, form: FormData) {
  const { data } = await api.patch(`/posts/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return postSchema.parse(data);
}

export async function deletePost(id: number) {
  const { data } = await api.delete(`/posts/${id}`);
  return data as { message?: string };
}

export type { Post };
