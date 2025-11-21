'use client';

import { ReactNode, useEffect } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { Header } from '@/components/layouts/Header';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { SkipToContent } from '@/components/ui';
import clsx from 'clsx';

export default function Layout({ children }: { children: ReactNode }) {
  const { isOpen, isMobile, setIsMobile } = useSidebar();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipToContent />
      <Sidebar />
      <div
        className={clsx(
          'transition-all duration-300',
          isOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <Header />
        <main id="main-content" className="p-4 lg:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
