export function resolveMediaUrl(value?: string | null) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const base = import.meta.env.VITE_MEDIA_BASE_URL || import.meta.env.VITE_API_URL;
  if (!base) return value;
  return `${base.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
}
