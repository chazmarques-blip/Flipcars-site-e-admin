'use client';

// IMMEDIATE EXECUTION - This will run as soon as file is loaded
console.log('%c✅ CALENDAR FILE LOADED - VERSION: 2025-11-23-REAL-TIME ✅', 'background: green; color: white; font-size: 20px; padding: 10px;');

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '@/lib/api/appointments.service';
import { useAppointments } from '@/contexts/AppointmentsContext';

interface CalendarGridProps {
  onEventClick: (appointment: Appointment) => void;
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

// Get real current date in Orlando timezone (America/New_York)
function getTodayInOrlando(): string {
  const orlandoTime = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Format: "MM/DD/YYYY, HH:MM:SS" → extract date part
  const [month, day, year] = orlandoTime.split(',')[0].split('/');
  const today = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  console.log(`✅ REAL ORLANDO DATE - TODAY IS ${today}`);
  return today;
}

// Check if date is today - compares YYYY-MM-DD strings to avoid timezone issues
function isToday(date: Date): boolean {
  // Get today in Orlando timezone
  const todayStr = getTodayInOrlando();
  
  // Get date in YYYY-MM-DD format
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  // Compare strings directly
  const result = dateStr === todayStr;
  
  // ALWAYS log for debugging
  console.log(`[CalendarGrid] isToday check: date="${dateStr}" vs today="${todayStr}" → result=${result}`);
  
  if (result) {
    console.log(`✅✅✅ TODAY DETECTED! Day ${dateStr} should have golden border! ✅✅✅`);
  }
  
  return result;
}

export function CalendarGrid({ onEventClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { appointments, loading } = useAppointments();

  // VERSION MARKER - updated 2025-11-23 with REAL timezone
  console.log('[CalendarGrid] VERSION: 2025-11-23-REAL-ORLANDO-TIME');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Group appointments by date (NO FILTER - show all visible days including padding days)
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    
    // DON'T filter by month - calendar shows padding days from prev/next month
    // Calendar will show appointments for ANY visible day, not just current month
    appointments.forEach((apt) => {
      const dateKey = apt.appointmentDate; // YYYY-MM-DD
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(apt);
    });
    
    return grouped;
  }, [appointments]);

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
              
              // DEBUG: Log when rendering today
              if (today) {
                console.log(`[CalendarGrid] 🟡 Rendering TODAY (Day ${date.getDate()}): dateKey="${dateKey}", isToday=${today}, isCurrentMonth=${isCurrentMonth}`);
                console.log(`[CalendarGrid] 🟡 TODAY CSS will have: ✅ GOLDEN BORDER (border-[#D4AF37] border-3)`);
              }

              return (
                <div
                  key={index}
                  className={`
                    relative min-h-[60px] p-1 border rounded cursor-pointer
                    ${isCurrentMonth ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                    ${today ? 'border-[#D4AF37] border-[3px] bg-amber-50 shadow-lg hover:bg-amber-100' : ''}
                    transition-colors
                  `}
                  style={today ? { borderColor: '#D4AF37', borderWidth: '3px', boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' } : {}}
                  onClick={() => {
                    // If there are appointments on this day, show the first one
                    if (dayAppointments.length > 0) {
                      onEventClick(dayAppointments[0]);
                    }
                  }}
                >
                  {/* Day number */}
                  <div className={`text-[10px] font-semibold mb-0.5 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${today ? 'text-[#D4AF37]' : ''}`}>
                    {date.getDate()}
                    {/* DEBUG: Visual indicator when today=true */}
                    {today && <span className="ml-1 text-[#D4AF37]">⭐</span>}
                  </div>

                  {/* Appointments indicators - EXACT MOCKUP FORMAT */}
                  {dayAppointments.length > 0 && (
                    <>
                      <div className="space-y-[2px] mt-1">
                        {dayAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent div onClick
                              onEventClick(apt);
                            }}
                            className="h-[2px] w-full rounded-[1px] bg-[#D4AF37] cursor-pointer hover:opacity-80 transition-opacity"
                            title={`${apt.lead?.name} - ${apt.appointmentStartTime}`}
                          />
                        ))}
                      </div>
                      
                      {/* Event count badge (MOCKUP: absolute positioned) */}
                      <div 
                        className="absolute bottom-1 right-1 bg-[#D4AF37] text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none cursor-pointer hover:bg-[#b8962d]"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent div onClick
                          // Show first appointment when clicking badge
                          onEventClick(dayAppointments[0]);
                        }}
                        title={`${dayAppointments.length} appointment${dayAppointments.length > 1 ? 's' : ''}`}
                      >
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
