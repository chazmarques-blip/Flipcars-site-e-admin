'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, Car } from 'lucide-react';
import { Step1FormData, step1Schema } from '@/lib/validations/estimate';
import { EstimateRequest } from '@/types/estimate';
import { Button } from '@/components/ui/Button';

interface Step1BasicInfoProps {
  initialData: Partial<EstimateRequest>;
  onNext: (data: Partial<EstimateRequest>) => void;
  onCancel: () => void;
}

export function Step1BasicInfo({ initialData, onNext, onCancel }: Step1BasicInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      serviceType: initialData.serviceType || 'bodyshop',
    },
  });

  const serviceType = watch('serviceType');

  const onSubmit = (data: Step1FormData) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {/* Service Type Selection */}
      <div className="space-y-0.5">
        <label className="block text-sm font-medium text-black">
          What service do you need? <span className="text-gold">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Body Shop Button */}
          <button
            type="button"
            onClick={() => setValue('serviceType', 'bodyshop', { shouldValidate: true })}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              serviceType === 'bodyshop'
                ? 'border-gold bg-gold/5 shadow-md'
                : 'border-neutral-300 hover:border-neutral-400 bg-white'
            }`}
          >
            <Car className={`w-6 h-6 mb-1 ${serviceType === 'bodyshop' ? 'text-gold' : 'text-neutral-600'}`} />
            <span className={`font-semibold text-sm ${serviceType === 'bodyshop' ? 'text-black' : 'text-neutral-700'}`}>
              Body Shop
            </span>
            <span className="text-xs text-neutral-500 mt-0.5">Collision repair</span>
          </button>

          {/* Mechanic Button */}
          <button
            type="button"
            onClick={() => setValue('serviceType', 'mechanic', { shouldValidate: true })}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              serviceType === 'mechanic'
                ? 'border-gold bg-gold/5 shadow-md'
                : 'border-neutral-300 hover:border-neutral-400 bg-white'
            }`}
          >
            <Wrench className={`w-6 h-6 mb-1 ${serviceType === 'mechanic' ? 'text-gold' : 'text-neutral-600'}`} />
            <span className={`font-semibold text-sm ${serviceType === 'mechanic' ? 'text-black' : 'text-neutral-700'}`}>
              Mechanic
            </span>
            <span className="text-xs text-neutral-500 mt-0.5">General repair</span>
          </button>
        </div>
        {errors.serviceType && (
          <p className="text-sm text-red-600">{errors.serviceType.message}</p>
        )}
      </div>

      {/* First Name */}
      <div className="space-y-1">
        <label htmlFor="firstName" className="block text-sm font-medium text-black">
          First Name <span className="text-gold">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          {...register('firstName')}
          placeholder="Enter your first name"
          className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
            errors.firstName ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.firstName && (
          <p className="text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-1">
        <label htmlFor="lastName" className="block text-sm font-medium text-black">
          Last Name <span className="text-gold">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          {...register('lastName')}
          placeholder="Enter your last name"
          className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
            errors.lastName ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.lastName && (
          <p className="text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-black">
          Phone Number <span className="text-gold">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="(321) 960-8661"
          className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
            errors.phone ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Email Address <span className="text-gold">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          placeholder="your.email@example.com"
          className={`w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-400 border rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors ${
            errors.email ? 'border-red-500' : 'border-neutral-300'
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 md:relative md:border-0 md:p-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-black text-black hover:bg-black hover:text-white py-1.5 text-xs"
        >
          Cancel
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
