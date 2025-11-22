'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment, appointmentsService } from '@/lib/api/appointments.service';
import { EventBadge } from './EventBadge';
import { TEST_APPOINTMENTS, USE_TEST_DATA } from '@/lib/mockData/testAppointments';

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

// Check if date is today (uses local timezone)
function isToday(date: Date): boolean {
  const now = new Date();
  // Create date objects in local timezone for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return today.getTime() === compareDate.getTime();
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
      
      // Use test data if enabled
      if (USE_TEST_DATA) {
        // Filter test appointments for current month
        const filteredData = TEST_APPOINTMENTS.filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.getFullYear() === year && aptDate.getMonth() === month;
        });
        setAppointments(filteredData);
      } else {
        const data = await appointmentsService.getAppointmentsByMonth(year, month + 1);
        setAppointments(data);
      }
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
    <div className="bg-white rounded border border-gray-200 shadow-sm">
      {/* Calendar Header */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{monthName}</h2>
          
          <div className="flex items-center gap-1">
            <button
              onClick={goToToday}
              className="px-2 py-1 text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToPreviousMonth}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[9px] font-semibold text-gray-600 py-1"
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
                    relative min-h-[60px] p-1 border rounded
                    ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}
                    ${today ? 'border-[#D4AF37] border-2 bg-amber-50/30' : ''}
                  `}
                >
                  {/* Day number */}
                  <div className={`text-[10px] font-semibold mb-0.5 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${today ? 'text-[#D4AF37]' : ''}`}>
                    {date.getDate()}
                  </div>

                  {/* Appointments indicators - EXACT MOCKUP FORMAT */}
                  {dayAppointments.length > 0 && (
                    <>
                      <div className="space-y-[2px] mt-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => onEventClick(apt)}
                            className="h-[2px] w-full rounded-[1px] bg-[#D4AF37] cursor-pointer hover:opacity-80 transition-opacity"
                            title={`${apt.lead?.name} - ${apt.appointmentTimeSlot}`}
                          />
                        ))}
                      </div>
                      
                      {/* Event count badge (MOCKUP: absolute positioned) */}
                      <div className="absolute bottom-1 right-1 bg-[#D4AF37] text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                        {dayAppointments.length}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
