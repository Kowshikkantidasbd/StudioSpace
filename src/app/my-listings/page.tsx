'use client';

import { MyListingsPage } from '../../views/MyListingsPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <MyListingsPage navigate={navigate} />;
}
