import { LeadForm } from '@/components/forms/LeadForm';

export const metadata = {
  title: 'New Lead - FlipCars 2.0',
  description: 'Create a new lead',
};

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Create New Lead</h1>
        <p className="text-gray-600 mt-2">
          Add a new lead to the system with customer and vehicle information
        </p>
      </div>

      <LeadForm />
    </div>
  );
}
