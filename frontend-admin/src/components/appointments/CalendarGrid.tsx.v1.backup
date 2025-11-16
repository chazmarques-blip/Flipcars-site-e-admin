'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment, appointmentsService } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';

interface CalendarGridProps {
  onEventClick: (appointment: Appointment) => void;
  refreshKey?: number;
}

// Get days in month
function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add padding days from previous month
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }

  // Add current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Add padding days from next month
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
  }

  return days;
}

// Format date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check if date is today
function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function CalendarGrid({ onEventClick, refreshKey = 0 }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetchAppointments();
  }, [year, month, refreshKey]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getAppointmentsByMonth(year, month + 1);
      setAppointments(data);
    } catch (error) {
      console.error('[CalendarGrid] Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  appointments.forEach((apt) => {
    const dateKey = apt.appointmentDate;
    if (!appointmentsByDate[dateKey]) {
      appointmentsByDate[dateKey] = [];
    }
    appointmentsByDate[dateKey].push(apt);
  });

  // Get days to display
  const days = getDaysInMonth(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month name
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              const dateKey = formatDate(date);
              const isCurrentMonth = date.getMonth() === month;
              const today = isToday(date);
              const dayAppointments = appointmentsByDate[dateKey] || [];

              return (
                <div
                  key={index}
                  className={`
                    min-h-[100px] p-2 border rounded-lg
                    ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}
                    ${today ? 'border-blue-500 border-2 bg-blue-50/30' : ''}
                  `}
                >
                  {/* Day number */}
                  <div className={`text-sm font-semibold mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${today ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </div>

                  {/* Appointments for this day */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => onEventClick(apt)}
                        className="text-xs p-1.5 rounded bg-blue-100 border border-blue-200 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors truncate"
                      >
                        <div className="font-semibold truncate">
                          {apt.appointmentTimeSlot}
                        </div>
                        <div className="truncate">
                          {apt.lead?.name || 'Unknown'}
                        </div>
                      </div>
                    ))}
                    
                    {/* Show "+X more" if there are more appointments */}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium px-1">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
