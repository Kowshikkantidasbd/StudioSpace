'use client';

import { NotFoundPage } from '../views/NotFoundPage.tsx';
import { useNavigate } from '../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <NotFoundPage navigate={navigate} />;
}
