import { ReactNode } from 'react';
import { Card } from '@/components/ui';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            FlipCars 2.0
          </h1>
          <p className="text-gray-600">Auto Body Shop Management</p>
        </div>

        {/* Auth Card */}
        <Card variant="elevated" padding="lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} FlipCars 2.0. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
