'use client';

import { ClaimForm } from '@/components/forms';

export default function NewClaimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Create New Claim</h1>
        <p className="text-gray-600 mt-1">File a new insurance claim for vehicle damage</p>
      </div>
      
      <ClaimForm />
    </div>
  );
}
