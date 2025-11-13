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
import { trackConversion } from '@/components/GoogleAds';

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
    
    console.log('[EstimateForm] 🚀 Starting submission process');
    console.log('[EstimateForm] Form data:', completeData);
    
    try {
      // Import leadsService dynamically to avoid SSR issues
      console.log('[EstimateForm] 📦 Loading API service...');
      const { leadsService } = await import('@/lib/api/leads.service');
      
      // Send to backend via public API
      console.log('[EstimateForm] 📡 Sending to backend API...');
      console.log('[EstimateForm] API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://upbeat-dedication-production.up.railway.app/api');
      
      const response = await leadsService.createLead(completeData);
      
      console.log('[EstimateForm] ✅ API Response received:', response);
      console.log('[EstimateForm] ✅ Reference Number from backend:', response.data.referenceNumber);
      
      // CRITICAL: Verify response structure
      if (!response || !response.data || !response.data.referenceNumber) {
        throw new Error('Invalid response structure from backend');
      }
      
      // Use server-generated reference number
      setReferenceNumber(response.data.referenceNumber);
      console.log('[EstimateForm] ✅ Reference number set to:', response.data.referenceNumber);
      
      // 🎯 Track Google Ads conversion
      const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (conversionLabel) {
        trackConversion(`${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${conversionLabel}`);
        console.log('[EstimateForm] 🎯 Google Ads conversion tracked');
      }
      
      // Also save to localStorage as backup
      try {
        const leadData = {
          ...completeData,
          referenceNumber: response.data.referenceNumber,
          createdAt: response.data.createdAt,
          status: response.data.status,
          source: 'website_estimate_form',
        };
        
        const existingLeads = JSON.parse(localStorage.getItem('flipcars_completed_leads') || '[]');
        existingLeads.push(leadData);
        localStorage.setItem('flipcars_completed_leads', JSON.stringify(existingLeads));
        
        console.log('[EstimateForm] 💾 Backup saved to localStorage');
      } catch (storageError) {
        console.warn('[EstimateForm] ⚠️ Could not save to localStorage:', storageError);
      }
      
    } catch (error: any) {
      console.error('[EstimateForm] ❌ ERROR DETAILS:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      });
      
      // Log detailed error information
      if (error.response) {
        console.error('[EstimateForm] ❌ Response Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('[EstimateForm] ❌ Network Error: No response received');
      } else {
        console.error('[EstimateForm] ❌ Error:', error.message);
      }
      
      // Fallback: Save to localStorage if backend fails
      console.log('[EstimateForm] ⚠️ Using FALLBACK reference number generation');
      const refNumber = `FL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceNumber(refNumber);
      console.log('[EstimateForm] ⚠️ Fallback reference number:', refNumber);
      
      try {
        const leadData = {
          ...completeData,
          referenceNumber: refNumber,
          createdAt: new Date().toISOString(),
          status: 'new',
          source: 'website_estimate_form',
          _failedSync: true, // Mark as failed sync
          _error: error.message || 'Unknown error',
          _errorDetails: {
            status: error.response?.status,
            data: error.response?.data,
          },
        };
        
        const existingLeads = JSON.parse(localStorage.getItem('flipcars_pending_leads') || '[]');
        existingLeads.push(leadData);
        localStorage.setItem('flipcars_pending_leads', JSON.stringify(existingLeads));
        
        console.log('[EstimateForm] ⚠️ Saved to localStorage (pending sync):', leadData);
      } catch (storageError) {
        console.error('[EstimateForm] ❌ Failed to save to localStorage:', storageError);
      }
    }
    
    // Update form data with final data
    setFormData(completeData);
    
    // Move to confirmation step (always step 6 now)
    console.log('[EstimateForm] 📍 Moving to confirmation step: 6');
    setCurrentStep(6);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({});
    setReferenceNumber('');
    onClose();
  };

  // Determine max step based on service type
  // Both now have 6 steps: Basic Info, Service Details, Warranty/Photos, VIN, Contact, Confirmation
  const maxSteps = 6;

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

          {/* VIN Entry - For both bodyshop and mechanic */}
          {((currentStep === 4 && formData.serviceType === 'mechanic') ||
            (currentStep === 4 && formData.serviceType === 'bodyshop')) && (
            <Step3aVIN
              initialData={formData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Contact Preferences */}
          {((currentStep === 5 && formData.serviceType === 'mechanic') ||
            (currentStep === 5 && formData.serviceType === 'bodyshop')) && (
            <Step4Contact
              initialData={formData}
              onSubmit={handleContactSubmit}
              onBack={handleBack}
            />
          )}

          {/* Confirmation */}
          {((currentStep === 6 && formData.serviceType === 'mechanic') ||
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
