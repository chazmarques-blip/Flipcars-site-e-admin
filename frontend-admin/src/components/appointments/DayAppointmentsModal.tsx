'use client';

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { Appointment } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';

interface DayAppointmentsModalProps {
  date: string | null; // YYYY-MM-DD
  appointments: Appointment[];
  onClose: () => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onStatusChange?: (appointmentId: string, newStatus: any) => Promise<void>;
}

export function DayAppointmentsModal({ 
  date, 
  appointments, 
  onClose, 
  onAppointmentClick,
  onStatusChange 
}: DayAppointmentsModalProps) {
  if (!date || appointments.length === 0) return null;

  // Format date for display
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => {
    return (a.appointmentStartTime || '').localeCompare(b.appointmentStartTime || '');
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Appointments for {formattedDate}
              </h2>
              <p className="text-sm text-gray-600">
                {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Appointments List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sortedAppointments.map((apt) => (
              <EventBadge
                key={apt.id}
                appointment={apt}
                onClick={() => onAppointmentClick(apt)}
                onStatusChange={onStatusChange}
                className="shadow-sm hover:shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
