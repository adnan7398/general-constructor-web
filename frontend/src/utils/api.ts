export const API_BASE = 'https://general-constructor-web-4.onrender.com';

export function join(path: string) {
  if (!path) return API_BASE;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}
