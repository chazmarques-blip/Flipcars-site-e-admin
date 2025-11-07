'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { loginSchema, LoginFormData } from '@/lib/validation/auth.schemas';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('[LoginForm] Attempting login with:', data.email);
      await login(data);
      console.log('[LoginForm] Login successful!');
      toast.success('Login successful!');
      
      // Give time for Zustand to persist to localStorage
      setTimeout(() => {
        console.log('[LoginForm] Redirecting to dashboard...');
        // Use window.location for hard navigation to ensure state is persisted
        window.location.href = '/dashboard';
      }, 300);
    } catch (error) {
      console.error('[LoginForm] Login failed:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('email')}
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
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
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
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>

        <a
          href="/auth/forgot-password"
          className="text-sm text-primary hover:text-primary-600 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <a
          href="/auth/register"
          className="text-primary hover:text-primary-600 font-medium transition-colors"
        >
          Sign up
        </a>
      </p>
    </form>
  );
}
