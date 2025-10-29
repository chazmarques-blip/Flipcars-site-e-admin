import { DashboardLayout } from '@/components/layouts';

export const metadata = {
  title: 'Dashboard - FlipCars 2.0',
  description: 'FlipCars admin dashboard',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
