'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EstimatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 2 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-[#FF7A1A] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚗</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Get Your Free Estimate
        </h1>
        <p className="text-gray-600 mb-6">
          Click the "Free Estimate" button in the header to open the form!
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home Page
          </Link>
          <p className="text-sm text-gray-500">
            Redirecting automatically in 2 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
