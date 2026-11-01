'use client';

import { HomePage } from '../views/HomePage.tsx';
import { useNavigate } from '../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <HomePage navigate={navigate} />;
}
