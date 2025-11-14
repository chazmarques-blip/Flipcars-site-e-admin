'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { appointmentsService, Appointment, AppointmentStatus } from '@/lib/api/appointments.service';

interface AppointmentsCalendarProps {
  onEventClick: (appointment: Appointment) => void;
}

// Map appointment status to color
const getEventColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: '#3b82f6', // Blue
    [AppointmentStatus.CONFIRMED]: '#10b981', // Green
    [AppointmentStatus.COMPLETED]: '#6b7280', // Gray
    [AppointmentStatus.CANCELLED]: '#ef4444', // Red
    [AppointmentStatus.NO_SHOW]: '#f59e0b', // Amber
    [AppointmentStatus.RESCHEDULED]: '#8b5cf6', // Purple
  };
  return colorMap[status] || '#3b82f6';
};

// Format status for display
const formatStatus = (status: AppointmentStatus): string => {
  const statusMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: 'Scheduled',
    [AppointmentStatus.CONFIRMED]: 'Confirmed',
    [AppointmentStatus.COMPLETED]: 'Completed',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
    [AppointmentStatus.NO_SHOW]: 'No Show',
    [AppointmentStatus.RESCHEDULED]: 'Rescheduled',
  };
  return statusMap[status] || status;
};

export function AppointmentsCalendar({ onEventClick }: AppointmentsCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // 1-12
  });

  // Fetch appointments for current month
  const fetchAppointments = async (year: number, month: number) => {
    try {
      setLoading(true);
      console.log('[AppointmentsCalendar] Fetching appointments for:', year, month);
      
      const data = await appointmentsService.getAppointmentsByMonth(year, month);
      console.log('[AppointmentsCalendar] Fetched appointments:', data.length);
      
      setAppointments(data);
    } catch (error) {
      console.error('[AppointmentsCalendar] Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAppointments(currentMonth.year, currentMonth.month);
  }, [currentMonth]);

  // Handle month change
  const handleDatesSet = (arg: any) => {
    const date = arg.view.currentStart;
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-11 to 1-12
    
    if (year !== currentMonth.year || month !== currentMonth.month) {
      setCurrentMonth({ year, month });
    }
  };

  // Convert appointments to FullCalendar events
  const events = appointments.map((appointment) => {
    const lead = appointment.lead;
    const vehicle = lead?.vehicle;
    
    // Format title with customer name and vehicle info
    let title = `${lead?.name || 'Unknown'}`;
    if (vehicle?.year || vehicle?.make || vehicle?.model) {
      const vehicleInfo = [vehicle.year, vehicle.make, vehicle.model]
        .filter(Boolean)
        .join(' ');
      title += ` - ${vehicleInfo}`;
    }
    
    // Add service type
    if (lead?.serviceType) {
      title += ` (${lead.serviceType})`;
    }

    // Parse time slot for display
    const timeDisplay = appointment.appointmentTimeSlot || '';

    return {
      id: appointment.id,
      title: `${timeDisplay} ${title}`,
      start: appointment.appointmentDate,
      allDay: true, // Show as all-day event (date-only)
      backgroundColor: getEventColor(appointment.status),
      borderColor: getEventColor(appointment.status),
      extendedProps: {
        appointment,
        status: formatStatus(appointment.status),
        phone: lead?.phone,
        serviceType: lead?.serviceType,
      },
    };
  });

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps.appointment as Appointment;
    onEventClick(appointment);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Appointments Calendar
          </h2>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-gray-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-gray-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-500"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-gray-600">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listWeek',
            }}
            events={events}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            height="auto"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
            }}
            // Custom styling
            eventDisplay="block"
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          />
        )}
      </div>

      {/* Calendar Styles */}
      <style jsx global>{`
        .fc {
          font-family: inherit;
        }
        
        .fc .fc-button-primary {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        
        .fc .fc-button-primary:hover {
          background-color: #1d4ed8;
          border-color: #1d4ed8;
        }
        
        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #1e40af;
          border-color: #1e40af;
        }
        
        .fc-event {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .fc-event:hover {
          opacity: 0.8;
        }
        
        .fc-daygrid-event {
          padding: 2px 4px;
          margin: 1px 0;
        }
        
        .fc-event-title {
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
