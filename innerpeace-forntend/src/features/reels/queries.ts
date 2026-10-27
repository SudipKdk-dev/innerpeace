import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReels, fetchReelsAdmin, createReel, updateReel, deleteReel } from './api';
import type { CreateReelInput, UpdateReelInput } from './types';

export function useReels() {
    return useQuery({
        queryKey: ['reels'],
        queryFn: fetchReels,
    });
}

export function useReelsAdmin(enabled: boolean) {
    return useQuery({
        queryKey: ['reels', 'admin'],
        queryFn: fetchReelsAdmin,
        enabled,
    });
}

export function useReelMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (input: CreateReelInput) => createReel(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reels'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: number; input: UpdateReelInput }) => updateReel(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reels'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteReel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reels'] });
        },
    });

    return {
        create: createMutation,
        update: updateMutation,
        remove: deleteMutation,
    };
}
