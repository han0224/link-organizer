/** Spring API base (no trailing slash). Override with EXPO_PUBLIC_API_BASE_URL for dev. */
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://link-organizer-backend-public.onrender.com"
).replace(/\/$/, "");

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}
