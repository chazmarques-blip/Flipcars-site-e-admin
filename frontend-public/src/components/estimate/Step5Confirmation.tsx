'use client';

import React from 'react';
import { CheckCircle, Phone, Mail, Clock, MapPin, Calendar, User, Car, Printer } from 'lucide-react';
import { EstimateRequest, FLIPCARS_LOCATION } from '@/types/estimate';
import { Button } from '@/components/ui/Button';
import { PrintableConfirmation } from './PrintableConfirmation';

interface Step5ConfirmationProps {
  data: EstimateRequest;
  referenceNumber: string;
  onClose: () => void;
}

export function Step5Confirmation({ data, referenceNumber, onClose }: Step5ConfirmationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'To be scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeSlot?: string) => {
    if (!timeSlot) return 'To be confirmed';
    // Convert "9:00-11:00" to "9:00 AM - 11:00 AM"
    const [start, end] = timeSlot.split('-');
    const formatHour = (hour: string) => {
      const h = parseInt(hour.split(':')[0]);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${hour.split(':')[1]} ${period}`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Screen Version - Ultra Compact for No Scroll */}
      <div className="space-y-1.5 print:hidden">
        {/* Success Icon + Title + Reference in one section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-bold text-black mb-0.5">
            Thank You, {data.firstName}!
          </h3>
          <p className="text-[10px] text-neutral-600">
            We've received your request
          </p>
        </div>

        {/* Reference Number - Compact */}
        <div className="p-2 bg-gradient-to-br from-black to-black/90 rounded-lg text-center">
          <p className="text-[8px] text-gold/80 mb-0.5">Reference Number</p>
          <p className="text-base font-bold text-gold tracking-wide">
            {referenceNumber}
          </p>
          <p className="text-[8px] text-gold/60 mt-0.5">
            Save for tracking
          </p>
        </div>

        {/* Email Confirmation - Compact */}
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-50 rounded-lg">
          <Mail className="w-3 h-3 text-black flex-shrink-0" />
          <div>
            <p className="text-[10px] font-medium text-black">Confirmation sent to</p>
            <p className="text-[9px] text-neutral-600">{data.email}</p>
          </div>
        </div>

        {/* What Happens Next - Ultra Compact */}
        <div className="space-y-1">
          <h4 className="text-[11px] font-semibold text-black">What happens next?</h4>
          
          <div className="space-y-1">
            {/* Step 1 - Processing */}
            <div className="flex items-start gap-1">
              <div className="flex-shrink-0 w-4 h-4 bg-gold text-black rounded-full flex items-center justify-center font-bold text-[9px]">
                1
              </div>
              <p className="text-[10px] text-black leading-tight">
                <span className="font-medium">Processing your estimate.</span> <span className="text-neutral-600">We'll contact you if needed.</span>
              </p>
            </div>

            {/* Step 2 - Appointment */}
            <div className="flex items-start gap-1">
              <div className="flex-shrink-0 w-4 h-4 bg-gold text-black rounded-full flex items-center justify-center font-bold text-[9px]">
                2
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-black leading-tight">
                  <span className="font-medium">Waiting for your visit</span> <span className="text-neutral-600">to finalize and repair.</span>
                </p>
                {data.preferredDate && (
                  <div className="mt-0.5 p-1 bg-gold/10 rounded border border-gold/30">
                    <p className="text-[9px] font-medium text-black">
                      📅 {formatDate(data.preferredDate)}
                    </p>
                    {data.preferredTimeSlot && (
                      <p className="text-[9px] text-neutral-700">
                        🕐 {formatTime(data.preferredTimeSlot)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location - Ultra Compact */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-black p-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gold" />
            <h4 className="text-[10px] font-semibold text-gold">Our Location</h4>
          </div>
          <div className="h-24 bg-neutral-100">
            <iframe
              src={FLIPCARS_LOCATION.embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FlipCars Location"
            />
          </div>
          <div className="p-1 bg-neutral-50 space-y-0.5">
            <p className="text-[10px] font-medium text-black">{FLIPCARS_LOCATION.name}</p>
            <p className="text-[8px] text-neutral-700 leading-tight">{FLIPCARS_LOCATION.address}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="w-2.5 h-2.5 text-black" />
              <a 
                href={`tel:${FLIPCARS_LOCATION.phone.replace(/[^0-9]/g, '')}`}
                className="text-[10px] font-semibold text-black hover:text-gold transition-colors"
              >
                {FLIPCARS_LOCATION.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons - Ultra Compact */}
        <div className="flex flex-col gap-1.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-black hover:bg-black/90 text-gold border border-gold font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Confirmation
          </button>
        </div>
      </div>

      {/* Print Version - Optimized for Letter Size (8.5" x 11") */}
      <div className="hidden print:block">
        <PrintableConfirmation data={data} referenceNumber={referenceNumber} />
      </div>
    </>
  );
}
