'use client';

import React from 'react';
import { Appointment, AppointmentStatus } from '@/lib/api/appointments.service';

interface EventBadgeProps {
  appointment: Appointment;
  onClick?: () => void;
  onStatusChange?: (appointmentId: string, newStatus: AppointmentStatus) => Promise<void>;
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

// Service mapping (EXACTLY matching public site)
// From: frontend-public/src/components/estimate/Step2bWarrantyDocs.tsx (lines 13-25)
// These are the EXACT WARRANTY_CATEGORIES from the public site
const SERVICE_MAP = {
  oil: { icon: '🛢️', label: 'Oil Change & FREE Checkup*' },
  engine: { icon: '🔧', label: 'Engine' },
  transmission: { icon: '⚙️', label: 'Transmission' },
  electrical: { icon: '⚡', label: 'Electrical System' },
  cooling: { icon: '❄️', label: 'Cooling System' },
  fuel: { icon: '⛽', label: 'Fuel System' },
  steering: { icon: '🎯', label: 'Steering' },
  suspension: { icon: '🛞', label: 'Suspension' },
  brakes: { icon: '🛑', label: 'Brakes' },
  ac: { icon: '🌬️', label: 'A/C System' },
  other: { icon: '📝', label: 'Other (describe below)' },
} as const;

// Get service icon based on selected services (matching public site)
const getServiceIcon = (appointment: Appointment): React.ReactNode => {
  const services = appointment.lead?.selectedServices || [];
  const firstService = services[0] as keyof typeof SERVICE_MAP;
  
  // ALWAYS return service icon from SERVICE_MAP
  if (firstService && SERVICE_MAP[firstService]) {
    return SERVICE_MAP[firstService].icon;
  }
  
  // Default: General service wrench
  return '🔧';
};

// Get payment method for display
const getPaymentMethod = (appointment: Appointment): string => {
  const lead = appointment.lead;
  
  // Check warranty company
  if (lead?.warrantyCompany && lead.warrantyCompany.trim() !== '') {
    return `Warranty - ${lead.warrantyCompany}`;
  }
  
  // Check insurance (if you have this field)
  if (lead?.insuranceCompany && lead.insuranceCompany.trim() !== '') {
    return `Insurance - ${lead.insuranceCompany}`;
  }
  
  // Default: Private Self Pay
  return 'Private Self Pay';
};

// Get service display name (matching public site)
const getServiceDisplayName = (serviceId: string): string => {
  const service = SERVICE_MAP[serviceId as keyof typeof SERVICE_MAP];
  return service?.label || serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
};

// Get status button
const getActionButton = (appointment: Appointment): { color: string; icon: string; text: string } => {
  // Parse date as LOCAL timezone (Orlando), NOT UTC
  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const aptDate = new Date(year, month - 1, day);
  
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
  // Parse date as LOCAL timezone (Orlando), NOT UTC
  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const aptDate = new Date(year, month - 1, day);
  
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

export function EventBadge({ appointment, onClick, onStatusChange, className = '' }: EventBadgeProps) {
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
  const icon = getServiceIcon(appointment);
  
  // Check if overdue for value display
  // Parse date as LOCAL timezone (Orlando), NOT UTC
  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const aptDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = aptDate < today && status !== 'completed';
  
  const estimatedValue = lead?.estimatedValue ? `$${Number(lead.estimatedValue).toFixed(2)}` : null;
  
  // Format date (e.g., "Dec 4", "Jan 15")
  // CRITICAL: appointmentDate comes as "YYYY-MM-DD" string from backend
  // We must parse it as LOCAL timezone (Orlando), NOT UTC
  const [year, month, day] = appointment.appointmentDate.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // month is 0-indexed
  
  const formattedDate = localDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div
      className={`
        ${getStatusBg(status)}
        border border-[#e0e0e0] rounded-[4px]
        hover:border-[#D4AF37] hover:shadow-sm transition-all cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      {/* Event Item Content */}
      <div className="p-[6px]">
        {/* Header with icon, name, payment method, and badge */}
        <div className="flex items-start gap-[6px] mb-[4px]">
          {/* Icon (service type) - Emoji */}
          <div className="text-[20px] leading-none flex-shrink-0">
            {icon}
          </div>
          
          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[4px] flex-wrap">
              <span className="font-semibold text-[11px] text-[#1a1a1a] leading-tight">
                {lead?.name || 'Unknown Customer'}
              </span>
              <span className="text-[10px] text-[#666]">•</span>
              <span className="text-[9px] font-medium text-[#666] bg-gray-100 px-[6px] py-[1px] rounded">
                {getPaymentMethod(appointment)}
              </span>
            </div>
            <div className="flex items-center gap-[4px] text-[10px] text-[#666] leading-tight">
              {isOverdue && estimatedValue ? (
                <>
                  <strong className="text-[#1a1a1a]">{estimatedValue}</strong>
                  <span>•</span>
                  <span className="text-[11px] font-semibold text-[#333]">{formattedDate}</span>
                  <span>•</span>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-semibold text-[#333]">{formattedDate}</span>
                  {appointmentTimeSlot && (
                    <>
                      <span>•</span>
                      <strong className="text-[#1a1a1a]">{appointmentTimeSlot}</strong>
                    </>
                  )}
                  <span>•</span>
                </>
              )}
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
        
        {/* Vehicle details + Service Name */}
        {vehicleInfo && (
          <div className="text-[10px] text-[#666] mb-[6px] leading-tight">
            {vehicleInfo} • <span className="font-semibold text-[#1a1a1a]">
              {lead?.selectedServices && lead.selectedServices.length > 0 
                ? lead.selectedServices.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')).join(', ')
                : (lead?.serviceType === 'mechanic' ? 'Mechanic Service' : 'Body Repair')}
            </span>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-[4px] px-[6px] pb-[6px]">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            
            // If onStatusChange is provided and status can be changed, update status
            if (onStatusChange && status === 'scheduled') {
              // Confirm action: SCHEDULED → CONFIRMED
              await onStatusChange(appointment.id, AppointmentStatus.CONFIRMED);
            } else if (onStatusChange && status === 'confirmed') {
              // Check-in action: could open modal or mark as in_progress
              onClick?.();
            } else {
              // For other statuses, just open the modal
              onClick?.();
            }
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
