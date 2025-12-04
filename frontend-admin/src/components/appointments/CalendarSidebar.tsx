'use client';

import React, { useMemo } from 'react';
import { AlertCircle, ChevronRight, Calendar, Wrench, Droplet, Disc, Zap, Wind, Settings, Car } from 'lucide-react';
import { Appointment } from '@/lib/api/appointments.service';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { format, isToday, isTomorrow, parseISO, isPast } from 'date-fns';

interface CalendarSidebarProps {
  onEventClick: (appointment: Appointment) => void;
  type?: 'overdue' | 'upcoming';
}

// Map service names to icons
const getServiceIcon = (serviceName: string): React.ReactNode => {
  const name = serviceName.toLowerCase();
  
  // Oil Change
  if (name.includes('oil')) {
    return <Droplet className="w-4 h-4 text-amber-600" />;
  }
  // Brake Repair
  if (name.includes('brake')) {
    return <Disc className="w-4 h-4 text-red-600" />;
  }
  // Battery
  if (name.includes('battery')) {
    return <Zap className="w-4 h-4 text-yellow-600" />;
  }
  // Air Conditioning
  if (name.includes('air') || name.includes('ac') || name.includes('conditioning')) {
    return <Wind className="w-4 h-4 text-blue-600" />;
  }
  // Engine
  if (name.includes('engine') || name.includes('diagnostic')) {
    return <Settings className="w-4 h-4 text-gray-700" />;
  }
  // Default: General Service
  return <Wrench className="w-4 h-4 text-gray-600" />;
};

// Get display name for service
const getServiceDisplayName = (serviceName: string): string => {
  // Capitalize first letter of each word
  return serviceName
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Mini Event Card component
interface MiniEventCardProps {
  appointment: Appointment;
  onClick: () => void;
}

function MiniEventCard({ appointment, onClick }: MiniEventCardProps) {
  const { lead, appointmentDate, appointmentStartTime } = appointment;
  
  // Get first service or default
  const firstService = lead?.selectedServices?.[0] || 'General Service';
  const serviceIcon = getServiceIcon(firstService);
  const serviceName = getServiceDisplayName(firstService);
  
  // Vehicle info
  const vehicle = [
    lead?.vehicleYear,
    lead?.vehicleMake,
    lead?.vehicleModel
  ].filter(Boolean).join(' ');

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header: Icon + Customer */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-shrink-0">
          {serviceIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">
            {lead?.name || 'Unknown'}
          </div>
          <div className="text-xs text-gray-500">
            {appointmentStartTime || 'No time'}
          </div>
        </div>
      </div>

      {/* Service Name */}
      <div className="text-xs font-medium text-gray-700 mb-1">
        {serviceName}
      </div>

      {/* Vehicle */}
      {vehicle && (
        <div className="text-xs text-gray-500 truncate">
          {vehicle}
        </div>
      )}
    </div>
  );
}

export function CalendarSidebar({ onEventClick, type = 'overdue' }: CalendarSidebarProps) {
  const { appointments, loading } = useAppointments();

  // Current date (for comparisons)
  const now = new Date();

  // Filter and group appointments
  const grouped = useMemo(() => {
    // Filter out completed and cancelled
    const active = appointments.filter(
      apt => apt.status !== 'completed' && apt.status !== 'cancelled'
    );

    // Group by day category
    const today: Appointment[] = [];
    const tomorrow: Appointment[] = [];
    const overdue: Appointment[] = [];
    const upcoming: Appointment[] = [];

    active.forEach(apt => {
      try {
        const aptDate = parseISO(apt.appointmentDate);
        
        if (isPast(aptDate) && !isToday(aptDate)) {
          overdue.push(apt);
        } else if (isToday(aptDate)) {
          today.push(apt);
        } else if (isTomorrow(aptDate)) {
          tomorrow.push(apt);
        } else {
          upcoming.push(apt);
        }
      } catch (error) {
        console.error('Error parsing appointment date:', error);
        upcoming.push(apt); // fallback
      }
    });

    // Sort each group by time
    const sortByTime = (a: Appointment, b: Appointment) => {
      const timeA = a.appointmentStartTime || '00:00';
      const timeB = b.appointmentStartTime || '00:00';
      return timeA.localeCompare(timeB);
    };

    return {
      overdue: overdue.sort(sortByTime),
      today: today.sort(sortByTime),
      tomorrow: tomorrow.sort(sortByTime),
      upcoming: upcoming.sort((a, b) => {
        // Sort by date first, then time
        const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
        if (dateCompare !== 0) return dateCompare;
        return sortByTime(a, b);
      }),
    };
  }, [appointments]);

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
      <div className="space-y-3">
        {/* Overdue Section */}
        {grouped.overdue.length > 0 && (
          <div className="bg-white rounded-lg border border-red-200 shadow-sm">
            <div className="p-3 border-b border-red-100 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-sm text-red-900">
                  Overdue
                </h3>
                <span className="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                  {grouped.overdue.length}
                </span>
              </div>
            </div>
            
            <div className="p-3 max-h-[400px] overflow-y-auto space-y-2">
              {grouped.overdue.map((apt) => (
                <MiniEventCard
                  key={apt.id}
                  appointment={apt}
                  onClick={() => onEventClick(apt)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Upcoming section (with Today, Tomorrow, Later)
  return (
    <div className="space-y-3">
      {/* Today Section */}
      {grouped.today.length > 0 && (
        <div className="bg-white rounded-lg border border-[#D4AF37] shadow-sm">
          <div className="p-3 border-b border-[#D4AF37]/20 bg-[#FFFBF0]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-semibold text-sm text-gray-900">
                Today
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-[#D4AF37] text-white text-xs font-bold rounded-full">
                {grouped.today.length}
              </span>
            </div>
          </div>
          
          <div className="p-3 space-y-2">
            {grouped.today.map((apt) => (
              <MiniEventCard
                key={apt.id}
                appointment={apt}
                onClick={() => onEventClick(apt)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tomorrow Section */}
      {grouped.tomorrow.length > 0 && (
        <div className="bg-white rounded-lg border border-blue-200 shadow-sm">
          <div className="p-3 border-b border-blue-100 bg-blue-50">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm text-blue-900">
                Tomorrow
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                {grouped.tomorrow.length}
              </span>
            </div>
          </div>
          
          <div className="p-3 space-y-2">
            {grouped.tomorrow.map((apt) => (
              <MiniEventCard
                key={apt.id}
                appointment={apt}
                onClick={() => onEventClick(apt)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming (Later) Section */}
      {grouped.upcoming.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-sm text-gray-900">
                Later
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-gray-600 text-white text-xs font-bold rounded-full">
                {grouped.upcoming.length}
              </span>
            </div>
          </div>
          
          <div className="p-3 max-h-[400px] overflow-y-auto space-y-2">
            {grouped.upcoming.map((apt) => (
              <MiniEventCard
                key={apt.id}
                appointment={apt}
                onClick={() => onEventClick(apt)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {grouped.today.length === 0 && grouped.tomorrow.length === 0 && grouped.upcoming.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No upcoming appointments</p>
        </div>
      )}
    </div>
  );
}
