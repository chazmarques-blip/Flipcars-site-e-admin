'use client';

import React from 'react';
import { Appointment, AppointmentStatus } from '@/lib/api/appointments.service';
import { Clock, Car, Shield, AlertTriangle } from 'lucide-react';

interface EventBadgeProps {
  appointment: Appointment;
  onClick?: () => void;
  className?: string;
}

// Get badge color based on status
const getStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-50 border-blue-200 text-blue-700',
    [AppointmentStatus.CONFIRMED]: 'bg-green-50 border-green-200 text-green-700',
    [AppointmentStatus.COMPLETED]: 'bg-gray-50 border-gray-200 text-gray-700',
    [AppointmentStatus.CANCELLED]: 'bg-red-50 border-red-200 text-red-700',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-50 border-orange-200 text-orange-700',
    [AppointmentStatus.RESCHEDULED]: 'bg-purple-50 border-purple-200 text-purple-700',
  };
  return colorMap[status] || colorMap[AppointmentStatus.SCHEDULED];
};

// Get priority badge color
const getPriorityColor = (priority?: string): string => {
  if (!priority) return 'bg-gray-100 text-gray-700';
  
  const colorMap: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };
  return colorMap[priority] || 'bg-gray-100 text-gray-700';
};

// Format status for display
const formatStatus = (status: AppointmentStatus): string => {
  const statusMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'Scheduled',
    [AppointmentStatus.CONFIRMED]: 'Confirmed',
    [AppointmentStatus.COMPLETED]: 'Completed',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
    [AppointmentStatus.NO_SHOW]: 'No Show',
    [AppointmentStatus.RESCHEDULED]: 'Rescheduled',
  };
  return statusMap[status] || status;
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

  return (
    <div
      onClick={onClick}
      className={`
        ${getStatusColor(status)}
        border rounded-lg p-3 cursor-pointer
        hover:shadow-md transition-shadow
        ${className}
      `}
    >
      {/* Header: Reference Number + Time */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span>{lead?.referenceNumber || 'N/A'}</span>
        </div>
        {appointmentTimeSlot && (
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            <span>{appointmentTimeSlot}</span>
          </div>
        )}
      </div>

      {/* Customer Name */}
      <p className="font-semibold text-sm mb-1 truncate">
        {lead?.name || 'Unknown Customer'}
      </p>

      {/* Vehicle Info */}
      {vehicleInfo && (
        <div className="flex items-center gap-1.5 text-xs mb-2 text-gray-600">
          <Car className="w-3 h-3" />
          <span className="truncate">{vehicleInfo}</span>
        </div>
      )}

      {/* Tags Row */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {/* Status Badge */}
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/50">
          {formatStatus(status)}
        </span>

        {/* Priority Badge */}
        {lead?.priority && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
            {lead.priority.toUpperCase()}
          </span>
        )}

        {/* Insurance Badge */}
        {lead?.hasInsurance && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Insured
          </span>
        )}

        {/* Estimated Value */}
        {lead?.estimatedValue && lead.estimatedValue > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            ${Number(lead.estimatedValue).toLocaleString()}
          </span>
        )}
      </div>

      {/* Phone (hidden on small screens) */}
      {lead?.phone && (
        <p className="text-xs text-gray-500 mt-2 truncate hidden sm:block">
          {lead.phone}
        </p>
      )}
    </div>
  );
}
