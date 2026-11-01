'use client';

import { LoginPage } from '../../views/LoginPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <LoginPage navigate={navigate} />;
}
