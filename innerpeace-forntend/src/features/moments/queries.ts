import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAdminMoments, fetchMomentPlayUrl, fetchMoments } from './api';

export function useMoments() {
  return useQuery({
    queryKey: ['moments'],
    queryFn: fetchMoments
  });
}

export function useMomentsAdmin(enabled: boolean) {
  return useQuery({
    queryKey: ['moments', 'admin'],
    queryFn: fetchAdminMoments,
    enabled
  });
}

export function useMomentPlayback(id: number | null, enabled = true) {
  return useQuery({
    queryKey: ['moments', 'play', id],
    queryFn: () => fetchMomentPlayUrl(id as number),
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000
  });
}

export function usePrefetchMomentPlayback() {
  const queryClient = useQueryClient();
  return (id: number) =>
    queryClient.prefetchQuery({
      queryKey: ['moments', 'play', id],
      queryFn: () => fetchMomentPlayUrl(id),
      staleTime: 5 * 60 * 1000
    });
}
