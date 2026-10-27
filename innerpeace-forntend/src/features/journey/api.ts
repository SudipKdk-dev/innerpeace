import { api } from '@/lib/api';
import { journeySchema } from './types';
import { z } from 'zod';

const journeysSchema = z.array(journeySchema);

export async function fetchJourneys() {
  const { data } = await api.get('/journey');
  return journeysSchema.parse(data);
}

export async function fetchJourneysAdmin() {
  const { data } = await api.get('/journey/admin');
  return journeysSchema.parse(data);
}

export async function createJourney(form: FormData) {
  const { data } = await api.post('/journey', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return journeySchema.parse(data);
}

export async function updateJourney(id: number, form: FormData) {
  const { data } = await api.patch(`/journey/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return journeySchema.parse(data);
}

export async function deleteJourney(id: number) {
  const { data } = await api.delete(`/journey/${id}`);
  return data as { message?: string };
}
