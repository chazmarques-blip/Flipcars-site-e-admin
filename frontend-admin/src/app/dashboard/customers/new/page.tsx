'use client';

import { CustomerForm } from '@/components/forms';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Create New Customer</h1>
        <p className="text-gray-600 mt-1">Add a new customer to your database</p>
      </div>
      
      <CustomerForm />
    </div>
  );
}
