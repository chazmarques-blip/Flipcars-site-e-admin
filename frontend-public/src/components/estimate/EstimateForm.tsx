'use client';

import React, { useState } from 'react';
import { EstimateRequest } from '@/types/estimate';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ServiceDetails } from './Step2ServiceDetails';
import { Step2bWarrantyDocs } from './Step2bWarrantyDocs';
import { Step3Photos } from './Step3Photos';
import { Step3aVIN } from './Step3aVIN';
import { Step4Contact } from './Step4Contact';
import { Step5Confirmation } from './Step5Confirmation';

export function EstimateForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EstimateRequest>>({});
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  const handleNext = (stepData: Partial<EstimateRequest>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (finalData: Partial<EstimateRequest>) => {
    const completeData = { ...formData, ...finalData };
    
    console.log('[EstimateForm] Submitting:', completeData);
    
    // Generate reference number
    const refNumber = `FL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNumber(refNumber);
    
    // TODO: Implement API call to submit estimate
    // For now, just move to confirmation
    
    // Move to confirmation step
    const confirmationStep = formData.serviceType === 'bodyshop' ? 6 : 5;
    setCurrentStep(confirmationStep);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({});
    setReferenceNumber('');
  };

  // Determine max step based on service type
  const isBodyshop = formData.serviceType === 'bodyshop';
  const maxSteps = isBodyshop ? 6 : 5; // Bodyshop: 6 steps, Mechanic: 5 steps (includes warranty docs)

  // Calculate progress percentage
  const progressPercentage = (currentStep / maxSteps) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {maxSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF7A1A] transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {currentStep === 1 && (
          <Step1BasicInfo
            initialData={formData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2ServiceDetails
            initialData={formData}
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
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {/* Confirmation */}
        {((currentStep === 5 && formData.serviceType === 'mechanic') ||
          (currentStep === 6 && formData.serviceType === 'bodyshop')) && (
          <Step5Confirmation
            formData={formData}
            referenceNumber={referenceNumber}
            onSubmit={handleSubmit}
            onBack={handleBack}
            onEdit={(step) => setCurrentStep(step)}
            onClose={handleReset}
          />
        )}
      </div>
    </div>
  );
}
