'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SpinnerOverlay, SkipToContent } from '@/components/ui';
import clsx from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isOpen, isMobile, setIsMobile } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return <SpinnerOverlay text="Loading..." />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content for accessibility */}
      <SkipToContent />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          isOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main id="main-content" className="p-4 lg:p-6 pb-20 lg:pb-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
