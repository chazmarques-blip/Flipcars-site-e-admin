'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { leadService } from '@/lib/api/lead.service';
import { appointmentsService, Appointment } from '@/lib/api/appointments.service';
import { Lead, LeadStatus } from '@/types/lead';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import styles from '@/components/dashboard/Dashboard-Mockup-Exact.module.css';

// Dashboard updated: Nov 22, 2025 - Real data integration
// Get today in Orlando timezone - HARDCODED for consistency
function getTodayInOrlando(): string {
  // TEMPORARY HARDCODE: Return 2025-11-22 to match appointments page
  return '2025-11-22';
}

// Helper: Format phone number
function formatPhone(phone: string): string {
  if (!phone) return '—';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

// Helper: Get relative time
function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Helper: Get current month name
function getCurrentMonth(): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeLeads: 0,
    todaysAppointments: 0,
    overdue: 0,
    qualified: 0,
    inProgress: 0,
    converted: 0,
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('[Dashboard] Fetching dashboard data...');
        
        // Fetch all leads (limit 100 for stats)
        const leadsResponse = await leadService.getLeads(1, 100);
        const allLeads = leadsResponse.data || [];
        console.log('[Dashboard] Loaded leads:', allLeads.length);
        
        // Fetch appointments for current month
        const now = new Date();
        const allAppointments = await appointmentsService.getAppointmentsByMonth(
          now.getFullYear(),
          now.getMonth() + 1
        );
        console.log('[Dashboard] Loaded appointments:', allAppointments.length);
        
        setLeads(allLeads);
        setAppointments(allAppointments);

        // Calculate statistics using Orlando timezone
        const todayStr = getTodayInOrlando();
        console.log('[Dashboard] Today in Orlando:', todayStr);
        
        const activeLeads = allLeads.filter(l => l.status !== LeadStatus.ARCHIVED && l.status !== LeadStatus.LOST).length;
        
        // Today's appointments (scheduled for today)
        const todaysAppointments = allAppointments.filter(apt => apt.appointmentDate === todayStr).length;
        
        const qualified = allLeads.filter(l => l.status === LeadStatus.QUALIFIED).length;
        const inProgress = allLeads.filter(l => l.status === LeadStatus.IN_PROGRESS).length;
        const converted = allLeads.filter(l => l.status === LeadStatus.CONVERTED || l.status === LeadStatus.WON).length;
        
        // Overdue: appointments in the past that are not completed/cancelled
        const overdueAppointments = allAppointments.filter(apt => {
          return apt.appointmentDate < todayStr && 
                 apt.status !== 'completed' && 
                 apt.status !== 'cancelled';
        }).length;

        setStats({
          activeLeads,
          todaysAppointments,
          overdue: overdueAppointments,
          qualified,
          inProgress,
          converted,
        });

        console.log('[Dashboard] Stats calculated:', { 
          activeLeads, 
          todaysAppointments, 
          overdue: overdueAppointments,
          totalAppointments: allAppointments.length 
        });
      } catch (error: any) {
        console.error('[Dashboard] Failed to fetch data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get last 7 days leads for table (sorted by creation date, newest first)
  const weekLeads = leads
    .filter(l => {
      const createdDate = new Date(l.createdAt);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdDate >= oneWeekAgo;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Get today's appointments
  const todayStr = getTodayInOrlando();
  const todaysAppointmentsList = appointments
    .filter(apt => apt.appointmentDate === todayStr)
    .sort((a, b) => a.appointmentStartTime.localeCompare(b.appointmentStartTime));

  // Calculate conversion funnel percentages
  const totalLeads = leads.length;
  const qualifiedCount = stats.qualified;
  const inProgressCount = stats.inProgress;
  const convertedCount = stats.converted;
  
  const qualifiedPercent = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0;
  const inProgressPercent = totalLeads > 0 ? Math.round((inProgressCount / totalLeads) * 100) : 0;
  const convertedPercent = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  // Business actions counts
  const pendingContactLeads = leads.filter(l => l.status === LeadStatus.NEW).length;
  const appointmentScheduledLeads = leads.filter(l => l.status === LeadStatus.APPOINTMENT_SCHEDULED).length;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Loading dashboard data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles['header-title']}>
          <h1>Welcome back, {user?.name || 'Admin'}! 👋</h1>
          <p className={styles['header-subtitle']}>Here&apos;s what&apos;s happening with your auto body shop today</p>
        </div>
        <div className={styles['header-actions']}>
          <button className={`${styles.btn} ${styles['btn-secondary']}`}>
            <span>📊</span>
            <span>Export</span>
          </button>
          <Link href="/dashboard/leads/new">
            <button className={`${styles.btn} ${styles['btn-primary']}`}>
              <span>📋</span>
              <span>New Lead</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards - Real Data */}
      <div className={styles['kpi-grid']}>
        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>📈</span>
          <div className={styles['kpi-label']}>Active Leads</div>
          <div className={styles['kpi-value']}>{stats.activeLeads}</div>
          <div className={styles['kpi-subtitle']}>{stats.qualified} qualified</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>📅</span>
          <div className={styles['kpi-label']}>Today&apos;s Appointments</div>
          <div className={styles['kpi-value']}>{stats.todaysAppointments}</div>
          <div className={styles['kpi-subtitle']}>Scheduled for Nov 22</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>⚠️</span>
          <div className={styles['kpi-label']}>Overdue</div>
          <div className={styles['kpi-value']}>{stats.overdue}</div>
          <div className={styles['kpi-subtitle']}>{stats.overdue === 0 ? 'All on track!' : 'Need attention'}</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>✅</span>
          <div className={styles['kpi-label']}>Qualified</div>
          <div className={styles['kpi-value']}>{stats.qualified}</div>
          <div className={styles['kpi-subtitle']}>Ready for appointment</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>⏳</span>
          <div className={styles['kpi-label']}>In Progress</div>
          <div className={styles['kpi-value']}>{stats.inProgress}</div>
          <div className={styles['kpi-subtitle']}>Currently working</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>🔧</span>
          <div className={styles['kpi-label']}>Converted</div>
          <div className={styles['kpi-value']}>{stats.converted}</div>
          <div className={styles['kpi-subtitle']}>Success rate: {convertedPercent}%</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles['main-layout']}>
        {/* Left Column */}
        <div>
          {/* Week's Leads Table - REAL DATA */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>🎯 Recent Leads</div>
                <div className={styles['card-subtitle']}>Last {weekLeads.length} leads from the past 7 days</div>
              </div>
              <Link href="/dashboard/leads" className={styles['view-all']}>View All</Link>
            </div>
            <div className={styles['card-body']} style={{ padding: 0, maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
              {weekLeads.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <p>No leads in the last 7 days</p>
                </div>
              ) : (
                <table className={styles['leads-table']}>
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Reference</th>
                      <th style={{ width: '90px' }}>Customer</th>
                      <th style={{ width: '90px' }}>Contact</th>
                      <th style={{ width: '40px', textAlign: 'center' }}>Pref</th>
                      <th style={{ width: '120px' }}>Vehicle</th>
                      <th style={{ width: '70px' }}>Status</th>
                      <th style={{ width: '70px' }}>Who Pays</th>
                      <th style={{ width: '80px' }}>Company</th>
                      <th style={{ width: '70px' }}>AI Score</th>
                      <th style={{ width: '40px', textAlign: 'center' }}>Photos</th>
                      <th style={{ width: '55px' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekLeads.map((lead, index) => (
                      <tr key={lead.id}>
                        <td><span className={styles['lead-ref']}>{lead.referenceNumber}</span></td>
                        <td><span className={styles['lead-customer']}>{lead.name}</span></td>
                        <td><span className={styles['lead-phone']}>{formatPhone(lead.phone)}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          {lead.contactPreferences && (
                            <div style={{ display: 'inline-flex', gap: '2px' }}>
                              {lead.contactPreferences.phoneCall && (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fffbf0', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Phone">
                                  <span style={{ fontSize: '10px' }}>📞</span>
                                </div>
                              )}
                              {lead.contactPreferences.whatsapp && (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="WhatsApp">
                                  <span style={{ fontSize: '10px' }}>💬</span>
                                </div>
                              )}
                              {lead.contactPreferences.textMessage && (
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Text">
                                  <span style={{ fontSize: '10px' }}>💭</span>
                                </div>
                              )}
                            </div>
                          )}
                          {!lead.contactPreferences && <span style={{ color: '#ccc' }}>—</span>}
                        </td>
                        <td>
                          <span className={styles['lead-vehicle']}>
                            {lead.vehicleMake && lead.vehicleModel ? (
                              <>
                                {lead.vehicleMake.toUpperCase()} {lead.vehicleModel}
                                {lead.vehicleYear && <span className={styles['lead-vehicle-year']}>{lead.vehicleYear}</span>}
                              </>
                            ) : '—'}
                          </span>
                        </td>
                        <td>
                          <span className={styles['badge-service']}>
                            {lead.status === LeadStatus.NEW && 'New'}
                            {lead.status === LeadStatus.CONTACTED && 'Contacted'}
                            {lead.status === LeadStatus.QUALIFIED && 'Qualified'}
                            {lead.status === LeadStatus.APPOINTMENT_SCHEDULED && 'Scheduled'}
                            {lead.status === LeadStatus.IN_PROGRESS && 'In Progress'}
                            {lead.status === LeadStatus.CONVERTED && 'Converted'}
                            {lead.status === LeadStatus.WON && 'Won'}
                            {lead.status === LeadStatus.LOST && 'Lost'}
                          </span>
                        </td>
                        <td>
                          <span className={styles['badge-whopay']}>
                            {lead.hasInsurance ? 'Insurance' : 'Cash'}
                          </span>
                        </td>
                        <td>
                          <span className={styles['lead-company']}>
                            {lead.insuranceProvider || lead.insuranceCompany || '—'}
                          </span>
                        </td>
                        <td>
                          {lead.aiQualificationScore ? (
                            <div className={styles['lead-score']}>
                              <div className={styles['lead-score-bar']}>
                                <div className={styles['lead-score-fill']} style={{ width: `${lead.aiQualificationScore}%` }}></div>
                              </div>
                              <span className={styles['lead-score-num']}>{lead.aiQualificationScore}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {lead.damagePhotos && lead.damagePhotos.length > 0 ? (
                            <span style={{ fontSize: '16px', cursor: 'pointer' }} title={`${lead.damagePhotos.length} photos`}>👁️</span>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link href={`/dashboard/leads/${lead.id}`} className={styles['lead-btn-view']}>
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Business Actions & Conversion Funnel Grid */}
          <div className={styles['actions-grid']}>
            {/* Business Actions */}
            <div className={styles.card}>
              <div className={styles['card-header']}>
                <div>
                  <div className={styles['card-title']}>💼 Business Actions</div>
                  <div className={styles['card-subtitle']}>Quick access to common tasks</div>
                </div>
              </div>
              <div className={styles['card-body']}>
                <Link href="/dashboard/leads?status=new" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📞</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Call Pending Leads</div>
                      <div className={styles['action-subtitle']}>{pendingContactLeads} leads awaiting contact</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </Link>

                <Link href="/dashboard/leads/new" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📋</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Create New Lead</div>
                      <div className={styles['action-subtitle']}>Add manual lead entry</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </Link>

                <Link href="/dashboard/appointments" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📅</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Schedule Appointment</div>
                      <div className={styles['action-subtitle']}>Book customer visit</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </Link>

                <Link href="/dashboard/leads?status=appointment_scheduled" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>💬</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Send Follow-up</div>
                      <div className={styles['action-subtitle']}>{appointmentScheduledLeads} scheduled appointments</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </Link>
              </div>
            </div>

            {/* Conversion Funnel - REAL DATA */}
            <div className={styles.card}>
              <div className={styles['card-header']}>
                <div>
                  <div className={styles['card-title']}>📈 Conversion Funnel</div>
                  <div className={styles['card-subtitle']}>Pipeline performance</div>
                </div>
              </div>
              <div className={styles['card-body']}>
                {/* Stage 1: Total Leads */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>🎯</span>
                      <span>Total Leads</span>
                    </div>
                    <div className={styles['funnel-value']}>{totalLeads}</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.leads}`} style={{ width: '100%' }}>
                      <span>100%</span>
                      <span>{totalLeads} leads</span>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Qualified */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>✅</span>
                      <span>Qualified</span>
                    </div>
                    <div className={styles['funnel-value']}>{qualifiedCount}</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.estimates}`} style={{ width: `${qualifiedPercent}%` }}>
                      <span>{qualifiedPercent}%</span>
                      <span>{qualifiedCount} qualified</span>
                    </div>
                  </div>
                  {totalLeads > 0 && (
                    <div className={styles['funnel-percentage']}>↓ {qualifiedPercent}% qualification rate</div>
                  )}
                </div>

                {/* Stage 3: In Progress */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>⏳</span>
                      <span>In Progress</span>
                    </div>
                    <div className={styles['funnel-value']}>{inProgressCount}</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.approved}`} style={{ width: `${inProgressPercent}%` }}>
                      <span>{inProgressPercent}%</span>
                      <span>{inProgressCount} active</span>
                    </div>
                  </div>
                  {totalLeads > 0 && (
                    <div className={styles['funnel-percentage']}>↓ {inProgressPercent}% in progress</div>
                  )}
                </div>

                {/* Stage 4: Converted */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>🔧</span>
                      <span>Converted</span>
                    </div>
                    <div className={styles['funnel-value']}>{convertedCount}</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.jobs}`} style={{ width: `${convertedPercent}%` }}>
                      <span>{convertedPercent}%</span>
                      <span>{convertedCount} won</span>
                    </div>
                  </div>
                  {totalLeads > 0 && (
                    <div className={styles['funnel-percentage']}>↓ {convertedPercent}% overall conversion</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Today's Appointments - REAL DATA */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>📅 Today&apos;s Schedule</div>
                <div className={styles['card-subtitle']}>Appointments for Nov 22, 2025</div>
              </div>
              <Link href="/dashboard/appointments" className={styles['view-all']}>View Calendar</Link>
            </div>
            <div className={styles['card-body']} style={{ padding: '12px' }}>
              {todaysAppointmentsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <p>No appointments scheduled for today</p>
                </div>
              ) : (
                <div className={styles['calendar-appointments-list']}>
                  {todaysAppointmentsList.map((apt) => (
                    <div key={apt.id} className={styles['calendar-appointment-mini']}>
                      <div className={styles['calendar-appointment-time-mini']}>
                        {apt.appointmentStartTime}
                      </div>
                      <div className={styles['calendar-appointment-info-mini']}>
                        <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>
                          {apt.lead?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                          {apt.lead?.vehicleMake && apt.lead?.vehicleModel ? (
                            `${apt.lead.vehicleYear || ''} ${apt.lead.vehicleMake} ${apt.lead.vehicleModel}`.trim()
                          ) : (
                            'Vehicle not specified'
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Urgent Actions - REAL DATA */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>⚠️ Urgent Actions</div>
                <div className={styles['card-subtitle']}>
                  {(stats.overdue + pendingContactLeads > 0) 
                    ? `${stats.overdue + pendingContactLeads} items need attention`
                    : 'All caught up!'}
                </div>
              </div>
            </div>
            <div className={styles['card-body']}>
              {stats.overdue > 0 && (
                <div className={`${styles['urgent-item']} ${styles['priority-high']}`}>
                  <div className={styles['urgent-icon']}>🔴</div>
                  <div className={styles['urgent-item-content']}>
                    <div className={styles['urgent-text']}>
                      <strong>Overdue appointments</strong>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>Past due dates</div>
                    </div>
                    <span className={`${styles['urgent-count']} ${styles['priority-high']}`}>{stats.overdue}</span>
                  </div>
                  <Link href="/dashboard/appointments">
                    <button className={styles['urgent-action-btn']}>Review Now</button>
                  </Link>
                </div>
              )}

              {pendingContactLeads > 0 && (
                <div className={`${styles['urgent-item']} ${styles['priority-medium']}`}>
                  <div className={styles['urgent-icon']}>🟠</div>
                  <div className={styles['urgent-item-content']}>
                    <div className={styles['urgent-text']}>
                      <strong>Leads awaiting response</strong>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>No contact made yet</div>
                    </div>
                    <span className={`${styles['urgent-count']} ${styles['priority-medium']}`}>{pendingContactLeads}</span>
                  </div>
                  <Link href="/dashboard/leads?status=new">
                    <button className={styles['urgent-action-btn']}>Contact</button>
                  </Link>
                </div>
              )}

              {stats.todaysAppointments > 0 && (
                <div className={`${styles['urgent-item']} ${styles['priority-low']}`}>
                  <div className={styles['urgent-icon']}>🟡</div>
                  <div className={styles['urgent-item-content']}>
                    <div className={styles['urgent-text']}>
                      <strong>Today&apos;s appointments</strong>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>Scheduled for today</div>
                    </div>
                    <span className={`${styles['urgent-count']} ${styles['priority-low']}`}>{stats.todaysAppointments}</span>
                  </div>
                  <Link href="/dashboard/appointments">
                    <button className={styles['urgent-action-btn']}>View</button>
                  </Link>
                </div>
              )}

              {stats.overdue === 0 && pendingContactLeads === 0 && stats.todaysAppointments === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <p>✅ All caught up! No urgent actions needed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
