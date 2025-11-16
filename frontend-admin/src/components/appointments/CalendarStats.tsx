'use client';

import React, { useEffect, useState } from 'react';
import { appointmentsService, DashboardStats } from '@/lib/api/appointments.service';
import { TEST_APPOINTMENTS, USE_TEST_DATA } from '@/lib/mockData/testAppointments';

interface CalendarStatsProps {
  refreshKey?: number;
}

export function CalendarStats({ refreshKey = 0 }: CalendarStatsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_TEST_DATA) {
        // Calculate stats from test data
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const total = TEST_APPOINTMENTS.length;
        const thisWeek = TEST_APPOINTMENTS.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= startOfWeek && aptDate <= endOfWeek;
        }).length;

        const estimatedRevenue = TEST_APPOINTMENTS
          .filter(apt => {
            const aptDate = new Date(apt.appointmentDate);
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
          })
          .reduce((sum, apt) => sum + Number(apt.lead?.estimatedValue || 0), 0);

        const formattedRevenue = estimatedRevenue >= 1000
          ? `$${(estimatedRevenue / 1000).toFixed(1)}K`
          : `$${estimatedRevenue.toFixed(0)}`;

        setStats({
          total,
          thisWeek,
          estimatedRevenue: estimatedRevenue.toFixed(2),
          formattedRevenue,
        });
      } else {
        const data = await appointmentsService.getDashboardStats();
        setStats(data);
      }
    } catch (err) {
      console.error('[CalendarStats] Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-[5px]">
        {error || 'Unable to load statistics'}
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
          0
        </div>
        <div className="text-[8px] text-[#666]">
          No appointments
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
          Next 7 days
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
          0
        </div>
        <div className="text-[8px] text-[#666]">
          None
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
          Expected
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
          100%
        </div>
        <div className="text-[8px] text-[#666]">
          On schedule
        </div>
      </div>
    </div>
  );
}
