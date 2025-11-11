'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EstimatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to home page
    router.push('/');
  }, [router]);

  // Return null - no UI shown during redirect
  return null;
}
