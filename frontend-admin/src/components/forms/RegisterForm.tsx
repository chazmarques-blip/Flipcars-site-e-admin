'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { registerSchema, RegisterFormData } from '@/lib/validation/auth.schemas';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      toast.success('Registration successful! Welcome to FlipCars 2.0');
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...registerField('name')}
          type="text"
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          leftIcon={<User className="w-5 h-5" />}
          autoComplete="name"
          required
        />
      </div>

      <div>
        <Input
          {...registerField('email')}
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          error={errors.email?.message}
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <Input
          {...registerField('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          helperText="Must be at least 8 characters with uppercase, lowercase, and number/special character"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          autoComplete="new-password"
          required
        />
      </div>

      <div>
        <Input
          {...registerField('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
          autoComplete="new-password"
          required
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          required
          className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="/terms" className="text-primary hover:text-primary-600 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:text-primary-600 font-medium">
            Privacy Policy
          </a>
        </label>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a
          href="/auth/login"
          className="text-primary hover:text-primary-600 font-medium transition-colors"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
