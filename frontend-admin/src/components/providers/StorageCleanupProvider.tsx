'use client';

import { useEffect } from 'react';
import { cleanupOldStorage } from '@/lib/utils/storage-cleanup';

export function StorageCleanupProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Run cleanup on mount
    cleanupOldStorage();
  }, []);

  return <>{children}</>;
}
