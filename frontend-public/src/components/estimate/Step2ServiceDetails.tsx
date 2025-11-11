'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Info } from 'lucide-react';
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
    'Nationwide': '/images/insurance-nationwide.png',
    'Progressive': '/images/insurance-progressive.png',
    'State Farm': '/images/insurance-statefarm.png',
    'USAA': '/images/insurance-usaa.png',
    'Geico': '/images/insurance-geico.png',
    'Liberty Mutual': '/images/insurance-liberty-mutual.png',
    'Farmers Insurance': '/images/insurance-farmers.png',
    'Travelers': '/images/insurance-travelers.png',
    'Erie Insurance': '/images/insurance-erie.png',
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {companies.map((company) => {
            const logo = isBodyshop ? getInsuranceLogo(company) : null;
            const isSelected = selectedCompany === company;
            
            return (
              <button
                key={company}
                type="button"
                onClick={() => setValue(companyField, company as any, { shouldValidate: true })}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all min-h-[65px] ${
                  isSelected
                    ? 'border-gold bg-gold/5 shadow-md'
                    : 'border-neutral-300 hover:border-neutral-400 bg-white'
                } ${errors[companyField] ? 'border-red-500' : ''}`}
              >
                {logo ? (
                  <>
                    <div className="relative w-full h-8 mb-0.5">
                      <Image
                        src={logo}
                        alt={company}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <span className={`text-[10px] text-center font-medium leading-tight ${
                      isSelected ? 'text-black' : 'text-neutral-700'
                    }`}>
                      {company}
                    </span>
                  </>
                ) : (
                  <span className={`text-sm text-center font-medium ${
                    isSelected ? 'text-black' : 'text-neutral-700'
                  }`}>
                    {company}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {errors[companyField] && (
          <p className="text-sm text-red-600">{errors[companyField]?.message}</p>
        )}
      </div>

      {/* Claim Number (conditional) */}
      {selectedCompany && selectedCompany !== 'Private (Self-Pay)' && (
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
        </label>
        
        {!showDatePicker && !showTimeSlots && !preferredDate && (
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setShowDatePicker(true)}
              className="w-full px-3 py-2.5 text-left text-base md:text-sm text-black border border-neutral-300 rounded-lg hover:border-gold focus:ring-2 focus:ring-gold focus:border-gold transition-colors"
            >
              <Calendar className="w-5 h-5 md:w-4 md:h-4 inline mr-2 text-neutral-400" />
              <span className="text-neutral-500">Select a date:</span>
            </button>
            <div className="flex items-start gap-2 p-2 bg-neutral-50 rounded-lg">
              <Info className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-neutral-600">
                You can also skip this and we'll contact you to schedule
              </p>
            </div>
          </div>
        )}

        {showDatePicker && (
          <div className="border border-neutral-300 rounded-lg p-3 bg-white">
            <h4 className="text-sm font-medium text-black mb-2">Select a date:</h4>
            <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
              {availableDates.map((date) => (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  className="px-3 py-2 text-sm md:text-xs text-black border border-neutral-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-colors"
                >
                  {formatDateDisplay(date)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowDatePicker(false)}
              className="mt-2 text-[10px] text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
          </div>
        )}

        {showTimeSlots && selectedDate && (
          <div className="border border-neutral-300 rounded-lg p-3 bg-white">
            <h4 className="text-sm font-medium text-black mb-2">
              Select time slot for {formatDateDisplay(selectedDate)}:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {availableTimeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot.value)}
                  className="px-3 py-2.5 text-base md:text-sm text-black border border-neutral-300 rounded-lg hover:border-gold hover:bg-gold/5 transition-colors text-left"
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
              className="mt-2 text-[10px] text-neutral-600 hover:text-black"
            >
              ← Back to dates
            </button>
          </div>
        )}

        {preferredDate && !showTimeSlots && (
          <div className="flex flex-col gap-1 p-2 border border-gold bg-gold/5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">
                📅 {formatDateDisplay(new Date(preferredDate))}
              </span>
              <button
                type="button"
                onClick={() => {
                  setValue('preferredDate', '', { shouldValidate: true });
                  setValue('preferredTimeSlot' as any, '', { shouldValidate: true });
                  setSelectedDate(null);
                }}
                className="text-[10px] text-neutral-600 hover:text-black"
              >
                Change
              </button>
            </div>
            {watch('preferredTimeSlot' as any) && (
              <span className="text-xs text-neutral-700">
                🕐 Time: {watch('preferredTimeSlot' as any)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:relative md:border-0 md:p-0">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-black text-black hover:bg-black hover:text-white py-1.5 text-xs"
        >
          ← Back
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSkipDate}
          className="flex-1 text-neutral-600 hover:text-black py-1.5 text-xs"
        >
          Skip Date
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-1.5 text-xs"
          disabled={!isValid}
        >
          Continue →
        </Button>
      </div>
    </form>
  );
}
