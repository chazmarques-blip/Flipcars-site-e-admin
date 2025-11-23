'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppointmentDetailsModal } from '@/components/appointments/AppointmentDetailsModal';
import { Appointment } from '@/lib/api/appointments.service';
import { AppointmentsProvider } from '@/contexts/AppointmentsContext';

// 🆕 Import new mockup components
import { CalendarStats } from '@/components/appointments/CalendarStats';
import { CalendarFilters } from '@/components/appointments/CalendarFilters';
import { CalendarLegend } from '@/components/appointments/CalendarLegend';
import { CalendarGrid } from '@/components/appointments/CalendarGrid';
import { CalendarSidebar } from '@/components/appointments/CalendarSidebar';

function AppointmentsPageContent() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleEventClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleModalClose = () => {
    setSelectedAppointment(null);
  };

  const handleUpdate = () => {
    // Modal updated - context will auto-refresh via polling
    console.log('[AppointmentsPage] Appointment updated, context will auto-sync');
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // TODO: Implement filter logic
  };

  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    // TODO: Implement settings
  };

  return (
    <div className="p-[8px_12px] max-w-[1600px] mx-auto h-screen flex flex-col overflow-hidden bg-[#f8f8f8]">
      {/* Page Header - Compacto */}
      <div className="flex items-center justify-between mb-[5px] flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold text-[#1a1a1a] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            Appointments & Payments Calendar
          </h1>
          <p className="text-[10px] text-[#666]">
            Manage customer appointments, payment schedules, and follow-ups
          </p>
        </div>
      </div>

      {/* 🆕 Dashboard Statistics (6 cards: Total | Today | This Week | Overdue | Revenue | Completion) */}
      <CalendarStats />

      {/* 🆕 Filters Section */}
      <CalendarFilters onFilterChange={handleFilterChange} />

      {/* 🆕 Legend Section */}
      <CalendarLegend onExport={handleExport} onSettings={handleSettings} />

      {/* 🆕 3-Column Layout: Overdue | Calendar | Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px_1fr] gap-2 flex-1 overflow-hidden">
        {/* Left Sidebar: Overdue (hidden on mobile) */}
        <div className="hidden lg:block overflow-y-auto">
          <CalendarSidebar 
            type="overdue"
            onEventClick={handleEventClick}
          />
        </div>

        {/* Center: Calendar Grid */}
        <div className="overflow-y-auto">
          <CalendarGrid 
            onEventClick={handleEventClick}
          />
        </div>

        {/* Right Sidebar: Upcoming (visible on mobile, stacked below calendar) */}
        <div className="overflow-y-auto">
          <CalendarSidebar 
            type="upcoming"
            onEventClick={handleEventClick}
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

export default function AppointmentsPage() {
  return (
    <AppointmentsProvider pollingInterval={30000}>
      <AppointmentsPageContent />
    </AppointmentsProvider>
  );
}
