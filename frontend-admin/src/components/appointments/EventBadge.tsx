'use client';

import React from 'react';
import { Appointment, AppointmentStatus } from '@/lib/api/appointments.service';
import { Phone, Car, DollarSign, Eye } from 'lucide-react';

interface EventBadgeProps {
  appointment: Appointment;
  onClick?: () => void;
  className?: string;
}

// Get background color based on status
const getStatusBg = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-white',
    [AppointmentStatus.CONFIRMED]: 'bg-green-50',
    [AppointmentStatus.COMPLETED]: 'bg-gray-50',
    [AppointmentStatus.CANCELLED]: 'bg-red-50',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-50',
    [AppointmentStatus.RESCHEDULED]: 'bg-blue-50',
  };
  return colorMap[status] || 'bg-white';
};

// Get status button color and text
const getStatusButton = (status: AppointmentStatus): { color: string; text: string } => {
  const statusMap: Record<AppointmentStatus, { color: string; text: string }> = {
    [AppointmentStatus.SCHEDULED]: { color: 'bg-yellow-500 text-white', text: 'Waiting' },
    [AppointmentStatus.CONFIRMED]: { color: 'bg-green-500 text-white', text: 'Confirm' },
    [AppointmentStatus.COMPLETED]: { color: 'bg-gray-400 text-white', text: 'Completed' },
    [AppointmentStatus.CANCELLED]: { color: 'bg-red-500 text-white', text: 'Cancelled' },
    [AppointmentStatus.NO_SHOW]: { color: 'bg-orange-500 text-white', text: 'No Show' },
    [AppointmentStatus.RESCHEDULED]: { color: 'bg-blue-500 text-white', text: 'Check-in' },
  };
  return statusMap[status] || statusMap[AppointmentStatus.SCHEDULED];
};

// Generate avatar initials from name
const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get random avatar background color (consistent per name)
const getAvatarColor = (name?: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  if (!name) return colors[0];
  const index = name.length % colors.length;
  return colors[index];
};

export function EventBadge({ appointment, onClick, className = '' }: EventBadgeProps) {
  const { lead, appointmentTimeSlot, status } = appointment;
  
  // Build vehicle info string
  const vehicleInfo = [
    lead?.vehicleYear || lead?.vehicle?.year,
    lead?.vehicleMake || lead?.vehicle?.make,
    lead?.vehicleModel || lead?.vehicle?.model,
  ]
    .filter(Boolean)
    .join(' ');

  const statusButton = getStatusButton(status);
  const estimatedValue = lead?.estimatedValue ? `$${Number(lead.estimatedValue).toFixed(2)}` : null;

  return (
    <div
      className={`
        ${getStatusBg(status)}
        border border-[#e0e0e0] rounded-[6px] p-[8px]
        hover:border-[#D4AF37] hover:shadow-md transition-all
        ${className}
      `}
    >
      {/* Header: Avatar + Name + Time/Phone */}
      <div className="flex items-start gap-2 mb-2">
        {/* Avatar Circle */}
        <div className={`w-8 h-8 rounded-full ${getAvatarColor(lead?.name)} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-[11px] font-bold">
            {getInitials(lead?.name)}
          </span>
        </div>

        {/* Name + Contact Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[11px] text-[#1a1a1a] truncate mb-0.5">
            {lead?.name || 'Unknown Customer'}
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#666]">
            {appointmentTimeSlot && (
              <span className="font-medium">{appointmentTimeSlot}</span>
            )}
            {lead?.phone && appointmentTimeSlot && <span>•</span>}
            {lead?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" />
                {lead.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-1 mb-2">
        {/* Vehicle Info */}
        {vehicleInfo && (
          <div className="flex items-center gap-1.5 text-[9px] text-[#666]">
            <Car className="w-3 h-3 text-[#999]" />
            <span className="truncate">{vehicleInfo}</span>
          </div>
        )}

        {/* Service Type + Insurance */}
        <div className="flex items-center gap-1.5 text-[9px] text-[#666]">
          <span className="text-[#999]">🔧</span>
          <span>Body Repair</span>
          {lead?.hasInsurance && (
            <>
              <span>•</span>
              <span>Insurance</span>
            </>
          )}
        </div>

        {/* Estimated Value */}
        {estimatedValue && (
          <div className="flex items-center gap-1.5 text-[9px] text-[#666]">
            <DollarSign className="w-3 h-3 text-[#999]" />
            <span>Est. {estimatedValue}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Status Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={`flex-1 px-2 py-1 rounded-[4px] text-[9px] font-semibold ${statusButton.color} transition-all hover:opacity-90`}
        >
          {statusButton.text}
        </button>

        {/* View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="px-2 py-1 rounded-[4px] text-[9px] font-semibold bg-white border border-[#e0e0e0] text-[#666] hover:border-[#D4AF37] hover:bg-[#fffbf0] hover:text-[#D4AF37] transition-all flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          View
        </button>
      </div>

      {/* Reference Number (subtle footer) */}
      {lead?.referenceNumber && (
        <div className="text-[8px] text-[#999] text-center mt-1.5 pt-1.5 border-t border-[#f0f0f0]">
          {lead.referenceNumber}
        </div>
      )}
    </div>
  );
}
