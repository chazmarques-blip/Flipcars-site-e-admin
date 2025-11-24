'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Info, Wallet } from 'lucide-react';
import Image from 'next/image';
import {
  Step2BodyshopFormData,
  Step2MechanicFormData,
  step2BodyshopSchema,
  step2MechanicSchema,
} from '@/lib/validations/estimate';
import { EstimateRequest, INSURANCE_COMPANIES, WARRANTY_COMPANIES, ServiceType } from '@/types/estimate';
import { Button } from '@/components/ui/Button';
import { formatDateDisplay, formatDateInput, getAvailableDates, getAvailableTimeSlots } from '@/lib/utils/calendar';

// Map insurance companies to logo filenames
const getInsuranceLogo = (company: string): string | null => {
  const logoMap: Record<string, string> = {
    'Allstate': '/images/insurance-allstate.png',
    'American Family': '/images/insurance-american-family.png',
    'Erie Insurance': '/images/insurance-erie.png',
    'Farmers Insurance': '/images/insurance-farmers.png',
    'Geico': '/images/insurance-geico.png',
    'Liberty Mutual': '/images/insurance-liberty-mutual.png',
    'Nationwide': '/images/insurance-nationwide.png',
    'Progressive': '/images/insurance-progressive.png',
    'State Farm': '/images/insurance-statefarm.png',
    'Travelers': '/images/insurance-travelers.png',
    'USAA': '/images/insurance-usaa.png',
  };
  return logoMap[company] || null;
};

// Map warranty companies to logo filenames
const getWarrantyLogo = (company: string): string | null => {
  const logoMap: Record<string, string> = {
    'CARCHEX': '/images/warranty-carchex.png',
    'CarShield': '/images/warranty-carshield.jpg',
    'Endurance': '/images/warranty-endurance.png',
    'Protect My Car': '/images/warranty-protect-my-car.png',
  };
  return logoMap[company] || null;
};

interface Step2ServiceDetailsProps {
  initialData: Partial<EstimateRequest>;
  serviceType: ServiceType;
  onNext: (data: Partial<EstimateRequest>) => void;
  onBack: () => void;
}

export function Step2ServiceDetails({ initialData, serviceType, onNext, onBack }: Step2ServiceDetailsProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const isBodyshop = serviceType === 'bodyshop';
  
  const schema = isBodyshop ? step2BodyshopSchema : step2MechanicSchema;
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step2BodyshopFormData | Step2MechanicFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      ...(isBodyshop
        ? {
            insuranceCompany: initialData.insuranceCompany || '',
            claimNumber: initialData.claimNumber || '',
            hasClaimNumber: initialData.hasClaimNumber || false,
          }
        : {
            warrantyCompany: initialData.warrantyCompany || '',
            warrantyClaimNumber: initialData.warrantyClaimNumber || '',
            hasWarrantyClaimNumber: initialData.hasWarrantyClaimNumber || false,
          }),
      preferredDate: initialData.preferredDate || '',
    },
  });

  const companyField = isBodyshop ? 'insuranceCompany' : 'warrantyCompany';
  const claimField = isBodyshop ? 'claimNumber' : 'warrantyClaimNumber';
  const hasClaimField = isBodyshop ? 'hasClaimNumber' : 'hasWarrantyClaimNumber';
  
  const selectedCompany = watch(companyField);
  const hasClaimNumber = watch(hasClaimField);
  const preferredDate = watch('preferredDate');

  const companies = isBodyshop ? INSURANCE_COMPANIES : WARRANTY_COMPANIES;
  const availableDates = getAvailableDates(15); // Limited to 15 days
  const availableTimeSlots = getAvailableTimeSlots();

  const onSubmit = (data: Step2BodyshopFormData | Step2MechanicFormData) => {
    onNext(data);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    setShowTimeSlots(true);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (selectedDate) {
      setValue('preferredDate', formatDateInput(selectedDate), { shouldValidate: true });
      setValue('preferredTimeSlot' as any, timeSlot, { shouldValidate: true });
      setShowTimeSlots(false);
    }
  };

  const handleSkipDate = () => {
    setValue('preferredDate', '', { shouldValidate: true });
    onNext({ ...watch(), dateSkipped: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Company Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Who will pay for the repair? <span className="text-gold">*</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {companies.map((company) => {
            const logo = isBodyshop ? getInsuranceLogo(company) : getWarrantyLogo(company);
            const isSelected = selectedCompany === company;
            
            return (
              <button
                key={company}
                type="button"
                onClick={() => setValue(companyField, company as any, { shouldValidate: true })}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all min-h-[60px] sm:min-h-[70px] ${
                  isSelected
                    ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/30'
                    : 'border-neutral-300 hover:border-neutral-400 bg-white'
                }`}
              >
                {/* Checkmark indicator when selected */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✓</span>
                  </div>
                )}
                
                {logo ? (
                  <>
                    <div className="relative w-full h-7 sm:h-8 mb-0.5 sm:mb-1">
                      <Image
                        src={logo}
                        alt={company}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        unoptimized
                        priority
                      />
                    </div>
                    <span className={`text-[10px] sm:text-xs text-center font-medium leading-tight ${
                      isSelected ? 'text-black' : 'text-neutral-700'
                    }`}>
                      {company}
                    </span>
                  </>
                ) : company === 'Private (Self-Pay)' ? (
                  <>
                    <div className="flex items-center justify-center w-full h-7 sm:h-8 mb-0.5 sm:mb-1">
                      <Wallet className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected ? 'text-gold' : 'text-neutral-500'}`} />
                    </div>
                    <span className={`text-[10px] sm:text-xs text-center font-medium leading-tight ${
                      isSelected ? 'text-black' : 'text-neutral-700'
                    }`}>
                      {company}
                    </span>
                  </>
                ) : (
                  <span className={`text-xs sm:text-sm text-center font-medium ${
                    isSelected ? 'text-black' : 'text-neutral-700'
                  }`}>
                    {company}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {errors[companyField] && !selectedCompany && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 font-medium">⚠️ {errors[companyField]?.message}</p>
          </div>
        )}
      </div>

      {/* Claim Number (conditional) */}
      {selectedCompany && selectedCompany !== 'Private (Self-Pay)' && selectedCompany !== 'Other' && (
        <div className="space-y-0.5">
          <label htmlFor={claimField} className="block text-sm font-medium text-black">
            Claim Number (Optional)
          </label>
          <input
            id={claimField}
            type="text"
            {...register(claimField)}
            placeholder="Enter claim number if available"
            disabled={hasClaimNumber}
            className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-600 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
              hasClaimNumber ? 'bg-neutral-100 cursor-not-allowed' : 'border-neutral-300'
            }`}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register(hasClaimField)}
              className="w-4 h-4 text-gold border-neutral-300 rounded focus:ring-gold"
            />
            <span className="text-sm text-neutral-700">I don't have a claim number yet</span>
          </label>
        </div>
      )}

      {/* Preferred Date & Time */}
      <div className="space-y-0.5">
        <label className="block text-sm font-medium text-black">
          <Calendar className="w-4 h-4 inline mr-1" />
          When would you like to bring your car?
          {selectedCompany && selectedCompany !== 'Private (Self-Pay)' && selectedCompany !== 'Other' && (
            <span className="text-gold ml-1">*</span>
          )}
        </label>
        
        {/* Info message based on payment method */}
        {(selectedCompany === 'Private (Self-Pay)' || selectedCompany === 'Other') && (
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg mb-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-blue-700">
              Since you're paying out of pocket, you can skip scheduling and we'll contact you to arrange an appointment.
            </p>
          </div>
        )}
        
        {selectedCompany && selectedCompany !== 'Private (Self-Pay)' && selectedCompany !== 'Other' && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg mb-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-amber-700">
              <strong>Required:</strong> When using {isBodyshop ? 'insurance' : 'warranty'}, you must schedule an appointment to continue.
            </p>
          </div>
        )}
        
        {!showDatePicker && !showTimeSlots && !preferredDate && (
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full px-3 py-2.5 text-left text-base md:text-sm border border-neutral-300 rounded-lg hover:border-gold focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
            >
              <Calendar className="w-5 h-5 md:w-4 md:h-4 inline mr-2 text-neutral-400" />
              <span className="text-neutral-500">Select a date:</span>
            </button>
          </div>
        )}

        {showDatePicker && (
          <>
            {/* Mobile Overlay - covers entire screen */}
            <div 
              className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
              onClick={() => setShowDatePicker(false)}
            />
            
            {/* Date Picker Modal */}
            <div className="fixed inset-x-4 bottom-4 top-auto border border-neutral-300 rounded-lg p-4 bg-white shadow-2xl z-[9999] max-h-[80vh] overflow-y-auto md:relative md:inset-auto md:z-50 md:shadow-lg">
              <h4 className="text-base font-semibold text-black mb-3">Select a date:</h4>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {availableDates.map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className="px-2 py-3 text-sm font-medium text-black border-2 border-neutral-300 rounded-lg hover:border-gold hover:bg-gold/10 transition-all active:scale-95"
                >
                  <div className="text-xs text-neutral-600 mb-0.5">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-base font-bold">
                    {date.getDate()}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowDatePicker(false)}
              className="mt-3 w-full py-2 text-sm text-neutral-600 hover:text-black border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
          </>
        )}

        {showTimeSlots && selectedDate && (
          <>
            {/* Mobile Overlay - covers entire screen */}
            <div 
              className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
              onClick={() => setShowTimeSlots(false)}
            />
            
            {/* Time Slots Modal */}
            <div className="fixed inset-x-4 bottom-4 top-auto border border-neutral-300 rounded-lg p-4 bg-white shadow-2xl z-[9999] max-h-[80vh] overflow-y-auto md:relative md:inset-auto md:z-50 md:shadow-lg">
              <h4 className="text-base font-semibold text-black mb-3">
              Select time slot for {formatDateDisplay(selectedDate)}:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot.value)}
                  className="px-4 py-3 text-base font-medium text-black border-2 border-neutral-300 rounded-lg hover:border-gold hover:bg-gold/10 transition-all active:scale-95 text-left"
                >
                  {slot.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setShowTimeSlots(false);
                setShowDatePicker(true);
              }}
              className="mt-3 w-full py-2 text-sm text-neutral-600 hover:text-black border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              ← Back to dates
            </button>
          </div>
          </>
        )}

        {preferredDate && !showTimeSlots && (
          <div className="flex items-center justify-between p-2 border border-gold bg-gold/5 rounded-lg">
            <span className="text-sm text-black">
              Selected: {formatDateDisplay(new Date(preferredDate))}
            </span>
            <button
              type="button"
              onClick={() => {
                setValue('preferredDate', '', { shouldValidate: true });
                setSelectedDate(null);
              }}
              className="text-[10px] text-neutral-600 hover:text-black"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* Validation Messages */}
      {selectedCompany && selectedCompany !== 'Private (Self-Pay)' && selectedCompany !== 'Other' && !isValid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700 font-medium">
            ⚠️ When using {isBodyshop ? 'insurance' : 'warranty'}, you must:
          </p>
          <ul className="mt-1 ml-4 text-xs text-red-600 list-disc space-y-0.5">
            {!hasClaimNumber && !(watch(claimField) as string)?.length && (
              <li>Enter {isBodyshop ? 'claim' : 'warranty claim'} number OR check "I don't have a claim number yet"</li>
            )}
            {!preferredDate && (
              <li>Select an appointment date and time</li>
            )}
          </ul>
        </div>
      )}

      {/* Action Buttons - HIDDEN when date/time picker is open on mobile */}
      {!(showDatePicker || showTimeSlots) && (
      <div className="flex gap-2 pt-2 fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:relative md:border-0 md:p-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-black text-black hover:bg-black hover:text-white py-1.5 text-xs"
        >
          ← Back
        </Button>
        {/* Only show Skip Date button if "Private (Self-Pay)" or "Other" is selected (paying out of pocket) */}
        {(selectedCompany === 'Private (Self-Pay)' || selectedCompany === 'Other') && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkipDate}
            className="flex-1 text-neutral-600 hover:text-black py-1.5 text-xs"
          >
            Skip Date
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className={`${(selectedCompany === 'Private (Self-Pay)' || selectedCompany === 'Other') ? 'flex-1' : 'flex-[2]'} bg-gold hover:bg-gold-dark text-black font-semibold py-1.5 text-xs`}
          disabled={!isValid}
        >
          Continue →
        </Button>
      </div>
      )}
    </form>
  );
}
