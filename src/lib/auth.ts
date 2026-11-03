import { User } from '../types/index.ts';

async function authFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...((options.headers as Record<string, string>) || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Authentication request failed (${response.status})`);
  }
  return data as T;
}

/** Updates the logged-in user's profile (name, photoUrl, passwords). */
export async function updateProfile(updates: { name?: string; photoUrl?: string; currentPassword?: string; newPassword?: string }): Promise<User> {
  return (await authFetch<{ user: User }>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })).user;
}