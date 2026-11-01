'use client';

import { MyBookingsPage } from '../../views/MyBookingsPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <MyBookingsPage navigate={navigate} />;
}
