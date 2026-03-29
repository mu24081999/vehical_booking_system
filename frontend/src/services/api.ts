import type { ApiEnvelope } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "https://vehical-booking-system-gj84.onrender.com/api/v1";

export const TOKEN_KEY = "vehical_booking_access_token";

export async function apiRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {},
  requireAuth = false,
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(options.headers ?? {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (requireAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data;
}
