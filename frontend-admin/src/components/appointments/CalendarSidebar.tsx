'use client';

import React, { useMemo } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Appointment } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';
import { useAppointments } from '@/contexts/AppointmentsContext';

interface CalendarSidebarProps {
  onEventClick: (appointment: Appointment) => void;
  type?: 'overdue' | 'upcoming';
}

export function CalendarSidebar({ onEventClick, type = 'overdue' }: CalendarSidebarProps) {
  const { appointments, loading } = useAppointments();

  // Get real current date in Orlando timezone (America/New_York)
  const getTodayInOrlando = (): string => {
    const orlandoTime = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Format: "MM/DD/YYYY, HH:MM:SS" → extract date part
    const [month, day, year] = orlandoTime.split(',')[0].split('/');
    const today = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    console.log('✅ SIDEBAR REAL ORLANDO DATE - TODAY IS', today);
    return today;
  };

  // Get real current time in Orlando timezone
  const getCurrentTimeInOrlando = (): string => {
    const orlandoTime = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Format: "MM/DD/YYYY, HH:MM:SS" → extract time part
    const timePart = orlandoTime.split(', ')[1]?.substring(0, 5) || '00:00';
    
    console.log('✅ SIDEBAR REAL ORLANDO TIME - NOW IS', timePart);
    return timePart;
  };

  const todayStr = getTodayInOrlando();
  const currentTime = getCurrentTimeInOrlando();

  // Filter overdue (past date OR today but past time) - memoized
  const overdue = useMemo(() => appointments.filter((apt) => {
    // Appointment is overdue if:
    // 1. Date is in the past (before today)
    // 2. OR date is today BUT time has passed
    const isPastDate = apt.appointmentDate < todayStr;
    const isToday = apt.appointmentDate === todayStr;
    const isPastTime = isToday && apt.appointmentStartTime < currentTime;
    
    const isOverdue = (isPastDate || isPastTime) &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled';
    
    return isOverdue;
  }), [appointments, todayStr, currentTime]);

  // Filter upcoming (future date OR today but future time) - memoized
  const upcoming = useMemo(() => appointments.filter((apt) => {
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
  }), [appointments, todayStr, currentTime]);

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
