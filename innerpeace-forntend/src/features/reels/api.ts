import { api } from '@/lib/api';
import type { Reel, CreateReelInput, UpdateReelInput } from './types';

// Public: Get active reels
export async function fetchReels(): Promise<Reel[]> {
    const { data } = await api.get<Reel[]>('/reels');
    return data;
}

// Admin: Get all reels
export async function fetchReelsAdmin(): Promise<Reel[]> {
    const { data } = await api.get<Reel[]>('/reels/admin');
    return data;
}

// Create new reel
export async function createReel(input: CreateReelInput): Promise<Reel> {
    const { data } = await api.post<Reel>('/reels', input);
    return data;
}

// Update reel
export async function updateReel(id: number, input: UpdateReelInput): Promise<Reel> {
    const { data } = await api.patch<Reel>(`/reels/${id}`, input);
    return data;
}

// Delete reel
export async function deleteReel(id: number): Promise<void> {
    await api.delete(`/reels/${id}`);
}
