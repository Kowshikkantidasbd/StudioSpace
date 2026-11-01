'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/** Returns the `navigate(path)` function the page components expect. */
export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (path: string) => {
      if (path.startsWith('http')) {
        window.open(path, '_blank');
        return;
      }
      router.push(path);
    },
    [router]
  );
}
