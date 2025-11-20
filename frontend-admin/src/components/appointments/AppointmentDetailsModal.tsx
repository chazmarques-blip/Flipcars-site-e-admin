'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Car, Check, Ban, RotateCcw, FileText } from 'lucide-react';
import { Appointment, AppointmentStatus, appointmentsService } from '@/lib/api/appointments.service';
import { format } from 'date-fns';
import Link from 'next/link';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh calendar
}

// Status badge colors
const getStatusBadge = (status: AppointmentStatus): { bg: string; text: string; label: string } => {
  const statusMap: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
    [AppointmentStatus.SCHEDULED]: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Scheduled',
    },
    [AppointmentStatus.CONFIRMED]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Confirmed',
    },
    [AppointmentStatus.COMPLETED]: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Completed',
    },
    [AppointmentStatus.CANCELLED]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
    [AppointmentStatus.NO_SHOW]: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'No Show',
    },
    [AppointmentStatus.RESCHEDULED]: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
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
      console.log('[AppointmentModal] Appointment ID:', appointment.id);
      console.log('[AppointmentModal] Admin notes:', adminNotes);
      
      await appointmentsService.updateStatus(appointment.id, newStatus, adminNotes);
      
      console.log('[AppointmentModal] ✅ Status updated successfully');
      onUpdate(); // Refresh calendar
      alert(`✅ Status updated to ${newStatus.toUpperCase()} successfully!`);
      onClose();
    } catch (error: any) {
      console.error('[AppointmentModal] ❌ Failed to update appointment status:', error);
      console.error('[AppointmentModal] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`❌ Failed to update status: ${errorMsg}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle notes save
  const handleSaveNotes = async () => {
    if (loading) return;

    try {
      setLoading(true);
      console.log('[AppointmentModal] Saving notes...');
      console.log('[AppointmentModal] Appointment ID:', appointment.id);
      console.log('[AppointmentModal] Notes:', adminNotes);
      
      await appointmentsService.updateAppointment(appointment.id, { adminNotes });
      
      console.log('[AppointmentModal] ✅ Notes saved successfully');
      onUpdate();
      alert('✅ Notes saved successfully!');
    } catch (error: any) {
      console.error('[AppointmentModal] ❌ Failed to save notes:', error);
      console.error('[AppointmentModal] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`❌ Failed to save notes: ${errorMsg}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
              
              {lead && (
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Lead #{lead.referenceNumber}
                </Link>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{lead?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${lead?.phone}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {lead?.phone || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${lead?.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {lead?.email || 'N/A'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Service Type</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {lead?.serviceType || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            {vehicle && (vehicle.year || vehicle.make || vehicle.model || vehicle.vin) && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Vehicle Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(vehicle.year || vehicle.make || vehicle.model) && (
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="text-sm font-medium text-gray-900">
                        {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}
                      </p>
                    </div>
                  )}
                  
                  {vehicle.vin && (
                    <div>
                      <p className="text-xs text-gray-500">VIN</p>
                      <p className="text-sm font-mono font-medium text-gray-900">{vehicle.vin}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Appointment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">{appointmentDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Time Slot</p>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.appointmentTimeSlot || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              {appointment.contactPreferences && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Contact Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {appointment.contactPreferences.phoneCall && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                        📞 Phone Call
                      </span>
                    )}
                    {appointment.contactPreferences.whatsapp && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                        💬 WhatsApp
                      </span>
                    )}
                    {appointment.contactPreferences.textMessage && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                        📱 SMS
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add notes about this appointment..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.CONFIRMED)}
                disabled={loading || appointment.status === AppointmentStatus.CONFIRMED}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.COMPLETED)}
                disabled={loading || appointment.status === AppointmentStatus.COMPLETED}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Complete
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.CANCELLED)}
                disabled={loading || appointment.status === AppointmentStatus.CANCELLED}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-4 h-4" />
                Cancel
              </button>

              <button
                onClick={() => handleStatusUpdate(AppointmentStatus.NO_SHOW)}
                disabled={loading || appointment.status === AppointmentStatus.NO_SHOW}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-4 h-4" />
                No Show
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
