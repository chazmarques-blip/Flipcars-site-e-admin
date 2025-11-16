'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppointmentDetailsModal } from '@/components/appointments/AppointmentDetailsModal';
import { Appointment } from '@/lib/api/appointments.service';

// 🆕 Import new mockup components
import { CalendarStats } from '@/components/appointments/CalendarStats';
import { CalendarFilters } from '@/components/appointments/CalendarFilters';
import { CalendarLegend } from '@/components/appointments/CalendarLegend';
import { CalendarGrid } from '@/components/appointments/CalendarGrid';
import { CalendarSidebar } from '@/components/appointments/CalendarSidebar';

/**
 * DEMO PAGE - Appointments Calendar Mockup Replication
 * This page demonstrates the exact mockup implementation WITHOUT authentication
 * Uses TEST_APPOINTMENTS data for visualization
 */
export default function DemoAppointmentsPage() {
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
            Appointments & Payments Calendar (DEMO)
          </h1>
          <p className="text-[10px] text-[#666]">
            Mockup replication with test data - No authentication required
          </p>
        </div>
      </div>

      {/* 🆕 Dashboard Statistics (6 cards: Total | Today | This Week | Overdue | Revenue | Completion) */}
      <CalendarStats refreshKey={refreshKey} />

      {/* 🆕 Filters Section */}
      <CalendarFilters onFilterChange={handleFilterChange} />

      {/* 🆕 Legend Section */}
      <CalendarLegend onExport={handleExport} onSettings={handleSettings} />

      {/* 🆕 3-Column Layout: Overdue | Calendar | Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px_1fr] gap-2 flex-1 overflow-hidden">
        {/* Left Sidebar: Overdue ONLY (hidden on mobile) */}
        <div className="hidden lg:block overflow-y-auto">
          <CalendarSidebar 
            type="overdue"
            onEventClick={handleEventClick} 
            refreshKey={refreshKey}
          />
        </div>

        {/* Center: Calendar Grid */}
        <div className="overflow-y-auto">
          <CalendarGrid 
            onEventClick={handleEventClick} 
            refreshKey={refreshKey}
          />
        </div>

        {/* Right Sidebar: Upcoming ONLY (visible on mobile, stacked below calendar) */}
        <div className="overflow-y-auto">
          <CalendarSidebar 
            type="upcoming"
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
