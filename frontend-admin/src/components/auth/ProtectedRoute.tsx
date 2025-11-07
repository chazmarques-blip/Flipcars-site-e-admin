'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Give Zustand time to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
      setHasChecked(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // After hydration check, redirect if not authenticated
  useEffect(() => {
    if (hasChecked && !isAuthenticated && !user) {
      console.log('[ProtectedRoute] Not authenticated, redirecting to login');
      window.location.href = '/auth/login';
    }
  }, [hasChecked, isAuthenticated, user]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated && !user) {
    return null;
  }

  return <>{children}</>;
}
