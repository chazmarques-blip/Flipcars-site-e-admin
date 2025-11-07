'use client';

import React, { useState } from 'react';
import { EstimateFormModal } from '@/components/estimate';
import { Button } from '@/components/ui/Button';

export default function EstimateTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Estimate Form Test
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to test the free estimate form modal.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white"
        >
          Open Free Estimate Form
        </Button>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Form Features:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 5-step multi-step form</li>
            <li>✅ Service type selection (Bodyshop / Mechanic)</li>
            <li>✅ Insurance/Warranty company dropdowns</li>
            <li>✅ Date picker with business hours (Mon-Fri 9-6, Sat 9-12)</li>
            <li>✅ Photo upload with camera integration (Bodyshop only)</li>
            <li>✅ Contact preferences (Phone, WhatsApp, SMS)</li>
            <li>✅ Form validation with Zod</li>
            <li>✅ Mobile-responsive design</li>
            <li>✅ Main site color scheme (Navy blue + Orange)</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click "Open Free Estimate Form" button</li>
            <li>Fill out Step 1: Basic Information (all 5 fields required)</li>
            <li>Select either "Body Shop" or "Mechanic" service type</li>
            <li>Step 2: Choose insurance/warranty company and optional date</li>
            <li>Step 3 (Bodyshop only): Upload 6 required + optional photos</li>
            <li>Step 4: Select contact preferences and submit</li>
            <li>Step 5: See confirmation with reference number</li>
          </ol>
        </div>
      </div>

      <EstimateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
