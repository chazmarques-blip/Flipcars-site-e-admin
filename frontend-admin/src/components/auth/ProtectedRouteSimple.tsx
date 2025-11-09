'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRouteSimple({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasChecked(true);
      
      if (!isAuthenticated && !user) {
        console.log('[ProtectedRouteSimple] Not authenticated, redirecting...');
        window.location.href = '/auth/login';
      }
    }
  }, [isLoading, isAuthenticated, user]);

  // Show loading while checking auth
  if (isLoading || !hasChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
