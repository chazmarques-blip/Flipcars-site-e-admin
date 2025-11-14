'use client';

import React, { useState } from 'react';
import { Calendar, TrendingUp, CheckCircle, Clock, Ban, AlertCircle } from 'lucide-react';
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar';
import { AppointmentDetailsModal } from '@/components/appointments/AppointmentDetailsModal';
import { Appointment, appointmentsService, AppointmentStats } from '@/lib/api/appointments.service';

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch stats on mount
  React.useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const data = await appointmentsService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch appointment stats:', error);
    }
  };

  const handleEventClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleModalClose = () => {
    setSelectedAppointment(null);
  };

  const handleUpdate = () => {
    // Trigger calendar refresh
    setRefreshKey((prev) => prev + 1);
    fetchStats();
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

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Confirmed
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
              </div>
              <Ban className="w-8 h-8 text-red-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  No Show
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.noShow}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      <AppointmentsCalendar key={refreshKey} onEventClick={handleEventClick} />

      {/* Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={handleModalClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
