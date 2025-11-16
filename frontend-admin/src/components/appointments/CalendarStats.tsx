'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error || 'Unable to load statistics'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Total Appointments
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              This Week
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.thisWeek}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Estimated Revenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Estimated Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.formattedRevenue}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
