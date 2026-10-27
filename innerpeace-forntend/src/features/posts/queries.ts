import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, fetchPostBySlug, fetchPosts, updatePost } from './api';

export function usePosts(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => fetchPosts({ page, limit })
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: Boolean(slug)
  });
}

export function usePostMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  const update = useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) => updatePost(id, form),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  const remove = useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
  });

  return { create, update, remove };
}
