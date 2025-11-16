'use client';

import React, { useEffect, useState } from 'react';
import { appointmentsService, DashboardStats } from '@/lib/api/appointments.service';

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
      const data = await appointmentsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('[CalendarStats] Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-1.5 mb-1.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded border border-gray-200 p-1.5 animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-5 bg-gray-200 rounded w-10"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-1.5">
        {error || 'Unable to load statistics'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-1.5 mb-1.5">
      {/* Total Appointments */}
      <div className="bg-white rounded border border-gray-200 p-1.5 hover:border-[#D4AF37] transition-all hover:shadow-sm">
        <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
          Total
        </p>
        <p className="text-xl font-bold text-gray-900">
          {stats.total}
        </p>
      </div>

      {/* This Week */}
      <div className="bg-white rounded border border-gray-200 p-1.5 hover:border-[#D4AF37] transition-all hover:shadow-sm">
        <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
          This Week
        </p>
        <p className="text-xl font-bold text-gray-900">
          {stats.thisWeek}
        </p>
      </div>

      {/* Estimated Revenue */}
      <div className="bg-white rounded border border-gray-200 p-1.5 hover:border-[#D4AF37] transition-all hover:shadow-sm">
        <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">
          Revenue
        </p>
        <p className="text-xl font-bold text-[#D4AF37]">
          {stats.formattedRevenue}
        </p>
      </div>
    </div>
  );
}
