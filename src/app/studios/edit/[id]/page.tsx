'use client';

import { useParams } from 'next/navigation';
import { EditStudioPage } from '../../../../views/EditStudioPage.tsx';
import { useNavigate } from '../../../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return <EditStudioPage studioId={id} navigate={navigate} />;
}
