'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EstimateFormModal } from '@/components/estimate/EstimateFormModal';

export default function EstimatePage() {
  const router = useRouter();
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);

  useEffect(() => {
    // Open modal immediately when page loads
    setEstimateModalOpen(true);
  }, []);

  const handleClose = () => {
    // When modal closes, redirect to home page
    setEstimateModalOpen(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Loading state while modal opens */}
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-400">Loading estimate form...</p>
      </div>

      {/* Estimate Form Modal - Opens automatically */}
      <EstimateFormModal 
        isOpen={estimateModalOpen} 
        onClose={handleClose} 
      />
    </div>
  );
}
