'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MessageCircle, MessageSquare } from 'lucide-react';
import { Step4ContactFormData, step4ContactSchema } from '@/lib/validations/estimate';
import { EstimateRequest } from '@/types/estimate';
import { Button } from '@/components/ui/Button';

interface Step4ContactProps {
  initialData: Partial<EstimateRequest>;
  onSubmit: (data: Partial<EstimateRequest>) => void;
  onBack: () => void;
}

export function Step4Contact({ initialData, onSubmit, onBack }: Step4ContactProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step4ContactFormData>({
    resolver: zodResolver(step4ContactSchema),
    mode: 'onChange',
    defaultValues: {
      contactPreferences: initialData.contactPreferences || {
        phoneCall: false,
        whatsapp: false,
        textMessage: false,
      },
      additionalNotes: initialData.additionalNotes || '',
    },
  });

  const preferences = watch('contactPreferences');
  const hasSelection = preferences ? (preferences.phoneCall || preferences.whatsapp || preferences.textMessage) : false;

  const onFormSubmit = (data: Step4ContactFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-black">How would you like us to contact you?</h3>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Select your preferred contact method(s)
        </p>
      </div>

      {/* Contact Preferences */}
      <div className="space-y-1.5">
        {/* Phone Call */}
        <label
          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
            preferences?.phoneCall
              ? 'border-gold bg-gold/5'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <input
            type="checkbox"
            {...register('contactPreferences.phoneCall')}
            className="w-4 h-4 mt-0.5 text-gold border-neutral-300 rounded focus:ring-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-black" />
              <span className="font-semibold text-sm text-black">Phone Call</span>
            </div>
            <p className="text-[10px] text-neutral-600 mt-0.5">
              We'll call you to discuss details and answer any questions
            </p>
          </div>
        </label>

        {/* WhatsApp */}
        <label
          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
            preferences?.whatsapp
              ? 'border-gold bg-gold/5'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <input
            type="checkbox"
            {...register('contactPreferences.whatsapp')}
            className="w-4 h-4 mt-0.5 text-gold border-neutral-300 rounded focus:ring-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-black" />
              <span className="font-semibold text-sm text-black">WhatsApp Message</span>
            </div>
            <p className="text-[10px] text-neutral-600 mt-0.5">
              Quick text message on WhatsApp
            </p>
          </div>
        </label>

        {/* Text Message */}
        <label
          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
            preferences?.textMessage
              ? 'border-gold bg-gold/5'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          <input
            type="checkbox"
            {...register('contactPreferences.textMessage')}
            className="w-4 h-4 mt-0.5 text-gold border-neutral-300 rounded focus:ring-gold"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-black" />
              <span className="font-semibold text-sm text-black">Text Message</span>
            </div>
            <p className="text-[10px] text-neutral-600 mt-0.5">
              SMS to your phone number
            </p>
          </div>
        </label>

        {!hasSelection && errors.contactPreferences && (
          <p className="text-sm text-red-600">Please select at least one contact method</p>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-1.5">
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-black">
          Additional Notes (Optional)
        </label>
        <textarea
          id="additionalNotes"
          {...register('additionalNotes')}
          rows={3}
          placeholder="Any additional information you'd like to share..."
          className="w-full px-3 py-2.5 text-base md:text-sm text-gray-900 placeholder:text-gray-400 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors resize-none"
        />
        {errors.additionalNotes && (
          <p className="text-xs text-red-600">{errors.additionalNotes.message}</p>
        )}
      </div>

      {/* Info Banner */}
      <div className="p-3 bg-gold/10 border border-gold/30 rounded-lg">
        <p className="text-xs text-neutral-700">
          <strong>Note:</strong> You can select multiple contact methods. We'll use your preferred method(s) to reach out within 1 hour during business hours.
        </p>
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
          type="submit"
          variant="primary"
          className="flex-1 bg-gold hover:bg-gold-dark text-black font-semibold py-1.5 text-xs"
          disabled={!hasSelection}
        >
          Submit Request
        </Button>
      </div>
    </form>
  );
}
