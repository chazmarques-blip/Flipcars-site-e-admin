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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Give Zustand time to hydrate from localStorage
    const timer = setTimeout(() => {
      try {
        setIsChecking(false);
        setHasChecked(true);
      } catch (err) {
        console.error('[ProtectedRoute] Error during hydration check:', err);
        setError('Failed to load authentication state');
        // Clear potentially corrupted storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
      }
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

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
