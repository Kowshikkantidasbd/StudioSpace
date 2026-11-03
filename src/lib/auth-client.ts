/**
 * Auth helpers used by AuthContext. They call the backend (/api/auth/*) through the Next.js
 * rewrite, so the login cookie stays on this site.
 */
import { User } from '../types/index.ts';

export interface GoogleProfile {
  accessToken?: string;
}

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

const post = (endpoint: string, body?: unknown) =>
  authFetch<{ user: User }>(endpoint, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

export async function signIn(email: string, password: string): Promise<User> {
  return (await post('/api/auth/login', { email, password })).user;
}

export async function signUp(name: string, email: string, password: string, photoUrl?: string): Promise<User> {
  return (await post('/api/auth/register', { name, email, password, photoUrl })).user;
}

export async function signInWithGoogle(profile: GoogleProfile = {}): Promise<User> {
  return (await post('/api/auth/google', profile)).user;
}

export async function signOut(): Promise<void> {
  await post('/api/auth/logout');
}

/** Returns the logged-in user, or null when nobody is signed in. */
export async function getSession(): Promise<User | null> {
  try {
    return (await authFetch<{ user: User | null }>('/api/auth/me')).user ?? null;
  } catch {
    return null;
  }
}

/** Updates the logged-in user's profile (name, photoUrl, etc.). */
export async function updateProfile(updates: { name?: string; photoUrl?: string; currentPassword?: string; newPassword?: string }): Promise<User> {
  return (await authFetch<{ user: User }>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })).user;
}
