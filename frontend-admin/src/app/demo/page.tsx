'use client';

import React, { useState } from 'react';

// Import dashboard components
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

// Mock data for demo
const generateMockLeads = () => {
  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'ESTIMATE_SENT', 'APPROVED', 'IN_PROGRESS'];
  const names = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Wilson', 'Robert Brown', 'Jennifer Lee', 'David Martinez', 'Lisa Garcia', 'James Anderson', 'Maria Rodriguez'];
  const vehicles = ['2020 Honda Accord', '2019 Toyota Camry', '2021 Ford F-150', '2018 Nissan Altima', '2022 Chevrolet Silverado', '2020 Hyundai Elantra', '2019 Mazda CX-5', '2021 Kia Sorento', '2020 Subaru Outback', '2019 Volkswagen Jetta'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `demo-${i + 1}`,
    firstName: names[i % names.length].split(' ')[0],
    lastName: names[i % names.length].split(' ')[1],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    vehicleInfo: vehicles[i % vehicles.length],
    damageDescription: 'Front bumper damage from accident',
    preferredContactMethod: i % 2 === 0 ? 'PHONE' : 'EMAIL',
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

const mockEstimates = [
  { id: '1', customerName: 'John Smith', vehicleInfo: '2020 Honda Accord', amount: 1200, status: 'APPROVED', createdAt: new Date() },
  { id: '2', customerName: 'Sarah Johnson', vehicleInfo: '2019 Toyota Camry', amount: 850, status: 'PENDING', createdAt: new Date() },
  { id: '3', customerName: 'Mike Davis', vehicleInfo: '2021 Ford F-150', amount: 2400, status: 'APPROVED', createdAt: new Date() },
  { id: '4', customerName: 'Emily Wilson', vehicleInfo: '2018 Nissan Altima', amount: 950, status: 'PENDING', createdAt: new Date() },
  { id: '5', customerName: 'Robert Brown', vehicleInfo: '2022 Chevrolet Silverado', amount: 3200, status: 'APPROVED', createdAt: new Date() },
  { id: '6', customerName: 'Jennifer Lee', vehicleInfo: '2020 Hyundai Elantra', amount: 750, status: 'PENDING', createdAt: new Date() },
  { id: '7', customerName: 'David Martinez', vehicleInfo: '2019 Mazda CX-5', amount: 1800, status: 'APPROVED', createdAt: new Date() }
];

const mockAppointments = [
  { id: '1', name: 'John Smith', time: '9:00 AM', icon: '🚗', details: 'Vehicle inspection' },
  { id: '2', name: 'Sarah Johnson', time: '11:30 AM', icon: '📋', details: 'Estimate review' },
  { id: '3', name: 'Mike Davis', time: '2:00 PM', icon: '🔧', details: 'Service appointment' },
  { id: '4', name: 'Emily Wilson', time: '3:30 PM', icon: '📞', details: 'Follow-up call' },
  { id: '5', name: 'Robert Brown', time: '4:30 PM', icon: '✅', details: 'Final approval' }
];

export default function DemoDashboardPage() {
  const [leads] = useState(generateMockLeads());
  const [estimates] = useState(mockEstimates);
  const [appointments] = useState(mockAppointments);

  // Calculate KPI stats
  const activeLeads = leads.filter(l => l.status !== 'ARCHIVED').length;
  const todaysAppointments = 5;
  const overdue = 3;
  const approved = estimates.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0);
  const pending = estimates.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.amount, 0);
  const jobsInProgress = 5;

  // Conversion Funnel stages
  const funnelStages = [
    { label: 'Initial Contact', count: 45, percentage: 100, type: 'leads' as const },
    { label: 'Site Inspection', count: 32, percentage: 71, type: 'estimates' as const },
    { label: 'Estimate Sent', count: 24, percentage: 53, type: 'estimates' as const },
    { label: 'Job Approved', count: 18, percentage: 40, type: 'approved' as const }
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Demo Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        marginBottom: '24px',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '16px',
        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
      }}>
        🎨 DEMO MODE - Dashboard Preview (No Authentication Required)
      </div>

      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <p className={styles.dashboardSubtitle}>Welcome! Here's your business overview</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <ActiveLeadsCard count={activeLeads} />
        <AppointmentsCard count={todaysAppointments} />
        <OverdueCard count={overdue} />
        <ApprovedCard amount={approved} />
        <PendingCard amount={pending} />
        <JobsCard count={jobsInProgress} />
      </div>

      {/* Main Content Layout */}
      <div className={styles.mainLayout}>
        {/* Left Column */}
        <div className={styles.mainColumn}>
          {/* Week's Leads Table */}
          <WeeksLeadsTable leads={leads} />

          {/* Latest Estimates Table */}
          <EstimatesTable estimates={estimates} />

          {/* Actions Row */}
          <div className={styles.actionsRow}>
            <BusinessActionsCard />
            <ConversionFunnelCard stages={funnelStages} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={styles.sidebar}>
          <MiniCalendar appointments={appointments} />
          <UrgentActions />
          <PerformanceTimeline />
        </div>
      </div>
    </div>
  );
}
