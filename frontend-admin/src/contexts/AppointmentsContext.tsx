'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { appointmentsService, Appointment } from '@/lib/api/appointments.service';

interface AppointmentsContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  refreshAppointments: () => Promise<void>;
  lastUpdated: Date | null;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

interface AppointmentsProviderProps {
  children: ReactNode;
  pollingInterval?: number; // milliseconds (default: 30000 = 30 seconds)
}

export function AppointmentsProvider({ 
  children, 
  pollingInterval = 30000 
}: AppointmentsProviderProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      console.log('[AppointmentsContext] Fetching appointments...');
      setError(null);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
      
      // Fetch current month
      const currentMonthData = await appointmentsService.getAppointmentsByMonth(
        currentYear, 
        currentMonth
      );
      
      // Fetch next month
      const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextMonthData = await appointmentsService.getAppointmentsByMonth(
        nextMonthYear,
        nextMonth
      );
      
      // Combine and sort appointments
      const allAppointments = [...currentMonthData, ...nextMonthData];
      allAppointments.sort((a, b) => {
        const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
        if (dateCompare !== 0) return dateCompare;
        return (a.appointmentStartTime || '').localeCompare(b.appointmentStartTime || '');
      });
      
      setAppointments(allAppointments);
      setLastUpdated(new Date());
      
      console.log(`[AppointmentsContext] ✅ Loaded ${allAppointments.length} appointments`);
    } catch (err) {
      console.error('[AppointmentsContext] Failed to fetch appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Polling - Auto refresh every X seconds
  useEffect(() => {
    if (pollingInterval <= 0) return; // Disable polling if interval is 0 or negative

    console.log(`[AppointmentsContext] Starting polling every ${pollingInterval}ms`);
    
    const intervalId = setInterval(() => {
      console.log('[AppointmentsContext] 🔄 Auto-refreshing appointments...');
      fetchAppointments();
    }, pollingInterval);

    // Cleanup interval on unmount
    return () => {
      console.log('[AppointmentsContext] Stopping polling');
      clearInterval(intervalId);
    };
  }, [pollingInterval, fetchAppointments]);

  const refreshAppointments = useCallback(async () => {
    console.log('[AppointmentsContext] Manual refresh requested');
    setLoading(true);
    await fetchAppointments();
  }, [fetchAppointments]);

  const value: AppointmentsContextType = {
    appointments,
    loading,
    error,
    refreshAppointments,
    lastUpdated,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments(): AppointmentsContextType {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}
