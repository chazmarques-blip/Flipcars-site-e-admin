'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Car, Check, Ban, FileText } from 'lucide-react';
import { Appointment, AppointmentStatus, appointmentsService } from '@/lib/api/appointments.service';
import { format } from 'date-fns';
import Link from 'next/link';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh calendar
}

// Status badge colors - FlipCars branding (gold/black)
const getStatusBadge = (status: AppointmentStatus): { bg: string; text: string; border: string; label: string } => {
  const statusMap: Record<AppointmentStatus, { bg: string; text: string; border: string; label: string }> = {
    [AppointmentStatus.SCHEDULED]: {
      bg: 'bg-[#fffbf0]',
      text: 'text-[#1a1a1a]',
      border: 'border-[#D4AF37]',
      label: 'Scheduled',
    },
    [AppointmentStatus.CONFIRMED]: {
      bg: 'bg-[#D4AF37]',
      text: 'text-black',
      border: 'border-[#D4AF37]',
      label: 'Confirmed',
    },
    [AppointmentStatus.COMPLETED]: {
      bg: 'bg-[#1a1a1a]',
      text: 'text-[#D4AF37]',
      border: 'border-[#D4AF37]',
      label: 'Completed',
    },
    [AppointmentStatus.CANCELLED]: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      label: 'Cancelled',
    },
    [AppointmentStatus.NO_SHOW]: {
      bg: 'bg-gray-200',
      text: 'text-gray-700',
      border: 'border-gray-400',
      label: 'No Show',
    },
    [AppointmentStatus.RESCHEDULED]: {
      bg: 'bg-[#fffbf0]',
      text: 'text-[#1a1a1a]',
      border: 'border-[#D4AF37]',
      label: 'Rescheduled',
    },
  };
  return statusMap[status] || statusMap[AppointmentStatus.SCHEDULED];
};

export function AppointmentDetailsModal({ appointment, onClose, onUpdate }: AppointmentDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState(appointment?.adminNotes || '');

  if (!appointment) return null;

  const lead = appointment.lead;
  const vehicle = lead?.vehicle;
  const statusBadge = getStatusBadge(appointment.status);

  // Format date
  const appointmentDate = appointment.appointmentDate
    ? format(new Date(appointment.appointmentDate + 'T00:00:00'), 'MMMM dd, yyyy')
    : 'N/A';

  // Handle status update
  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    if (loading) return;

    try {
      setLoading(true);
      console.log('[AppointmentModal] Updating status to:', newStatus);
      
      await appointmentsService.updateStatus(appointment.id, newStatus, adminNotes);
      
      console.log('[AppointmentModal] ✅ Status updated successfully');
      onUpdate(); // Refresh calendar
      onClose();
    } catch (error: any) {
      console.error('[AppointmentModal] ❌ Failed to update appointment status:', error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle notes save
  const handleSaveNotes = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await appointmentsService.updateAppointment(appointment.id, { adminNotes });
      onUpdate();
    } catch (error: any) {
      console.error('[AppointmentModal] ❌ Failed to save notes:', error);
      alert(`Failed to save notes: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-3">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal - COMPACT SIZE */}
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border-2 border-[#D4AF37]">
          {/* Header - Gold/Black Theme */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] rounded-t-lg border-b border-[#D4AF37]">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wide">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#D4AF37]/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

          {/* Content - COMPACT */}
          <div className="px-4 py-3 space-y-3">
            {/* Status Badge + Lead Link */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                {statusBadge.label}
              </span>
              
              {lead && (
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="text-xs text-[#D4AF37] hover:text-[#b8962d] font-medium"
                >
                  #{lead.referenceNumber}
                </Link>
              )}
            </div>

            {/* Customer Information - COMPACT */}
            <div className="bg-[#fffbf0] border border-[#D4AF37]/30 rounded p-2.5 space-y-2">
              <h3 className="text-[9px] font-bold text-[#1a1a1a] uppercase tracking-wider">
                Customer Information
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <User className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500">Name</p>
                    <p className="font-semibold text-[#1a1a1a] truncate">{lead?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <Phone className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500">Phone</p>
                    <a href={`tel:${lead?.phone}`} className="font-semibold text-[#D4AF37] hover:text-[#b8962d] truncate block">
                      {lead?.phone || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <Mail className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500">Email</p>
                    <a href={`mailto:${lead?.email}`} className="font-semibold text-[#D4AF37] hover:text-[#b8962d] truncate block text-[10px]">
                      {lead?.email || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <FileText className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-500">Service</p>
                    <p className="font-semibold text-[#1a1a1a] capitalize truncate">
                      {lead?.serviceType || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information - COMPACT */}
            {vehicle && (vehicle.year || vehicle.make || vehicle.model || vehicle.vin) && (
              <div className="bg-[#fffbf0] border border-[#D4AF37]/30 rounded p-2.5 space-y-2">
                <h3 className="text-[9px] font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#D4AF37]" />
                  Vehicle
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(vehicle.year || vehicle.make || vehicle.model) && (
                    <div>
                      <p className="text-[9px] text-gray-500">Model</p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  )}
                  
                  {vehicle.vin && (
                    <div>
                      <p className="text-[9px] text-gray-500">VIN</p>
                      <p className="text-[10px] font-mono font-semibold text-[#1a1a1a] truncate">{vehicle.vin}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Details - COMPACT */}
            <div className="bg-[#fffbf0] border border-[#D4AF37]/30 rounded p-2.5 space-y-2">
              <h3 className="text-[9px] font-bold text-[#1a1a1a] uppercase tracking-wider">
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <Calendar className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-500">Date</p>
                    <p className="font-semibold text-[#1a1a1a]">{appointmentDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5">
                  <Clock className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] text-gray-500">Time</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {appointment.appointmentTimeSlot || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              {appointment.contactPreferences && (
                <div>
                  <p className="text-[9px] text-gray-500 mb-1">Contact Preferences</p>
                  <div className="flex flex-wrap gap-1">
                    {appointment.contactPreferences.phoneCall && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1a1a1a] text-[9px] font-semibold">
                        📞 Phone
                      </span>
                    )}
                    {appointment.contactPreferences.whatsapp && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1a1a1a] text-[9px] font-semibold">
                        💬 WhatsApp
                      </span>
                    )}
                    {appointment.contactPreferences.textMessage && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1a1a1a] text-[9px] font-semibold">
                        📱 SMS
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Notes - COMPACT */}
            <div>
              <label className="block text-[9px] font-bold text-[#1a1a1a] uppercase mb-1">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                className="w-full px-2 py-1.5 text-xs border border-[#D4AF37]/30 rounded focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] resize-none"
                placeholder="Add notes..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={loading}
                className="mt-1 px-2 py-1 bg-[#fffbf0] hover:bg-[#D4AF37]/10 border border-[#D4AF37] text-[#1a1a1a] text-[10px] font-semibold rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Action Buttons - COMPACT & Gold/Black Theme */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#D4AF37]/30">
              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.CONFIRMED)}
                disabled={loading || appointment.status === AppointmentStatus.CONFIRMED}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#D4AF37] hover:bg-[#b8962d] text-black text-[10px] font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3" />
                Confirm
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.COMPLETED)}
                disabled={loading || appointment.status === AppointmentStatus.COMPLETED}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#D4AF37] text-[10px] font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3" />
                Complete
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.CANCELLED)}
                disabled={loading || appointment.status === AppointmentStatus.CANCELLED}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-3 h-3" />
                Cancel
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.NO_SHOW)}
                disabled={loading || appointment.status === AppointmentStatus.NO_SHOW}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-[10px] font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-3 h-3" />
                No Show
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
