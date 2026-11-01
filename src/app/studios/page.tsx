'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExplorePage } from '../../views/ExplorePage.tsx';
import { useNavigate } from '../../lib/useNavigate.ts';

function Explore() {
  const navigate = useNavigate();
  const category = useSearchParams().get('category') || undefined;
  return <ExplorePage key={category ?? 'all'} initialCategory={category} navigate={navigate} />;
}

export default function Page() {
  return (
    <Suspense>
      <Explore />
    </Suspense>
  );
}
