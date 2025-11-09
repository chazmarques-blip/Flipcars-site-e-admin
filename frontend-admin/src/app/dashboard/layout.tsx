'use client';

import { DashboardLayout } from '@/components/layouts';
import { ProtectedRouteSimple } from '@/components/auth/ProtectedRouteSimple';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRouteSimple>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRouteSimple>
  );
}
