'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Appointment, appointmentsService } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';

interface CalendarSidebarProps {
  onEventClick: (appointment: Appointment) => void;
  refreshKey?: number;
}

export function CalendarSidebar({ onEventClick, refreshKey = 0 }: CalendarSidebarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch current month and next month appointments
      const now = new Date();
      const currentMonth = await appointmentsService.getAppointmentsByMonth(
        now.getFullYear(),
        now.getMonth() + 1
      );
      
      const nextMonth = await appointmentsService.getAppointmentsByMonth(
        now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(),
        now.getMonth() === 11 ? 1 : now.getMonth() + 2
      );
      
      setAppointments([...currentMonth, ...nextMonth]);
    } catch (error) {
      console.error('[CalendarSidebar] Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date (YYYY-MM-DD)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  // Filter overdue (past dates, not completed/cancelled)
  const overdue = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0);
    return (
      aptDate < today &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled'
    );
  });

  // Filter upcoming (today or future dates, not completed/cancelled)
  const upcoming = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    aptDate.setHours(0, 0, 0, 0);
    return (
      aptDate >= today &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled'
    );
  }).sort((a, b) => {
    // Sort by date, then by time
    const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
    if (dateCompare !== 0) return dateCompare;
    return (a.appointmentTimeSlot || '').localeCompare(b.appointmentTimeSlot || '');
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Overdue Loading */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Upcoming Loading */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">
              Overdue
            </h3>
            <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              {overdue.length}
            </span>
          </div>
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {overdue.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No overdue appointments
            </p>
          ) : (
            <div className="space-y-3">
              {overdue.map((apt) => (
                <EventBadge
                  key={apt.id}
                  appointment={apt}
                  onClick={() => onEventClick(apt)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">
              Upcoming
            </h3>
            <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {upcoming.length}
            </span>
          </div>
        </div>
        
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No upcoming appointments
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 10).map((apt) => (
                <EventBadge
                  key={apt.id}
                  appointment={apt}
                  onClick={() => onEventClick(apt)}
                />
              ))}
              
              {upcoming.length > 10 && (
                <div className="text-sm text-gray-500 text-center pt-2 border-t">
                  +{upcoming.length - 10} more upcoming
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
