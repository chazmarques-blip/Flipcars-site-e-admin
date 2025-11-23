'use client';

import React, { useMemo } from 'react';
import { useAppointments } from '@/contexts/AppointmentsContext';

// Get real current date in Orlando timezone
function getTodayInOrlando(): string {
  const orlandoTime = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const [month, day, year] = orlandoTime.split(',')[0].split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Get real current time in Orlando timezone
function getCurrentTimeInOrlando(): string {
  const orlandoTime = new Date().toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const timePart = orlandoTime.split(', ')[1]?.substring(0, 5) || '00:00';
  return timePart;
}

interface EnhancedStats {
  total: number;
  today: number;
  thisWeek: number;
  overdue: number;
  estimatedRevenue: string;
  formattedRevenue: string;
  completionRate: number;
}

export function CalendarStats() {
  const { appointments, loading, error } = useAppointments();

  const stats = useMemo((): EnhancedStats => {
    if (appointments.length === 0) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        overdue: 0,
        estimatedRevenue: '0.00',
        formattedRevenue: '$0',
        completionRate: 100,
      };
    }

    const now = new Date();
    const todayStr = getTodayInOrlando();
    const currentTime = getCurrentTimeInOrlando();
    
    console.log('[CalendarStats] Calculating stats for:', { todayStr, currentTime, appointmentsCount: appointments.length });
    
    // Calculate stats from real appointments
    const total = appointments.length;
    
    // Today's appointments
    const today = appointments.filter(apt => apt.appointmentDate === todayStr).length;
    
    // This week appointments (current week: Sunday to Saturday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startWeekStr = startOfWeek.toISOString().split('T')[0];
    const endWeekStr = endOfWeek.toISOString().split('T')[0];
    
    const thisWeek = appointments.filter(apt => 
      apt.appointmentDate >= startWeekStr && apt.appointmentDate <= endWeekStr
    ).length;
    
    console.log('[CalendarStats] Week range:', { startWeekStr, endWeekStr, thisWeek });
    
    // Overdue appointments (past date OR today but past time)
    const overdue = appointments.filter(apt => {
      const isPastDate = apt.appointmentDate < todayStr;
      const isToday = apt.appointmentDate === todayStr;
      const isPastTime = isToday && apt.appointmentStartTime && apt.appointmentStartTime < currentTime;
      
      return (isPastDate || isPastTime) &&
             apt.status !== 'completed' &&
             apt.status !== 'cancelled';
    }).length;
    
    // Estimated revenue from this week's appointments
    const estimatedRevenue = appointments
      .filter(apt => apt.appointmentDate >= startWeekStr && apt.appointmentDate <= endWeekStr)
      .reduce((sum, apt) => sum + Number(apt.lead?.estimatedValue || 0), 0);

    const formattedRevenue = estimatedRevenue >= 1000
      ? `$${(estimatedRevenue / 1000).toFixed(1)}K`
      : `$${estimatedRevenue.toFixed(0)}`;
    
    // Completion rate: (completed + cancelled) / total * 100
    const completed = appointments.filter(apt => 
      apt.status === 'completed' || apt.status === 'cancelled'
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    const result = {
      total,
      today,
      thisWeek,
      overdue,
      estimatedRevenue: estimatedRevenue.toFixed(2),
      formattedRevenue,
      completionRate,
    };
    
    console.log('[CalendarStats] Calculated:', { total, today, thisWeek, overdue, completionRate });
    
    return result;
  }, [appointments]);

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[5px] mb-[5px]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-[5px] border border-[#e0e0e0] p-[5px_7px] animate-pulse">
            <div className="h-2 bg-gray-200 rounded w-16 mb-0.5"></div>
            <div className="h-3.5 bg-gray-200 rounded w-10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-[5px]">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-[5px] mb-[5px]">
      {/* Total Events */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          Total Events
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.total}
        </div>
        <div className="text-[8px] text-[#666]">
          This month
        </div>
      </div>

      {/* Today */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          Today
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.today}
        </div>
        <div className="text-[8px] text-[#666]">
          {stats.today === 0 ? 'No appointments' : stats.today === 1 ? '1 appointment' : `${stats.today} appointments`}
        </div>
      </div>

      {/* This Week */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          This Week
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.thisWeek}
        </div>
        <div className="text-[8px] text-[#666]">
          Sun - Sat
        </div>
      </div>

      {/* Overdue */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          Overdue
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.overdue}
        </div>
        <div className="text-[8px] text-[#666]">
          {stats.overdue === 0 ? 'None' : 'Need attention'}
        </div>
      </div>

      {/* Revenue */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          Revenue
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.formattedRevenue}
        </div>
        <div className="text-[8px] text-[#666]">
          This week
        </div>
      </div>

      {/* Completion */}
      <div 
        className="bg-white rounded-[5px] p-[5px_7px] border border-[#e0e0e0] hover:border-[#D4AF37] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(212,175,55,0.15)]"
      >
        <div className="text-[8px] font-semibold uppercase tracking-[0.3px] text-[#999] mb-[2px]">
          Completion
        </div>
        <div className="text-[14px] font-bold text-[#1a1a1a] mb-[1px] leading-none">
          {stats.completionRate}%
        </div>
        <div className="text-[8px] text-[#666]">
          {stats.completionRate === 100 ? 'All done' : stats.completionRate >= 75 ? 'On track' : 'Behind'}
        </div>
      </div>
    </div>
  );
}
