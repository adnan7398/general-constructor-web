export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export function join(path: string) {
  if (!path) return API_BASE;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}
