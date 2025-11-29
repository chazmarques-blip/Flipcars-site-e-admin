'use client';

import React from 'react';
import { Appointment, AppointmentStatus } from '@/lib/api/appointments.service';
import { Phone } from 'lucide-react';

interface EventBadgeProps {
  appointment: Appointment;
  onClick?: () => void;
  className?: string;
}

// Get background color based on status
const getStatusBg = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-white',
    [AppointmentStatus.CONFIRMED]: 'bg-white',
    [AppointmentStatus.COMPLETED]: 'bg-[#f5f5f5]',
    [AppointmentStatus.CANCELLED]: 'bg-red-50',
    [AppointmentStatus.NO_SHOW]: 'bg-orange-50',
    [AppointmentStatus.RESCHEDULED]: 'bg-blue-50',
  };
  return colorMap[status] || 'bg-white';
};

// Get emoji icon based on type and status
const getEventIcon = (appointment: Appointment): string => {
  // Check if overdue (past date)
  const aptDate = new Date(appointment.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = aptDate < today && appointment.status !== 'completed';
  
  if (isOverdue) {
    return '💰'; // Payment overdue icon
  }
  
  // Check if payment (has estimatedValue)
  if (appointment.lead?.estimatedValue && appointment.lead.estimatedValue > 0) {
    return '💰'; // Payment icon
  }
  
  return '🔧'; // Appointment icon (wrench for service)
};

// Get status button
const getActionButton = (appointment: Appointment): { color: string; icon: string; text: string } => {
  const aptDate = new Date(appointment.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = aptDate < today && appointment.status !== 'completed';
  
  if (isOverdue) {
    return { color: 'bg-[#D4AF37] text-white hover:bg-[#B8941F]', icon: '💬', text: 'Remind' };
  }
  
  const statusMap: Record<AppointmentStatus, { color: string; icon: string; text: string }> = {
    [AppointmentStatus.SCHEDULED]: { color: 'bg-[#D4AF37] text-white hover:bg-[#B8941F]', icon: '✅', text: 'Confirm' },
    [AppointmentStatus.CONFIRMED]: { color: 'bg-[#4caf50] text-white hover:bg-[#45a049]', icon: '📍', text: 'Check-in' },
    [AppointmentStatus.COMPLETED]: { color: 'bg-gray-400 text-white', icon: '✓', text: 'Done' },
    [AppointmentStatus.CANCELLED]: { color: 'bg-red-500 text-white', icon: '✗', text: 'Cancelled' },
    [AppointmentStatus.NO_SHOW]: { color: 'bg-orange-500 text-white', icon: '⚠️', text: 'No Show' },
    [AppointmentStatus.RESCHEDULED]: { color: 'bg-blue-500 text-white', icon: '🔄', text: 'Reschedule' },
  };
  return statusMap[appointment.status] || statusMap[AppointmentStatus.SCHEDULED];
};

// Get badge text (Today, 7d, 3d, etc)
const getBadgeText = (appointment: Appointment): { text: string; color: string } | null => {
  const aptDate = new Date(appointment.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = aptDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { text: 'Today', color: 'bg-[#D4AF37] text-white' };
  } else if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d`, color: 'bg-red-500 text-white' };
  } else if (diffDays <= 7) {
    return { text: `${diffDays}d`, color: 'bg-[#D4AF37] text-white' };
  }
  
  return null;
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

  const actionButton = getActionButton(appointment);
  const badge = getBadgeText(appointment);
  const icon = getEventIcon(appointment);
  
  // Check if overdue for value display
  const aptDate = new Date(appointment.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = aptDate < today && status !== 'completed';
  
  const estimatedValue = lead?.estimatedValue ? `$${Number(lead.estimatedValue).toFixed(2)}` : null;

  return (
    <div
      className={`
        ${getStatusBg(status)}
        border border-[#e0e0e0] rounded-[4px]
        hover:border-[#D4AF37] hover:shadow-sm transition-all
        ${className}
      `}
    >
      {/* Event Item Content */}
      <div className="p-[6px]">
        {/* Header with icon, name, and badge */}
        <div className="flex items-start gap-[6px] mb-[4px]">
          {/* Icon (24x24 emoji) */}
          <div className="text-[20px] leading-none flex-shrink-0">
            {icon}
          </div>
          
          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[11px] text-[#1a1a1a] leading-tight mb-[2px]">
              {lead?.name || 'Unknown Customer'}
            </div>
            <div className="flex items-center gap-[4px] text-[10px] text-[#666] leading-tight">
              {isOverdue && estimatedValue ? (
                <>
                  <strong className="text-[#1a1a1a]">{estimatedValue}</strong>
                  <span>•</span>
                </>
              ) : appointmentTimeSlot ? (
                <>
                  <strong className="text-[#1a1a1a]">{appointmentTimeSlot}</strong>
                  <span>•</span>
                </>
              ) : null}
              {lead?.phone && (
                <span className="flex items-center gap-[2px]">
                  📞 {lead.phone}
                </span>
              )}
            </div>
          </div>
          
          {/* Badge */}
          {badge && (
            <span className={`${badge.color} px-[6px] py-[2px] rounded-full text-[8px] font-bold flex-shrink-0 leading-none`}>
              {badge.text}
            </span>
          )}
        </div>
        
        {/* Vehicle details */}
        {vehicleInfo && (
          <div className="text-[10px] text-[#666] mb-[6px] leading-tight">
            {vehicleInfo} • {lead?.selectedServices && lead.selectedServices.length > 0 
              ? lead.selectedServices.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
              : (lead?.serviceType === 'mechanic' ? 'Mechanic Service' : 'Body Repair')}
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-[4px] px-[6px] pb-[6px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={`flex-1 px-[8px] py-[4px] rounded-[4px] text-[10px] font-semibold ${actionButton.color} transition-all flex items-center justify-center gap-[4px] leading-none`}
        >
          <span>{actionButton.icon}</span>
          <span>{actionButton.text}</span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="px-[8px] py-[4px] rounded-[4px] text-[10px] font-semibold bg-white border border-[#e0e0e0] text-[#666] hover:border-[#D4AF37] hover:bg-[#fffbf0] hover:text-[#D4AF37] transition-all flex items-center gap-[4px] leading-none"
        >
          <span>👁️</span>
          <span>View</span>
        </button>
      </div>
    </div>
  );
}
