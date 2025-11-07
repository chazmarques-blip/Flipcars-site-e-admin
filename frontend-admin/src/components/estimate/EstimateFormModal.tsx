'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EstimateRequest } from '@/types/estimate';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2ServiceDetails } from './Step2ServiceDetails';
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

  const handleSubmit = async (finalData: Partial<EstimateRequest>) => {
    const completeData = { ...formData, ...finalData };
    
    console.log('[EstimateForm] Submitting:', completeData);
    
    // Generate reference number
    const refNumber = `FL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceNumber(refNumber);
    
    try {
      // Import lead service dynamically to avoid circular dependencies
      const { leadService } = await import('@/lib/api/lead.service');
      
      // Convert estimate data to lead format
      const leadData = {
        name: `${completeData.firstName} ${completeData.lastName}`,
        email: completeData.email!,
        phone: completeData.phone!,
        source: 'website_estimate_form',
        hasInsurance: completeData.serviceType === 'bodyshop' && !!completeData.insuranceCompany,
        insuranceCompany: completeData.insuranceCompany,
        insurancePolicyNumber: completeData.claimNumber,
        serviceType: completeData.serviceType,
        referenceNumber: refNumber,
        vehicle: {
          // Vehicle details would come from additional form fields if needed
        },
        damageDescription: completeData.additionalNotes || 'Estimate request from website',
        notes: `Contact preferences: ${
          completeData.contactPreferences?.phoneCall ? 'Phone ' : ''
        }${
          completeData.contactPreferences?.whatsapp ? 'WhatsApp ' : ''
        }${
          completeData.contactPreferences?.textMessage ? 'SMS' : ''
        }`,
      };
      
      // Create the lead
      const newLead = await leadService.createLead(leadData as any);
      console.log('[EstimateForm] Lead created successfully:', newLead);
    } catch (error) {
      console.error('[EstimateForm] Error creating lead:', error);
      // Continue to confirmation anyway
    }
    
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
  const maxSteps = isBodyshop ? 6 : 4; // Bodyshop has photos + VIN steps, mechanic doesn't

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[90vh] m-4 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-black">
          <div>
            <h2 className="text-base font-bold text-gold">
              {(currentStep === 5 && !isBodyshop) || currentStep === 6 ? 'Request Submitted!' : 'Free Estimate Request'}
            </h2>
            {((currentStep < 5 && !isBodyshop) || (currentStep < 6 && isBodyshop)) && (
              <p className="text-[10px] text-gold/70 mt-0.5">
                Step {currentStep} of {maxSteps}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gold/70 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        {((currentStep < 5 && !isBodyshop) || (currentStep < 6 && isBodyshop)) && (
          <div className="h-1 bg-neutral-200">
            <div
              className="h-full bg-gold transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / maxSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 py-3 pb-20 md:pb-3">
          {currentStep === 1 && (
            <Step1BasicInfo
              initialData={formData}
              onNext={handleNext}
              onCancel={onClose}
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
          
          {currentStep === 3 && isBodyshop && (
            <Step3Photos
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 4 && isBodyshop && (
            <Step3aVIN
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {((currentStep === 3 && !isBodyshop) || (currentStep === 5 && isBodyshop)) && (
            <Step4Contact
              initialData={formData}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
          
          {((currentStep === 5 && !isBodyshop) || (currentStep === 6 && isBodyshop)) && (
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
