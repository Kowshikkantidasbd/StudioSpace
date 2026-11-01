'use client';

import { RegisterPage } from '../../views/RegisterPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <RegisterPage navigate={navigate} />;
}
