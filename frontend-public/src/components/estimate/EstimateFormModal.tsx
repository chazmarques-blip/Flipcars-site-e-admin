'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EstimateRequest } from '@/types/estimate';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ServiceDetails } from './Step2ServiceDetails';
import { Step2bWarrantyDocs } from './Step2bWarrantyDocs';
import { Step3Photos } from './Step3Photos';
import { Step3aVIN } from './Step3aVIN';
import { Step4Contact } from './Step4Contact';
import { Step5Confirmation } from './Step5Confirmation';

interface EstimateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EstimateFormModal({ isOpen, onClose }: EstimateFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EstimateRequest>>({});
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  if (!isOpen) return null;

  const handleNext = (stepData: Partial<EstimateRequest>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleContactSubmit = async (finalData: Partial<EstimateRequest>) => {
    const completeData = { ...formData, ...finalData } as EstimateRequest;
    
    console.log('[EstimateForm] Submitting:', completeData);
    
    // Generate reference number
    const refNumber = `FL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNumber(refNumber);
    
    // Update form data with final data
    setFormData(completeData);
    
    // TODO: Implement API call to submit estimate
    // Example:
    // try {
    //   const response = await fetch('/api/estimates', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(completeData)
    //   });
    //   if (!response.ok) throw new Error('Failed to submit');
    // } catch (error) {
    //   console.error('Submission error:', error);
    //   // Show error message to user
    //   return;
    // }
    
    // Move to confirmation step
    const confirmationStep = formData.serviceType === 'bodyshop' ? 6 : 5;
    setCurrentStep(confirmationStep);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({});
    setReferenceNumber('');
    onClose();
  };

  // Determine max step based on service type
  const isBodyshop = formData.serviceType === 'bodyshop';
  const maxSteps = isBodyshop ? 6 : 5; // Bodyshop: 6 steps, Mechanic: 5 steps (includes warranty docs)

  // Calculate progress percentage
  const progressPercentage = (currentStep / maxSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[90vh] m-4 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-black">
          <h2 className="text-lg font-bold text-white">Free Estimate</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {maxSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentStep === 1 && (
            <Step1BasicInfo
              initialData={formData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2ServiceDetails
              initialData={formData}
              serviceType={formData.serviceType!}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Warranty Docs - Only for mechanic */}
          {currentStep === 3 && formData.serviceType === 'mechanic' && (
            <Step2bWarrantyDocs
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Photos - Only for bodyshop */}
          {currentStep === 3 && formData.serviceType === 'bodyshop' && (
            <Step3Photos
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* VIN Entry - Only for bodyshop */}
          {currentStep === 4 && formData.serviceType === 'bodyshop' && (
            <Step3aVIN
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Contact Preferences */}
          {((currentStep === 4 && formData.serviceType === 'mechanic') ||
            (currentStep === 5 && formData.serviceType === 'bodyshop')) && (
            <Step4Contact
              initialData={formData}
              onSubmit={handleContactSubmit}
              onBack={handleBack}
            />
          )}

          {/* Confirmation */}
          {((currentStep === 5 && formData.serviceType === 'mechanic') ||
            (currentStep === 6 && formData.serviceType === 'bodyshop')) && (
            <Step5Confirmation
              data={formData as EstimateRequest}
              referenceNumber={referenceNumber}
              onClose={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
