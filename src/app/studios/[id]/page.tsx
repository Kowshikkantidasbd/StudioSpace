'use client';

import { useParams } from 'next/navigation';
import { StudioDetailsPage } from '../../../views/StudioDetailsPage.tsx';
import { useNavigate } from '../../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return <StudioDetailsPage studioId={id} navigate={navigate} />;
}
