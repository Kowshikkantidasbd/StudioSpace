'use client';

import { SavedStudiosPage } from '../../views/SavedStudiosPage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

export default function Page() {
  const navigate = useNavigate();
  return <SavedStudiosPage navigate={navigate} />;
}
