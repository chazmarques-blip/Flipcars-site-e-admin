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
import { fbEvent } from '@/components/FacebookPixel';

interface EstimateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EstimateFormModal({ isOpen, onClose }: EstimateFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EstimateRequest>>({});
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open (mobile UX improvement)
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = (stepData: Partial<EstimateRequest>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    // 🎯 CAPTURA PARCIAL: Salva dados mesmo se não completar
    if (typeof window !== 'undefined') {
      const { capturePartialLead } = require('@/lib/partialLeadCapture');
      capturePartialLead({
        formStep: currentStep + 1,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        serviceType: updatedData.serviceType,
        hasInsurance: updatedData.hasInsurance,
      });
    }
    
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleContactSubmit = async (finalData: Partial<EstimateRequest>) => {
    const completeData = { ...formData, ...finalData } as EstimateRequest;
    
    // Reset previous errors
    setSubmitError(null);
    setIsSubmitting(true);
    
    console.log('[EstimateForm] 🚀 ========== SUBMIT START ==========');
    console.log('[EstimateForm] 📊 Complete Data:', completeData);
    console.log('[EstimateForm] 🌐 API URL:', process.env.NEXT_PUBLIC_API_URL || 'undefined');
    
    // Validate API URL is configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('[EstimateForm] ❌ CRITICAL: NEXT_PUBLIC_API_URL is not configured!');
      setSubmitError('Configuration error. Please contact us at (321) 960-8661.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Import leadsService dynamically to avoid SSR issues
      console.log('[EstimateForm] 📦 Loading API service...');
      const { leadsService } = await import('@/lib/api/leads.service');
      
      // Send to backend via public API
      console.log('[EstimateForm] 📡 Sending to backend API...');
      console.log('[EstimateForm] API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://upbeat-dedication-production.up.railway.app/api');
      
      const response = await leadsService.createLead(completeData);
      
      console.log('[EstimateForm] ✅ ========== SUBMIT SUCCESS ==========');
      console.log('[EstimateForm] 📝 API Response:', response);
      console.log('[EstimateForm] 📝 Reference Number from backend:', response.data.referenceNumber);
      
      // CRITICAL: Verify response structure
      if (!response || !response.data || !response.data.referenceNumber) {
        throw new Error('Invalid response structure from backend');
      }
      
      // Use server-generated reference number (FLIP-YYYYMMDD-XXXX format)
      setReferenceNumber(response.data.referenceNumber);
      console.log('[EstimateForm] ✅ Reference number set to:', response.data.referenceNumber);
      setIsSubmitting(false);
      
      // 🎯 Track Google Ads conversion
      const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (conversionLabel) {
        trackConversion(`${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${conversionLabel}`);
        console.log('[EstimateForm] 🎯 Google Ads conversion tracked');
      }
      
      // 🎯 Track Facebook Pixel Lead event
      fbEvent.lead('Estimate Form Submission');
      console.log('[EstimateForm] 🎯 Facebook Pixel Lead event tracked');
      
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
      
      // SUCCESS: Update form data and move to confirmation step
      setFormData(completeData);
      console.log('[EstimateForm] 📍 Moving to confirmation step: 6');
      setCurrentStep(6);
      
    } catch (error: any) {
      console.error('[EstimateForm] ❌ ========== SUBMIT FAILED ==========');
      console.error('[EstimateForm] Error message:', error.message);
      console.error('[EstimateForm] Error response:', error.response);
      console.error('[EstimateForm] Error status:', error.response?.status);
      console.error('[EstimateForm] Error data:', error.response?.data);
      console.error('[EstimateForm] Request URL:', error.config?.url);
      console.error('[EstimateForm] Request headers:', error.config?.headers);
      console.error('[EstimateForm] ==========================================');
      
      setIsSubmitting(false);
      
      // Determine user-friendly error message
      let userMessage = 'Unable to submit your estimate request. Please try again.';
      
      if (!error.response) {
        // Network error
        userMessage = 'Network error. Please check your internet connection and try again.';
        console.error('[EstimateForm] ❌ Network Error: No response received');
      } else if (error.response.status >= 500) {
        // Server error
        userMessage = 'Server error. Our team has been notified. Please try again in a few moments.';
        console.error('[EstimateForm] ❌ Server Error:', error.response.status, error.response.data);
      } else if (error.response.status === 400) {
        // Validation error
        const validationMsg = error.response.data?.message || 'Invalid data provided.';
        userMessage = `Validation error: ${validationMsg}`;
        console.error('[EstimateForm] ❌ Validation Error:', error.response.data);
      } else {
        console.error('[EstimateForm] ❌ Unexpected Error:', error.message);
      }
      
      // Set error state to show to user
      setSubmitError(userMessage);
      
      // Log for debugging
      console.error('[EstimateForm] 📞 User should call: (321) 960-8661');
      
      // DO NOT go to confirmation step - user stays on current step
      // DO NOT generate fake reference number
      // User will see error message and can retry
    }
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

        {/* Form Content - Scrollable with safe padding */}
        <div className="flex-1 overflow-y-auto p-4 pb-6">
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
            <>
              {/* Error Message */}
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-800 mb-1">Submission Failed</h4>
                      <p className="text-sm text-red-700 mb-3">{submitError}</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleContactSubmit(formData)}
                          disabled={isSubmitting}
                          className="text-sm font-medium text-red-600 hover:text-red-800 underline text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Retrying...' : 'Try Again'}
                        </button>
                        <a
                          href="tel:+13219608661"
                          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Or call us: (321) 960-8661
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Step4Contact
                initialData={formData}
                onSubmit={handleContactSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            </>
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
