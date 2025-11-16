'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppointmentDetailsModal } from '@/components/appointments/AppointmentDetailsModal';
import { Appointment } from '@/lib/api/appointments.service';

// 🆕 Import new mockup components
import { CalendarStats } from '@/components/appointments/CalendarStats';
import { CalendarGrid } from '@/components/appointments/CalendarGrid';
import { CalendarSidebar } from '@/components/appointments/CalendarSidebar';

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleModalClose = () => {
    setSelectedAppointment(null);
  };

  const handleUpdate = () => {
    // Trigger calendar refresh
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            Appointments Calendar
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer appointments and schedules
          </p>
        </div>
      </div>

      {/* 🆕 Dashboard Statistics (3 cards: Total | This Week | Revenue) */}
      <CalendarStats refreshKey={refreshKey} />

      {/* 🆕 3-Column Layout: Overdue | Calendar | Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Overdue (hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-3">
          <CalendarSidebar 
            onEventClick={handleEventClick} 
            refreshKey={refreshKey}
          />
        </div>

        {/* Center: Calendar Grid */}
        <div className="lg:col-span-6">
          <CalendarGrid 
            onEventClick={handleEventClick} 
            refreshKey={refreshKey}
          />
        </div>

        {/* Right Sidebar: Upcoming (visible on mobile, stacked below calendar) */}
        <div className="lg:col-span-3">
          <CalendarSidebar 
            onEventClick={handleEventClick} 
            refreshKey={refreshKey}
          />
        </div>
      </div>

      {/* Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={handleModalClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
