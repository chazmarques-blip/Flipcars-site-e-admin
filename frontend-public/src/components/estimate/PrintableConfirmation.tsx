'use client';

import React from 'react';
import { EstimateRequest, FLIPCARS_LOCATION } from '@/types/estimate';

interface PrintableConfirmationProps {
  data: EstimateRequest;
  referenceNumber: string;
}

export function PrintableConfirmation({ data, referenceNumber }: PrintableConfirmationProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'To be scheduled';
    // Fix timezone issue: append T00:00:00 to force local date interpretation
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeSlot?: string) => {
    if (!timeSlot) return 'To be confirmed';
    const [start, end] = timeSlot.split('-');
    const formatHour = (hour: string) => {
      const h = parseInt(hour.split(':')[0]);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayHour}:${hour.split(':')[1]} ${period}`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  const submittedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <>
      <div className="printable-page">
        {/* Title Section with Logo */}
        <div className="title-section">
          <div className="title-logo">
            <img src="/images/flipcars-logo.jpg" alt="FlipCars Logo" />
          </div>
          <div className="title-content">
            <h1>🎯 ESTIMATE REQUEST CONFIRMATION</h1>
            <div className="service-type">
              {data.serviceType === 'bodyshop' ? 'Body Shop Repair Service' : 'Mechanic Service'}
            </div>
          </div>
        </div>

        {/* Reference Number */}
        <div className="reference-box">
          <div className="reference-label">Reference Number</div>
          <div className="reference-number">{referenceNumber}</div>
          <div className="reference-date">
            Submitted: {submittedDate}
          </div>
        </div>

        {/* Info Grid */}
        <div className="info-grid">
          {/* Customer Info */}
          <div className="info-section">
            <div className="section-header">
              <span className="section-icon">📋</span>
              CUSTOMER INFORMATION
            </div>
            <div className="section-content">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{data.firstName} {data.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{data.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{data.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Service:</span>
                <span className="info-value">
                  {data.serviceType === 'bodyshop' ? 'Body Shop Repair' : 'Mechanic Service'}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="info-section">
            <div className="section-header">
              <span className="section-icon">🚗</span>
              VEHICLE INFORMATION
            </div>
            <div className="section-content">
              {data.vehicle?.year && (
                <div className="info-row">
                  <span className="info-label">Year:</span>
                  <span className="info-value">{data.vehicle.year}</span>
                </div>
              )}
              {data.vehicle?.make && (
                <div className="info-row">
                  <span className="info-label">Make:</span>
                  <span className="info-value">{data.vehicle.make}</span>
                </div>
              )}
              {data.vehicle?.model && (
                <div className="info-row">
                  <span className="info-label">Model:</span>
                  <span className="info-value">{data.vehicle.model}</span>
                </div>
              )}
              {data.vehicle?.vin && (
                <div className="info-row">
                  <span className="info-label">VIN:</span>
                  <span className="info-value">{data.vehicle.vin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="info-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              APPOINTMENT DETAILS
            </div>
            <div className="section-content">
              <div className="info-row">
                <span className="info-label">Date:</span>
                <span className="info-value">{formatDate(data.preferredDate)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time:</span>
                <span className="info-value">{formatTime(data.preferredTimeSlot)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className="info-value" style={{ color: '#F59E0B' }}>⏳ Pending Confirmation</span>
              </div>
            </div>
          </div>

          {/* Insurance/Warranty Info */}
          <div className="info-section">
            <div className="section-header">
              <span className="section-icon">💰</span>
              {data.serviceType === 'bodyshop' ? 'INSURANCE' : 'WARRANTY'} INFORMATION
            </div>
            <div className="section-content">
              {data.serviceType === 'bodyshop' && (
                <>
                  {data.insuranceCompany && (
                    <div className="info-row">
                      <span className="info-label">Company:</span>
                      <span className="info-value">{data.insuranceCompany}</span>
                    </div>
                  )}
                  {data.claimNumber && (
                    <div className="info-row">
                      <span className="info-label">Claim #:</span>
                      <span className="info-value">{data.claimNumber}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Has Claim:</span>
                    <span className="info-value">{data.hasInsuranceClaim ? '✓ Yes' : '✗ No'}</span>
                  </div>
                </>
              )}
              {data.serviceType === 'mechanic' && (
                <>
                  {data.warrantyCompany && (
                    <div className="info-row">
                      <span className="info-label">Company:</span>
                      <span className="info-value">{data.warrantyCompany}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Has Warranty:</span>
                    <span className="info-value">{data.hasWarranty ? '✓ Yes' : '✗ No'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="info-section full-width">
            <div className="section-header">
              <span className="section-icon">📞</span>
              CONTACT PREFERENCES
            </div>
            <div className="section-content">
              <div className="preferences">
                {data.preferredContactMethod?.includes('phone') && (
                  <div className="preference-item">
                    <div className="checkbox-icon">✓</div>
                    <span>Phone Call</span>
                  </div>
                )}
                {data.preferredContactMethod?.includes('whatsapp') && (
                  <div className="preference-item">
                    <div className="checkbox-icon">✓</div>
                    <span>WhatsApp</span>
                  </div>
                )}
                {data.preferredContactMethod?.includes('sms') && (
                  <div className="preference-item">
                    <div className="checkbox-icon">✓</div>
                    <span>Text Message</span>
                  </div>
                )}
                {data.preferredContactMethod?.includes('email') && (
                  <div className="preference-item">
                    <div className="checkbox-icon">✓</div>
                    <span>Email</span>
                  </div>
                )}
              </div>
              {data.additionalNotes && (
                <div style={{ marginTop: '4px' }}>
                  <strong style={{ color: '#666', fontSize: '8.5px' }}>Additional Notes:</strong>
                  <div className="notes-box">
                    {data.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="info-section full-width">
            <div className="section-header">
              <span className="section-icon">📍</span>
              OUR LOCATION
            </div>
            <div className="section-content">
              <div className="location-name">{FLIPCARS_LOCATION.name}</div>
              <div className="location-address">
                {FLIPCARS_LOCATION.address}<br />
                <strong>Phone:</strong> {FLIPCARS_LOCATION.phone}<br />
                <strong>Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM | Sat 9:00 AM - 12:00 PM | Sunday Closed
              </div>
              <div className="map-container">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${FLIPCARS_LOCATION.coordinates.lat},${FLIPCARS_LOCATION.coordinates.lng}&zoom=15&size=700x180&scale=2&maptype=roadmap&markers=color:red%7Clabel:F%7C${FLIPCARS_LOCATION.coordinates.lat},${FLIPCARS_LOCATION.coordinates.lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                  alt="FlipCars Location Map"
                  className="location-map"
                  onError={(e) => {
                    console.error('Map failed to load');
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'map-fallback';
                    fallback.textContent = '📍 5200 Old Winter Garden Rd, Suite 110A, Orlando, FL 32811';
                    e.currentTarget.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-message">
            Thank you for choosing FlipCars Auto Repair! We look forward to serving you.
          </div>
          <div className="footer-reference">
            Please keep this confirmation for your records. Reference: <strong>{referenceNumber}</strong> | Page 1 of 1
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @page {
          size: letter portrait;
          margin: 0.5in 0.4in;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .printable-page {
          font-family: 'Arial', 'Helvetica', sans-serif;
          background: white;
          color: #000;
          line-height: 1.2;
          width: 100%;
          max-width: 7.7in;
          margin: 0 auto;
          padding: 0;
        }

        /* Title */
        .title-section {
          background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
          color: #D4AF37;
          padding: 8px 12px;
          border-radius: 5px;
          margin-bottom: 8px;
          border: 2px solid #D4AF37;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-logo {
          flex-shrink: 0;
          height: 30px;
          display: flex;
          align-items: center;
        }

        .title-logo img {
          height: 100%;
          width: auto;
          object-fit: contain;
        }

        .title-content {
          flex: 1;
          text-align: center;
        }

        .title-section h1 {
          font-size: 14px;
          margin-bottom: 2px;
        }

        .service-type {
          font-size: 10px;
          opacity: 0.9;
        }

        /* Reference Box */
        .reference-box {
          background: #f9f9f9;
          border: 2px solid #D4AF37;
          border-radius: 5px;
          padding: 8px;
          text-align: center;
          margin-bottom: 8px;
        }

        .reference-label {
          font-size: 7px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 2px;
        }

        .reference-number {
          font-size: 18px;
          font-weight: bold;
          color: #D4AF37;
          letter-spacing: 2px;
          margin-bottom: 2px;
        }

        .reference-date {
          font-size: 8px;
          color: #666;
        }

        /* Grid Layout */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-section {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .info-section.full-width {
          grid-column: 1 / -1;
        }

        .section-header {
          background: #f5f5f5;
          padding: 5px 8px;
          font-size: 9px;
          font-weight: bold;
          color: #000;
          border-bottom: 2px solid #D4AF37;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .section-icon {
          font-size: 11px;
        }

        .section-content {
          padding: 6px 8px;
          font-size: 8.5px;
          line-height: 1.4;
        }

        .info-row {
          display: flex;
          margin-bottom: 3px;
        }

        .info-label {
          font-weight: 600;
          min-width: 65px;
          color: #666;
        }

        .info-value {
          color: #000;
          font-weight: 500;
        }

        /* Contact Preferences */
        .preferences {
          display: flex;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 8.5px;
        }

        .checkbox-icon {
          width: 11px;
          height: 11px;
          border: 2px solid #D4AF37;
          background: #D4AF37;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 7px;
          font-weight: bold;
        }

        /* Location */
        .location-name {
          font-size: 9px;
          font-weight: bold;
          color: #000;
          margin-bottom: 2px;
        }

        .location-address {
          font-size: 8.5px;
          color: #666;
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .map-container {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 6px;
          background: #f0f0f0;
          min-height: 100px;
        }

        .location-map {
          width: 100%;
          height: auto;
          display: block;
          max-height: 100px;
          object-fit: cover;
          image-rendering: -webkit-optimize-contrast;
        }

        .map-fallback {
          padding: 20px;
          text-align: center;
          font-size: 9px;
          color: #666;
          background: #f9f9f9;
        }

        /* Notes Box */
        .notes-box {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px;
          font-size: 8px;
          color: #666;
          line-height: 1.3;
          margin-top: 4px;
        }

        /* Footer */
        .footer {
          border-top: 2px solid #D4AF37;
          padding-top: 6px;
          margin-top: 8px;
          text-align: center;
        }

        .footer-message {
          font-size: 9px;
          color: #000;
          font-weight: 600;
          margin-bottom: 3px;
        }

        .footer-reference {
          font-size: 7.5px;
          color: #666;
        }

        .footer-reference strong {
          color: #000;
          font-weight: bold;
        }

        /* Mobile Responsive Styles */
        @media screen and (max-width: 768px) {
          .printable-page {
            width: 100%;
            padding: 8px;
          }
          
          @page {
            margin: 0.25in;
          }
          
          .title-section {
            flex-direction: column;
            text-align: center;
            padding: 12px;
          }
          
          .title-logo {
            height: 40px;
            margin-bottom: 8px;
          }
          
          .title-section h1 {
            font-size: 16px;
          }
          
          .service-type {
            font-size: 12px;
          }
          
          .reference-number {
            font-size: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .section-header {
            font-size: 11px;
            padding: 8px 10px;
          }
          
          .section-content {
            padding: 10px 12px;
            font-size: 10px;
          }
          
          .info-label {
            min-width: 80px;
            font-size: 10px;
          }
          
          .info-value {
            font-size: 10px;
          }
          
          .location-address {
            font-size: 10px;
          }
          
          .map-container {
            min-height: 150px;
          }
          
          .location-map {
            max-height: 180px;
          }
          
          .footer-message {
            font-size: 11px;
          }
          
          .footer-reference {
            font-size: 9px;
          }
        }

        /* Print Styles */
        @media print {
          body {
            margin: 0;
            padding: 0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .printable-page {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          
          .info-section {
            page-break-inside: avoid;
          }
          
          .location-map {
            max-height: 120px;
            page-break-inside: avoid;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .map-container {
            page-break-inside: avoid;
            min-height: 120px;
          }
          
          /* Ensure map loads for print */
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
}
