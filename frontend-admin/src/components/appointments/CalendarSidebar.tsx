'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Appointment, appointmentsService } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';
import { TEST_APPOINTMENTS, USE_TEST_DATA } from '@/lib/mockData/testAppointments';

interface CalendarSidebarProps {
  onEventClick: (appointment: Appointment) => void;
  refreshKey?: number;
  type?: 'overdue' | 'upcoming'; // 🆕 Define which section to show
}

export function CalendarSidebar({ onEventClick, refreshKey = 0, type = 'overdue' }: CalendarSidebarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Use test data if enabled
      if (USE_TEST_DATA) {
        setAppointments(TEST_APPOINTMENTS);
      } else {
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
      }
    } catch (error) {
      console.error('[CalendarSidebar] Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // TEMPORARY FIX: Hardcode today as 2025-11-22
  const getTodayInOrlando = (): string => {
    console.log('🔵🔵🔵 SIDEBAR HARDCODED - TODAY IS 2025-11-22 🔵🔵🔵');
    return '2025-11-22';
  };

  // HARDCODED: Current time in Orlando (for testing - should be dynamic in production)
  const getCurrentTimeInOrlando = (): string => {
    // For testing: hardcode to 11:00 AM
    // TODO: Replace with real Orlando time: new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false }).split(', ')[1]
    return '11:00';
  };

  const todayStr = getTodayInOrlando();
  const currentTime = getCurrentTimeInOrlando();

  // DEBUG: Log appointments and today's date
  console.log('[CalendarSidebar] All appointments:', appointments.map(a => ({
    name: a.lead?.firstName + ' ' + a.lead?.lastName,
    date: a.appointmentDate,
    time: a.appointmentStartTime,
    isOverdue: a.appointmentDate < todayStr
  })));

  // Filter overdue (past date OR today but past time)
  const overdue = appointments.filter((apt) => {
    // Appointment is overdue if:
    // 1. Date is in the past (before today)
    // 2. OR date is today BUT time has passed
    const isPastDate = apt.appointmentDate < todayStr;
    const isToday = apt.appointmentDate === todayStr;
    const isPastTime = isToday && apt.appointmentStartTime < currentTime;
    
    const isOverdue = (isPastDate || isPastTime) &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled';
    
    console.log(`[CalendarSidebar] ${apt.lead?.firstName}: date="${apt.appointmentDate}" time="${apt.appointmentStartTime}" vs today="${todayStr}" ${currentTime} → overdue=${isOverdue} (pastDate=${isPastDate}, pastTime=${isPastTime})`);
    
    return isOverdue;
  });

  // Filter upcoming (future date OR today but future time)
  const upcoming = appointments.filter((apt) => {
    // Appointment is upcoming if:
    // 1. Date is in the future (after today)
    // 2. OR date is today BUT time hasn't passed yet
    const isFutureDate = apt.appointmentDate > todayStr;
    const isToday = apt.appointmentDate === todayStr;
    const isFutureTime = isToday && apt.appointmentStartTime >= currentTime;
    
    return (
      (isFutureDate || isFutureTime) &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled'
    );
  }).sort((a, b) => {
    // Sort by date, then by time
    const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
    if (dateCompare !== 0) return dateCompare;
    return (a.appointmentStartTime || '').localeCompare(b.appointmentStartTime || '');
  });

  if (loading) {
    return (
      <div className="space-y-2">
        {/* Overdue Loading */}
        <div className="bg-white rounded border border-gray-200 p-2">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
          <div className="space-y-1">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Upcoming Loading */}
        <div className="bg-white rounded border border-gray-200 p-2">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
          <div className="space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render only the requested section
  if (type === 'overdue') {
    return (
      <div className="bg-white rounded border border-gray-200 shadow-sm">
        <div className="p-2 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <h3 className="font-semibold text-xs text-gray-900">
              Overdue
            </h3>
            <span className="ml-auto px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-semibold rounded-full">
              {overdue.length}
            </span>
          </div>
        </div>
        
        <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {overdue.length === 0 ? (
            <p className="text-[10px] text-gray-500 text-center py-4">
              No overdue appointments
            </p>
          ) : (
            <div className="space-y-1.5">
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
    );
  }

  // Upcoming section
  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-green-600" />
          <h3 className="font-semibold text-xs text-gray-900">
            Upcoming
        </h3>
        <span className="ml-auto px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded-full">
          {upcoming.length}
        </span>
      </div>
    </div>
    
    <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {upcoming.length === 0 ? (
        <p className="text-[10px] text-gray-500 text-center py-4">
          No upcoming appointments
        </p>
      ) : (
        <div className="space-y-1.5">
          {upcoming.slice(0, 10).map((apt) => (
            <EventBadge
              key={apt.id}
              appointment={apt}
              onClick={() => onEventClick(apt)}
            />
          ))}
          
          {upcoming.length > 10 && (
            <div className="text-[10px] text-gray-500 text-center pt-1 border-t">
              +{upcoming.length - 10} more upcoming
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
}
