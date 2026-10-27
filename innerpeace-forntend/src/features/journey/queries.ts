import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJourney, deleteJourney, fetchJourneys, fetchJourneysAdmin, updateJourney } from './api';

export function useJourneys() {
  return useQuery({
    queryKey: ['journeys'],
    queryFn: fetchJourneys
  });
}

export function useJourneysAdmin(enabled: boolean) {
  return useQuery({
    queryKey: ['journeys', 'admin'],
    queryFn: fetchJourneysAdmin,
    enabled
  });
}

export function useJourneyMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys', 'admin'] });
    }
  });

  const update = useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) => updateJourney(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys', 'admin'] });
    }
  });

  const remove = useMutation({
    mutationFn: deleteJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys', 'admin'] });
    }
  });

  return { create, update, remove };
}
