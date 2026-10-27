import { api } from '@/lib/api';
import { momentSchema, playSchema, presignSchema } from './types';
import { z } from 'zod';

const momentsSchema = z.array(momentSchema);

export async function fetchMoments() {
  const { data } = await api.get('/moments');
  return momentsSchema.parse(data);
}

export async function fetchAdminMoments() {
  const { data } = await api.get('/moments/admin');
  return momentsSchema.parse(data);
}

export async function presignMoment(mimeType: string, ext?: string) {
  const { data } = await api.post('/moments/presign', { mimeType, ext });
  return presignSchema.parse(data);
}

export async function completeMoment(momentId: number) {
  const { data } = await api.post('/moments/complete', { momentId });
  return data as { success: boolean };
}

export async function fetchMomentPlayUrl(id: number) {
  const { data } = await api.get(`/moments/${id}/play`);
  return playSchema.parse(data);
}
