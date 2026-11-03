'use client';

import { ProfilePage } from '../../views/ProfilePage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <ProfilePage navigate={navigate} />;
}
