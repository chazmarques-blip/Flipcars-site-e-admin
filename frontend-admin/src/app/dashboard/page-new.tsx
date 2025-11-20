'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leadService } from '@/lib/api/lead.service';
import { Lead, LeadStatus } from '@/types/lead';
import toast from 'react-hot-toast';

// Import new dashboard components
import ActiveLeadsCard from '@/components/dashboard/kpi-cards/ActiveLeadsCard';
import AppointmentsCard from '@/components/dashboard/kpi-cards/AppointmentsCard';
import OverdueCard from '@/components/dashboard/kpi-cards/OverdueCard';
import ApprovedCard from '@/components/dashboard/kpi-cards/ApprovedCard';
import PendingCard from '@/components/dashboard/kpi-cards/PendingCard';
import JobsCard from '@/components/dashboard/kpi-cards/JobsCard';
import WeeksLeadsTable from '@/components/dashboard/tables/WeeksLeadsTable';
import EstimatesTable from '@/components/dashboard/tables/EstimatesTable';
import BusinessActionsCard from '@/components/dashboard/actions/BusinessActionsCard';
import ConversionFunnelCard from '@/components/dashboard/actions/ConversionFunnelCard';
import MiniCalendar from '@/components/dashboard/sidebar/MiniCalendar';
import UrgentActions from '@/components/dashboard/sidebar/UrgentActions';
import PerformanceTimeline from '@/components/dashboard/sidebar/PerformanceTimeline';

import styles from '@/components/dashboard/Dashboard.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // KPI Stats
  const [kpiStats, setKpiStats] = useState({
    activeLeads: 0,
    todaysAppointments: 0,
    overdue: 0,
    approved: 0,
    pending: 0,
    jobsInProgress: 0
  });

  // Mock data for estimates (TODO: Replace with real API)
  const [estimates] = useState([
    {
      id: '1',
      customerName: 'John Smith',
      vehicleInfo: '2020 Honda Accord',
      amount: 1200,
      status: 'APPROVED',
      createdAt: new Date()
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      vehicleInfo: '2019 Toyota Camry',
      amount: 850,
      status: 'PENDING',
      createdAt: new Date()
    },
    {
      id: '3',
      customerName: 'Mike Davis',
      vehicleInfo: '2021 Ford F-150',
      amount: 2400,
      status: 'APPROVED',
      createdAt: new Date()
    },
    {
      id: '4',
      customerName: 'Emily Wilson',
      vehicleInfo: '2018 Nissan Altima',
      amount: 950,
      status: 'PENDING',
      createdAt: new Date()
    },
    {
      id: '5',
      customerName: 'Robert Brown',
      vehicleInfo: '2022 Chevrolet Silverado',
      amount: 3200,
      status: 'APPROVED',
      createdAt: new Date()
    },
    {
      id: '6',
      customerName: 'Jennifer Lee',
      vehicleInfo: '2020 Hyundai Elantra',
      amount: 750,
      status: 'PENDING',
      createdAt: new Date()
    },
    {
      id: '7',
      customerName: 'David Martinez',
      vehicleInfo: '2019 Mazda CX-5',
      amount: 1800,
      status: 'APPROVED',
      createdAt: new Date()
    }
  ]);

  // Mock appointments (TODO: Replace with real API)
  const [appointments] = useState([
    {
      id: '1',
      name: 'John Smith',
      time: '9:00 AM',
      icon: '🚗',
      details: 'Vehicle inspection'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      time: '11:30 AM',
      icon: '📋',
      details: 'Estimate review'
    },
    {
      id: '3',
      name: 'Mike Davis',
      time: '2:00 PM',
      icon: '🔧',
      details: 'Service appointment'
    },
    {
      id: '4',
      name: 'Emily Wilson',
      time: '3:30 PM',
      icon: '📞',
      details: 'Follow-up call'
    },
    {
      id: '5',
      name: 'Robert Brown',
      time: '4:30 PM',
      icon: '✅',
      details: 'Final approval'
    }
  ]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      console.log('[Dashboard] Fetching leads...');
      const response = await leadService.getLeads(1, 50);
      const allLeads = response.data || [];
      console.log('[Dashboard] Leads loaded:', allLeads.length);
      
      setLeads(allLeads);

      // Calculate KPI stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Active Leads: All non-archived leads
      const activeLeads = allLeads.filter(
        (lead) => lead.status !== LeadStatus.ARCHIVED
      ).length;

      // Today's Appointments: Mock data for now (TODO: Real API)
      const todaysAppointments = 5;

      // Overdue: Mock data (TODO: Real appointments API)
      const overdue = 3;

      // Approved: Calculate from estimates
      const approved = estimates
        .filter(e => e.status === 'APPROVED')
        .reduce((sum, e) => sum + e.amount, 0);

      // Pending: Calculate from estimates
      const pending = estimates
        .filter(e => e.status === 'PENDING')
        .reduce((sum, e) => sum + e.amount, 0);

      // Jobs In Progress: Mock data (TODO: Real jobs API)
      const jobsInProgress = 5;

      setKpiStats({
        activeLeads,
        todaysAppointments,
        overdue,
        approved,
        pending,
        jobsInProgress
      });

    } catch (error: any) {
      console.error('[Dashboard] ❌ Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try refreshing the page.');
      
      // Try fallback with smaller limit
      try {
        console.log('[Dashboard] Trying fallback with limit=10...');
        const fallbackResponse = await leadService.getLeads(1, 10);
        const fallbackLeads = fallbackResponse.data || [];
        setLeads(fallbackLeads);
        console.log('[Dashboard] ✅ Fallback succeeded, loaded', fallbackLeads.length, 'leads');
        toast.success('Loaded recent leads (limited view)');
      } catch (fallbackError: any) {
        console.error('[Dashboard] ❌ Fallback also failed:', fallbackError);
        toast.error('Cannot load leads. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Conversion funnel data
  const funnelStages = [
    {
      label: 'Leads Generated',
      count: kpiStats.activeLeads,
      percentage: 100,
      type: 'leads' as const
    },
    {
      label: 'Estimates Created',
      count: estimates.length,
      percentage: Math.round((estimates.length / Math.max(kpiStats.activeLeads, 1)) * 100),
      type: 'estimates' as const
    },
    {
      label: 'Approved',
      count: estimates.filter(e => e.status === 'APPROVED').length,
      percentage: Math.round((estimates.filter(e => e.status === 'APPROVED').length / Math.max(kpiStats.activeLeads, 1)) * 100),
      type: 'approved' as const
    },
    {
      label: 'Jobs Created',
      count: kpiStats.jobsInProgress,
      percentage: Math.round((kpiStats.jobsInProgress / Math.max(kpiStats.activeLeads, 1)) * 100),
      type: 'jobs' as const
    }
  ];

  // Performance timeline data (mock - TODO: Real data)
  const timelineData = [
    { label: 'Mon', leads: 12, estimates: 8 },
    { label: 'Tue', leads: 15, estimates: 10 },
    { label: 'Wed', leads: 9, estimates: 6 },
    { label: 'Thu', leads: 18, estimates: 12 },
    { label: 'Fri', leads: 14, estimates: 9 },
    { label: 'Sat', leads: 6, estimates: 4 },
    { label: 'Sun', leads: 4, estimates: 2 }
  ];

  // Urgent actions data (mock - TODO: Real data)
  const urgentActions = [
    {
      id: '1',
      icon: '📞',
      text: 'Missed Calls',
      count: 3,
      priority: 'high' as const,
      actionLabel: 'Call Back'
    },
    {
      id: '2',
      icon: '📧',
      text: 'Unread Messages',
      count: 7,
      priority: 'medium' as const,
      actionLabel: 'View'
    },
    {
      id: '3',
      icon: '⏰',
      text: 'Overdue Tasks',
      count: kpiStats.overdue,
      priority: 'high' as const,
      actionLabel: 'Review'
    },
    {
      id: '4',
      icon: '💰',
      text: 'Pending Approvals',
      count: estimates.filter(e => e.status === 'PENDING').length,
      priority: 'medium' as const,
      actionLabel: 'Approve'
    },
    {
      id: '5',
      icon: '📋',
      text: 'Follow-ups Due',
      count: 4,
      priority: 'low' as const,
      actionLabel: 'Schedule'
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
          FlipCars Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#666' }}>
          Welcome back, {user?.name || 'User'}! Here's your business overview.
        </p>
      </div>

      {/* KPI Cards - 6 columns */}
      <div className={styles.kpiGrid}>
        <ActiveLeadsCard 
          count={kpiStats.activeLeads} 
          subtitle="Active in pipeline"
          trend="up"
        />
        <AppointmentsCard 
          count={kpiStats.todaysAppointments} 
          subtitle="Scheduled today"
          trend="neutral"
        />
        <OverdueCard 
          count={kpiStats.overdue} 
          subtitle="Need attention"
          trend="down"
        />
        <ApprovedCard 
          amount={kpiStats.approved} 
          subtitle="Ready to proceed"
          trend="up"
        />
        <PendingCard 
          amount={kpiStats.pending} 
          subtitle="Awaiting review"
          trend="neutral"
        />
        <JobsCard 
          count={kpiStats.jobsInProgress} 
          subtitle="Currently active"
          trend="neutral"
        />
      </div>

      {/* Main Layout - 2 columns */}
      <div className={styles.mainLayout}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Week's Leads Table */}
          <WeeksLeadsTable leads={leads} maxHeight="400px" />

          {/* Estimates Table */}
          <EstimatesTable estimates={estimates} maxHeight="300px" limit={7} />

          {/* Business Actions & Conversion Funnel - 2 columns */}
          <div className={styles.actionsGrid}>
            <BusinessActionsCard />
            <ConversionFunnelCard stages={funnelStages} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.rightSidebar}>
          {/* Mini Calendar + Today's Appointments */}
          <MiniCalendar appointments={appointments} />

          {/* Urgent Actions */}
          <UrgentActions actions={urgentActions} />

          {/* Performance Timeline (at bottom) */}
          <PerformanceTimeline data={timelineData} period="week" />
        </div>
      </div>
    </div>
  );
}
