export const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://general-constructor-web-4.onrender.com';

export function join(path: string) {
  if (!path) return API_BASE;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}
