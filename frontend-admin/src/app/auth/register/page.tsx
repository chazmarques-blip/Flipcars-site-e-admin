import { AuthLayout } from '@/components/layouts/AuthLayout';
import { RegisterForm } from '@/components/forms';

export const metadata = {
  title: 'Register - FlipCars 2.0',
  description: 'Create your FlipCars account',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join FlipCars and start managing your auto body shop"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
