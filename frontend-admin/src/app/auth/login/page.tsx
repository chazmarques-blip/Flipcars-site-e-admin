import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginFormSimple } from '@/components/forms/LoginFormSimple';

export const metadata = {
  title: 'Login - FlipCars 2.0',
  description: 'Sign in to your FlipCars account',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <LoginFormSimple />
    </AuthLayout>
  );
}
