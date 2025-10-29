import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/forms';

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
      <LoginForm />
    </AuthLayout>
  );
}
