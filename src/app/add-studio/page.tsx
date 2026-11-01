'use client';

import { AddStudioPage } from '../../views/AddStudioPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <AddStudioPage navigate={navigate} />;
}
