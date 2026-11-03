/** Updates the logged-in user's profile (name, photoUrl, passwords). */
export async function updateProfile(updates: { name?: string; photoUrl?: string; currentPassword?: string; newPassword?: string }): Promise<User> {
  return (await authFetch<{ user: User }>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })).user;
}