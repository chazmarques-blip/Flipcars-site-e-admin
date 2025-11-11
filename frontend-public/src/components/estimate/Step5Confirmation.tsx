'use client';

import React from 'react';
import { CheckCircle, Phone, Mail, Clock, MapPin, Calendar, User, Car } from 'lucide-react';
import { EstimateRequest, FLIPCARS_LOCATION } from '@/types/estimate';
import { Button } from '@/components/ui/Button';

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

  return (
    <>
      {/* Screen Version - Compact */}
      <div className="space-y-2 print:hidden">
        {/* Success Icon + Title + Reference in one section */}
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1.5">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-base font-bold text-black mb-0.5">
            Thank You, {data.firstName}!
          </h3>
          <p className="text-[11px] text-neutral-600 mb-2">
            We've received your estimate request
          </p>
        </div>

        {/* Reference Number - Compact */}
        <div className="p-2.5 bg-gradient-to-br from-black to-black/90 rounded-lg text-center">
          <p className="text-[9px] text-gold/80 mb-0.5">Reference Number</p>
          <p className="text-lg font-bold text-gold tracking-wide">
            {referenceNumber}
          </p>
          <p className="text-[9px] text-gold/60 mt-0.5">
            Save for tracking
          </p>
        </div>

        {/* Email Confirmation - Compact */}
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-50 rounded-lg">
          <Mail className="w-3.5 h-3.5 text-black flex-shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-black">Confirmation sent to</p>
            <p className="text-[9px] text-neutral-600">{data.email}</p>
          </div>
        </div>

        {/* What Happens Next - Inline Compact */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-black">What happens next?</h4>
          
          <div className="space-y-1">
            {/* Step 1 - Inline */}
            <div className="flex items-center gap-1.5">
              <div className="flex-shrink-0 w-5 h-5 bg-gold text-black rounded-full flex items-center justify-center font-bold text-[10px]">
                1
              </div>
              <p className="text-[11px] text-black">
                <span className="font-medium">Review</span> <span className="text-neutral-600">(~1 hour)</span>
              </p>
            </div>

            {/* Step 2 - Inline */}
            <div className="flex items-center gap-1.5">
              <div className="flex-shrink-0 w-5 h-5 bg-gold text-black rounded-full flex items-center justify-center font-bold text-[10px]">
                2
              </div>
              <p className="text-[11px] text-black">
                <span className="font-medium">Contact</span> <span className="text-neutral-600">via your preferred method</span>
              </p>
            </div>

            {/* Step 3 - Inline */}
            <div className="flex items-center gap-1.5">
              <div className="flex-shrink-0 w-5 h-5 bg-gold text-black rounded-full flex items-center justify-center font-bold text-[10px]">
                3
              </div>
              <p className="text-[11px] text-black">
                <span className="font-medium">Schedule</span> <span className="text-neutral-600">your appointment</span>
              </p>
            </div>
          </div>
        </div>

        {/* Location - Compact with smaller map */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-black p-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <h4 className="text-[11px] font-semibold text-gold">Our Location</h4>
          </div>
          <div className="h-32 bg-neutral-100">
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
          <div className="p-1.5 bg-neutral-50 space-y-0.5">
            <p className="text-[11px] font-medium text-black">{FLIPCARS_LOCATION.name}</p>
            <p className="text-[9px] text-neutral-700 leading-tight">{FLIPCARS_LOCATION.address}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3 text-black" />
              <a 
                href={`tel:${FLIPCARS_LOCATION.phone.replace(/[^0-9]/g, '')}`}
                className="text-[11px] font-semibold text-black hover:text-gold transition-colors"
              >
                {FLIPCARS_LOCATION.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex flex-col gap-1.5 pt-1">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="w-full py-2 bg-black hover:bg-black/90 text-gold border border-gold font-semibold text-sm"
          >
            Back to Home
          </Button>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[10px] text-neutral-600 hover:text-black transition-colors py-0.5"
          >
            📄 Print this confirmation
          </button>
        </div>
      </div>

      {/* Print Version - Optimized for Letter Size (8.5" x 11") */}
      <div className="hidden print:block print-version">
        {/* Header with Logo and Company Name */}
        <div className="print-header">
          <div className="print-logo">
            <div className="logo-icon">🚗</div>
            <h1>FLIPCARS AUTO REPAIR</h1>
          </div>
          <div className="print-subtitle">
            {data.serviceType === 'bodyshop' ? 'Body Shop Repair' : 'Mechanic Service'} - Estimate Request Confirmation
          </div>
        </div>

        {/* Reference Number - Prominent */}
        <div className="print-reference">
          <div className="reference-label">Reference Number</div>
          <div className="reference-number">{referenceNumber}</div>
          <div className="reference-date">
            Submitted on {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {data.preferredDate && (
              <div className="scheduled-date">
                Scheduled: {formatDate(data.preferredDate)}
                {data.preferredTimeSlot && ` at ${data.preferredTimeSlot}`}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid - Two Columns */}
        <div className="print-grid">
          {/* Left Column */}
          <div className="print-column">
            {/* Customer Information */}
            <div className="print-section">
              <div className="section-title">
                <User className="section-icon" />
                Customer Information
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{data.firstName} {data.lastName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{data.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{data.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Service:</span>
                  <span className="info-value">
                    {data.serviceType === 'bodyshop' ? 'Body Shop Repair' : 'Mechanic Service'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            {data.vehicle && (
              <div className="print-section">
                <div className="section-title">
                  <Car className="section-icon" />
                  Vehicle Details
                </div>
                <div className="section-content">
                  {data.vehicle.vin && (
                    <div className="info-row">
                      <span className="info-label">VIN:</span>
                      <span className="info-value">{data.vehicle.vin}</span>
                    </div>
                  )}
                  {data.vehicle.year && (
                    <div className="info-row">
                      <span className="info-label">Year:</span>
                      <span className="info-value">{data.vehicle.year}</span>
                    </div>
                  )}
                  {data.vehicle.make && (
                    <div className="info-row">
                      <span className="info-label">Make:</span>
                      <span className="info-value">{data.vehicle.make}</span>
                    </div>
                  )}
                  {data.vehicle.model && (
                    <div className="info-row">
                      <span className="info-label">Model:</span>
                      <span className="info-value">{data.vehicle.model}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Information */}
            <div className="print-section">
              <div className="section-title">
                <Calendar className="section-icon" />
                Scheduled Appointment
              </div>
              <div className="section-content">
                <div className="info-row">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {data.preferredDate ? formatDate(data.preferredDate) : 'To be scheduled'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Time:</span>
                  <span className="info-value">{formatTime(data.preferredTimeSlot)}</span>
                </div>
                {data.serviceType === 'bodyshop' && data.insuranceCompany && (
                  <div className="info-row">
                    <span className="info-label">Insurance:</span>
                    <span className="info-value">{data.insuranceCompany}</span>
                  </div>
                )}
                {data.serviceType === 'mechanic' && data.warrantyCompany && (
                  <div className="info-row">
                    <span className="info-label">Warranty:</span>
                    <span className="info-value">{data.warrantyCompany}</span>
                  </div>
                )}
                <div className="info-note">
                  * Appointment subject to confirmation by our team
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="print-column">
            {/* Location and Contact */}
            <div className="print-section location-section">
              <div className="section-title">
                <MapPin className="section-icon" />
                Our Location
              </div>
              <div className="section-content">
                <div className="location-name">{FLIPCARS_LOCATION.name}</div>
                <div className="location-address">{FLIPCARS_LOCATION.address}</div>
                
                <div className="contact-info">
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <div>
                      <div className="contact-label">Phone</div>
                      <div className="contact-value">{FLIPCARS_LOCATION.phone}</div>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <Clock className="contact-icon" />
                    <div>
                      <div className="contact-label">Business Hours</div>
                      <div className="contact-value">
                        Mon-Fri: 9:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 12:00 PM<br />
                        Sunday: Closed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Image for Print */}
                <div className="map-container">
                  <img 
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${FLIPCARS_LOCATION.coordinates.lat},${FLIPCARS_LOCATION.coordinates.lng}&zoom=15&size=600x300&scale=2&markers=color:red%7Clabel:F%7C${FLIPCARS_LOCATION.coordinates.lat},${FLIPCARS_LOCATION.coordinates.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                    alt="FlipCars Location Map"
                    className="location-map-img"
                    onError={(e) => {
                      // Fallback if map fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLElement).nextElementSibling;
                      if (fallback) (fallback as HTMLElement).style.display = 'block';
                    }}
                  />
                  <div className="map-fallback" style={{ display: 'none' }}>
                    <div className="map-icon">📍</div>
                    <div className="map-text">
                      <strong>{FLIPCARS_LOCATION.name}</strong><br />
                      {FLIPCARS_LOCATION.address}<br />
                      <strong>Phone:</strong> {FLIPCARS_LOCATION.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="print-section next-steps">
              <div className="section-title">What Happens Next?</div>
              <div className="section-content">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-text">
                    <strong>Review</strong> - We'll review your request within 1 hour
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-text">
                    <strong>Contact</strong> - We'll reach out via your preferred method
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-text">
                    <strong>Service</strong> - We'll confirm your appointment and provide estimate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div className="footer-message">
            Thank you for choosing FlipCars Auto Repair! We look forward to serving you.
          </div>
          <div className="footer-reference">
            Please keep this confirmation for your records. Reference: <strong>{referenceNumber}</strong>
          </div>
        </div>
      </div>
      
      {/* Print-optimized styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.75in 0.5in;
          }
          
          /* Hide everything except print version */
          body * {
            visibility: hidden !important;
          }
          
          .print-version,
          .print-version * {
            visibility: visible !important;
          }
          
          .print-version {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            font-family: 'Arial', 'Helvetica', sans-serif;
          }

          /* Header */
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #D4AF37;
            padding-bottom: 15px;
          }

          .print-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 8px;
          }

          .logo-icon {
            font-size: 32px;
          }

          .print-logo h1 {
            font-size: 26px;
            font-weight: bold;
            color: #000;
            margin: 0;
            letter-spacing: 1px;
          }

          .print-subtitle {
            font-size: 14px;
            color: #666;
            font-weight: 500;
          }

          /* Reference Number */
          .print-reference {
            background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
            color: #D4AF37;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 2px solid #D4AF37;
          }

          .reference-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
            opacity: 0.8;
          }

          .reference-number {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 5px;
          }

          .reference-date {
            font-size: 10px;
            opacity: 0.7;
          }

          .scheduled-date {
            margin-top: 4px;
            font-size: 11px;
            opacity: 0.9;
            font-weight: 600;
          }

          /* Grid Layout */
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }

          .print-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          /* Sections */
          .print-section {
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
            page-break-inside: avoid;
          }

          .section-title {
            background: #f5f5f5;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
            border-bottom: 2px solid #D4AF37;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .section-icon {
            width: 14px;
            height: 14px;
            color: #D4AF37;
          }

          .section-content {
            padding: 12px;
            font-size: 10px;
          }

          .info-row {
            display: flex;
            margin-bottom: 6px;
            line-height: 1.4;
          }

          .info-label {
            font-weight: 600;
            min-width: 60px;
            color: #666;
          }

          .info-value {
            color: #000;
            flex: 1;
          }

          .info-note {
            font-size: 8px;
            color: #999;
            font-style: italic;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #eee;
          }

          /* Location Section */
          .location-section .section-content {
            padding: 10px;
          }

          .location-name {
            font-size: 13px;
            font-weight: bold;
            color: #000;
            margin-bottom: 6px;
          }

          .location-address {
            font-size: 11px;
            color: #000;
            font-weight: 500;
            margin-bottom: 12px;
            line-height: 1.5;
          }

          .contact-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 12px;
          }

          .contact-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }

          .contact-icon {
            width: 14px;
            height: 14px;
            color: #D4AF37;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .contact-label {
            font-size: 9px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          }

          .contact-value {
            font-size: 10px;
            color: #000;
            font-weight: 600;
            line-height: 1.4;
          }

          /* Map Container */
          .map-container {
            margin-top: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
          }

          .location-map-img {
            width: 100%;
            height: auto;
            display: block;
            max-height: 200px;
            object-fit: cover;
            border-radius: 4px;
          }

          .map-fallback {
            background: #f9f9f9;
            border: 2px dashed #ddd;
            border-radius: 4px;
            padding: 15px;
            text-align: center;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .map-icon {
            font-size: 36px;
            margin-bottom: 8px;
          }

          .map-text {
            font-size: 10px;
            color: #666;
            line-height: 1.8;
          }

          .map-text strong {
            color: #000;
            font-size: 11px;
            display: block;
            margin: 4px 0;
          }

          /* Next Steps */
          .next-steps .section-content {
            padding: 10px;
          }

          .step-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
          }

          .step-item:last-child {
            margin-bottom: 0;
          }

          .step-number {
            width: 20px;
            height: 20px;
            background: #D4AF37;
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            flex-shrink: 0;
          }

          .step-text {
            font-size: 9px;
            color: #333;
            line-height: 1.5;
            flex: 1;
          }

          .step-text strong {
            color: #000;
            display: block;
            margin-bottom: 2px;
          }

          /* Footer */
          .print-footer {
            border-top: 2px solid #D4AF37;
            padding-top: 12px;
            text-align: center;
            margin-top: 15px;
          }

          .footer-message {
            font-size: 11px;
            color: #000;
            font-weight: 600;
            margin-bottom: 6px;
          }

          .footer-reference {
            font-size: 9px;
            color: #666;
          }

          .footer-reference strong {
            color: #000;
            font-weight: bold;
          }

          /* Prevent page breaks */
          .print-reference,
          .print-section,
          .print-footer {
            page-break-inside: avoid;
          }

          /* Ensure single page */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </>
  );
}
