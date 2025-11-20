'use client';

import React from 'react';
import styles from '@/components/dashboard/Dashboard-Mockup-Exact.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles['header-title']}>
          <h1>Welcome back, Admin FlipCars US! 👋</h1>
          <p className={styles['header-subtitle']}>Here&apos;s what&apos;s happening with your auto body shop today</p>
        </div>
        <div className={styles['header-actions']}>
          <button className={`${styles.btn} ${styles['btn-secondary']}`}>
            <span>📊</span>
            <span>Export</span>
          </button>
          <button className={`${styles.btn} ${styles['btn-primary']}`}>
            <span>📋</span>
            <span>New Estimate</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles['kpi-grid']}>
        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>📈</span>
          <div className={styles['kpi-label']}>Active Leads</div>
          <div className={styles['kpi-value']}>18</div>
          <div className={styles['kpi-subtitle']}>6 qualified today</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>📅</span>
          <div className={styles['kpi-label']}>Today&apos;s Appointments</div>
          <div className={styles['kpi-value']}>2</div>
          <div className={styles['kpi-subtitle']}>Nov 15, 2025</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>⚠️</span>
          <div className={styles['kpi-label']}>Overdue</div>
          <div className={styles['kpi-value']}>0</div>
          <div className={styles['kpi-subtitle']}>All on track!</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>✅</span>
          <div className={styles['kpi-label']}>Approved</div>
          <div className={styles['kpi-value']}>$6.32K</div>
          <div className={styles['kpi-subtitle']}>1 estimate approved</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>⏳</span>
          <div className={styles['kpi-label']}>Pending</div>
          <div className={styles['kpi-value']}>$7.75K</div>
          <div className={styles['kpi-subtitle']}>2 estimates awaiting</div>
        </div>

        <div className={styles['kpi-card']}>
          <span className={styles['kpi-trend']}>🔧</span>
          <div className={styles['kpi-label']}>Jobs In Progress</div>
          <div className={styles['kpi-value']}>5</div>
          <div className={styles['kpi-subtitle']}>3 completing this week</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles['main-layout']}>
        {/* Left Column */}
        <div>
          {/* Week's Leads Table */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>🎯 Week&apos;s Leads</div>
                <div className={styles['card-subtitle']}>New leads received in the last 7 days</div>
              </div>
              <a href="#" className={styles['view-all']}>View All</a>
            </div>
            <div className={styles['card-body']} style={{ padding: 0, maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
              <table className={styles['leads-table']}>
                <thead>
                  <tr>
                    <th style={{ width: '30px' }}>#</th>
                    <th style={{ width: '100px' }}>Reference</th>
                    <th style={{ width: '90px' }}>Customer</th>
                    <th style={{ width: '90px' }}>Contact</th>
                    <th style={{ width: '40px', textAlign: 'center' }}>Pref</th>
                    <th style={{ width: '120px' }}>Vehicle</th>
                    <th style={{ width: '70px' }}>Service</th>
                    <th style={{ width: '70px' }}>Who Pay</th>
                    <th style={{ width: '80px' }}>Company</th>
                    <th style={{ width: '70px' }}>AI Score</th>
                    <th style={{ width: '40px', textAlign: 'center' }}>Photos</th>
                    <th style={{ width: '55px' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Lead 1 */}
                  <tr>
                    <td><span className={styles['lead-index']}>20</span></td>
                    <td><span className={styles['lead-ref']}>2025-1119-0002</span></td>
                    <td><span className={styles['lead-customer']}>Jose Silva</span></td>
                    <td><span className={styles['lead-phone']}>(321) 405-6789</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '2px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fffbf0', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Phone">
                          <span style={{ fontSize: '10px' }}>📞</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles['lead-vehicle']}>CHEVROLET Silverado<span className={styles['lead-vehicle-year']}>2021</span></span></td>
                    <td><span className={styles['badge-service']}>Bodyshop</span></td>
                    <td><span className={styles['badge-whopay']}>Insurance</span></td>
                    <td><span className={styles['lead-company']}>Progressive</span></td>
                    <td>
                      <div className={styles['lead-score']}>
                        <div className={styles['lead-score-bar']}>
                          <div className={styles['lead-score-fill']} style={{ width: '85%' }}></div>
                        </div>
                        <span className={styles['lead-score-num']}>85</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '16px', cursor: 'pointer' }} title="View photos">👁️</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Lead 2 */}
                  <tr>
                    <td><span className={styles['lead-index']}>19</span></td>
                    <td><span className={styles['lead-ref']}>2025-1119-0001</span></td>
                    <td><span className={styles['lead-customer']}>Lourenco Gadella</span></td>
                    <td><span className={styles['lead-phone']}>(858) 531-9800</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '2px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="WhatsApp">
                          <span style={{ fontSize: '10px' }}>💬</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles['lead-vehicle']}>CHEVROLET Tahoe<span className={styles['lead-vehicle-year']}>2022</span></span></td>
                    <td><span className={styles['badge-service']}>Bodyshop</span></td>
                    <td><span className={styles['badge-whopay']}>Insurance</span></td>
                    <td><span className={styles['lead-company']}>USAA</span></td>
                    <td>
                      <div className={styles['lead-score']}>
                        <div className={styles['lead-score-bar']}>
                          <div className={styles['lead-score-fill']} style={{ width: '92%' }}></div>
                        </div>
                        <span className={styles['lead-score-num']}>92</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '16px', cursor: 'pointer' }} title="View photos">👁️</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Lead 3 */}
                  <tr>
                    <td><span className={styles['lead-index']}>18</span></td>
                    <td><span className={styles['lead-ref']}>2025-1118-0006</span></td>
                    <td><span className={styles['lead-customer']}>Maria Silva</span></td>
                    <td><span className={styles['lead-phone']}>(321) 456-7890</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '2px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fffbf0', border: '1px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Phone">
                          <span style={{ fontSize: '10px' }}>📞</span>
                        </div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Text">
                          <span style={{ fontSize: '10px' }}>💭</span>
                        </div>
                      </div>
                    </td>
                    <td><span className={styles['lead-vehicle']}>CHEVROLET Silverado<span className={styles['lead-vehicle-year']}>2021</span></span></td>
                    <td><span className={styles['badge-service']}>Bodyshop</span></td>
                    <td><span className={styles['badge-whopay']}>Insurance</span></td>
                    <td><span className={styles['lead-company']}>USAA</span></td>
                    <td>
                      <div className={styles['lead-score']}>
                        <div className={styles['lead-score-bar']}>
                          <div className={styles['lead-score-fill']} style={{ width: '78%' }}></div>
                        </div>
                        <span className={styles['lead-score-num']}>78</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Lead 4 */}
                  <tr>
                    <td><span className={styles['lead-index']}>17</span></td>
                    <td><span className={styles['lead-ref']}>2025-1118-0005</span></td>
                    <td><span className={styles['lead-customer']}>Cliente 4</span></td>
                    <td><span className={styles['lead-phone']}>11999999994</span></td>
                    <td style={{ textAlign: 'center' }}>—</td>
                    <td><span className={styles['lead-vehicle']}>Toyota Corolla<span className={styles['lead-vehicle-year']}>2020</span></span></td>
                    <td><span className={styles['badge-service']}>Bodyshop</span></td>
                    <td><span className={styles['badge-whopay']}>Insurance</span></td>
                    <td><span className={styles['lead-company']}>—</span></td>
                    <td>
                      <div className={styles['lead-score']}>
                        <div className={styles['lead-score-bar']}>
                          <div className={styles['lead-score-fill']} style={{ width: '65%' }}></div>
                        </div>
                        <span className={styles['lead-score-num']}>65</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Lead 5 */}
                  <tr>
                    <td><span className={styles['lead-index']}>16</span></td>
                    <td><span className={styles['lead-ref']}>2025-1118-0004</span></td>
                    <td><span className={styles['lead-customer']}>Cliente 3</span></td>
                    <td><span className={styles['lead-phone']}>11999999993</span></td>
                    <td style={{ textAlign: 'center' }}>—</td>
                    <td><span className={styles['lead-vehicle']}>Toyota Corolla<span className={styles['lead-vehicle-year']}>2020</span></span></td>
                    <td><span className={styles['badge-service']}>Bodyshop</span></td>
                    <td><span className={styles['badge-whopay']}>Insurance</span></td>
                    <td><span className={styles['lead-company']}>—</span></td>
                    <td>
                      <div className={styles['lead-score']}>
                        <div className={styles['lead-score-bar']}>
                          <div className={styles['lead-score-fill']} style={{ width: '88%' }}></div>
                        </div>
                        <span className={styles['lead-score-num']}>88</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#ccc', fontSize: '11px' }}>—</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Estimates in Progress Table */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>📋 Estimates in Progress</div>
                <div className={styles['card-subtitle']}>7 estimates awaiting action</div>
              </div>
              <a href="/dashboard/estimates" className={styles['view-all']}>View All</a>
            </div>
            <div className={styles['card-body']} style={{ padding: 0, overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              <table className={styles['leads-table']}>
                <thead>
                  <tr>
                    <th style={{ width: '30px', textAlign: 'center' }}>#</th>
                    <th style={{ width: '110px' }}>Reference</th>
                    <th style={{ width: '100px' }}>Customer</th>
                    <th style={{ width: '130px' }}>Vehicle</th>
                    <th style={{ width: '80px' }}>Amount</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th style={{ width: '80px' }}>Company</th>
                    <th style={{ width: '100px' }}>Created/Updated</th>
                    <th style={{ width: '55px' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Estimate 1 */}
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>1</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1119-001</span></td>
                    <td><span className={styles['lead-customer']}>Maria Silva</span></td>
                    <td><span className={styles['lead-vehicle']}>2021 CHEVROLET Silverado</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$4,850.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-pending']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>⏳ Pending</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>Progressive</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Created 2 days ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Estimate 2 */}
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>2</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1118-005</span></td>
                    <td><span className={styles['lead-customer']}>Lourenco Gadelha</span></td>
                    <td><span className={styles['lead-vehicle']}>2022 CHEVROLET Tahoe</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$6,320.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-approved']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>✅ Approved</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>USAA</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Approved 1 day ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Estimate 3 */}
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>3</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1117-012</span></td>
                    <td><span className={styles['lead-customer']}>Jose Silva</span></td>
                    <td><span className={styles['lead-vehicle']}>2020 Toyota Corolla</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$2,900.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-pending']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>⏳ Pending</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>State Farm</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Created 3 days ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Estimate 4 - Completed */}
                  <tr style={{ opacity: 0.7 }}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>4</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1116-008</span></td>
                    <td><span className={styles['lead-customer']}>Ana Costa</span></td>
                    <td><span className={styles['lead-vehicle']}>2019 Honda Civic</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$5,450.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-completed']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>🎉 Completed</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>Allstate</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Completed 5 days ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Estimate 5 */}
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>5</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1117-003</span></td>
                    <td><span className={styles['lead-customer']}>Roberto Santos</span></td>
                    <td><span className={styles['lead-vehicle']}>2020 FORD F-150</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$3,200.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-pending']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>⏳ Pending</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>State Farm</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Created 4 days ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>

                  {/* Estimate 6 */}
                  <tr>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#666' }}>6</td>
                    <td><span className={styles['lead-ref']}>EST-2025-1115-012</span></td>
                    <td><span className={styles['lead-customer']}>Patricia Lima</span></td>
                    <td><span className={styles['lead-vehicle']}>2023 TOYOTA Camry</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>$2,750.00</span></td>
                    <td>
                      <div className={styles['status-dropdown']}>
                        <button className={`${styles['status-button']} ${styles['status-approved']}`} style={{ width: '100%', fontSize: '10px', padding: '4px 8px' }}>
                          <span>✅ Approved</span>
                          <span style={{ fontSize: '8px' }}>▼</span>
                        </button>
                      </div>
                    </td>
                    <td><span className={styles['lead-company']}>Geico</span></td>
                    <td><span style={{ fontSize: '10px', color: '#999' }}>Approved 3 days ago</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <a href="#" className={styles['lead-btn-view']}>Details</a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                <a href="#leads" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📞</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Call Pending Leads</div>
                      <div className={styles['action-subtitle']}>3 leads awaiting contact</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </a>

                <a href="#estimates" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📋</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Create New Estimate</div>
                      <div className={styles['action-subtitle']}>Start new quote</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </a>

                <a href="#calendar" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>📅</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Schedule Appointment</div>
                      <div className={styles['action-subtitle']}>Book customer visit</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </a>

                <a href="#messages" className={styles['action-button']}>
                  <div className={styles['action-content']}>
                    <div className={styles['action-icon']}>💬</div>
                    <div className={styles['action-text']}>
                      <div className={styles['action-title']}>Send Follow-up</div>
                      <div className={styles['action-subtitle']}>Message customers</div>
                    </div>
                  </div>
                  <div className={styles['action-arrow']}>→</div>
                </a>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className={styles.card}>
              <div className={styles['card-header']}>
                <div>
                  <div className={styles['card-title']}>📈 Conversion Funnel</div>
                  <div className={styles['card-subtitle']}>Pipeline performance</div>
                </div>
              </div>
              <div className={styles['card-body']}>
                {/* Stage 1: Leads */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>🎯</span>
                      <span>Leads</span>
                    </div>
                    <div className={styles['funnel-value']}>18</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.leads}`} style={{ width: '100%' }}>
                      <span>100%</span>
                      <span>18 leads</span>
                    </div>
                  </div>
                </div>

                {/* Stage 2: Estimates */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>📋</span>
                      <span>Estimates</span>
                    </div>
                    <div className={styles['funnel-value']}>7</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.estimates}`} style={{ width: '78%' }}>
                      <span>78%</span>
                      <span>7 estimates</span>
                    </div>
                  </div>
                  <div className={styles['funnel-percentage']}>↓ 39% conversion from leads</div>
                </div>

                {/* Stage 3: Approved */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>✅</span>
                      <span>Approved</span>
                    </div>
                    <div className={styles['funnel-value']}>3</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.approved}`} style={{ width: '43%' }}>
                      <span>43%</span>
                      <span>3 approved</span>
                    </div>
                  </div>
                  <div className={styles['funnel-percentage']}>↓ 43% approval rate</div>
                </div>

                {/* Stage 4: Jobs */}
                <div className={styles['funnel-stage']}>
                  <div className={styles['funnel-header']}>
                    <div className={styles['funnel-label']}>
                      <span>🔧</span>
                      <span>Jobs</span>
                    </div>
                    <div className={styles['funnel-value']}>5</div>
                  </div>
                  <div className={styles['funnel-bar-container']}>
                    <div className={`${styles['funnel-bar']} ${styles.jobs}`} style={{ width: '56%' }}>
                      <span>56%</span>
                      <span>5 jobs</span>
                    </div>
                  </div>
                  <div className={styles['funnel-percentage']}>↓ 28% overall conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Mini Calendar with Today's Appointments */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>📅 Agenda</div>
                <div className={styles['card-subtitle']}>Appointments & Schedule</div>
              </div>
              <a href="/dashboard/calendar" className={styles['view-all']}>View Calendar</a>
            </div>
            <div className={styles['card-body']} style={{ padding: '12px' }}>
              <div className={styles['mini-calendar']}>
                <div className={styles['calendar-header']}>
                  <div className={styles['calendar-month']}>November 2025</div>
                  <div className={styles['calendar-nav']}>
                    <button className={styles['calendar-nav-btn']}>◀</button>
                    <button className={styles['calendar-nav-btn']}>▶</button>
                  </div>
                </div>
                
                <div className={styles['calendar-weekdays']}>
                  <div className={styles['calendar-weekday']}>Sun</div>
                  <div className={styles['calendar-weekday']}>Mon</div>
                  <div className={styles['calendar-weekday']}>Tue</div>
                  <div className={styles['calendar-weekday']}>Wed</div>
                  <div className={styles['calendar-weekday']}>Thu</div>
                  <div className={styles['calendar-weekday']}>Fri</div>
                  <div className={styles['calendar-weekday']}>Sat</div>
                </div>
                
                <div className={styles['calendar-days']}>
                  {/* Previous month days */}
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>27</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>28</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>29</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>30</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>31</div>
                  
                  {/* November 2025 */}
                  <div className={styles['calendar-day']}>1</div>
                  <div className={styles['calendar-day']}>2</div>
                  <div className={styles['calendar-day']}>3</div>
                  <div className={styles['calendar-day']}>4</div>
                  <div className={styles['calendar-day']}>5</div>
                  <div className={styles['calendar-day']}>6</div>
                  <div className={styles['calendar-day']}>7</div>
                  <div className={styles['calendar-day']}>8</div>
                  <div className={styles['calendar-day']}>9</div>
                  <div className={styles['calendar-day']}>10</div>
                  <div className={styles['calendar-day']}>11</div>
                  <div className={styles['calendar-day']}>12</div>
                  <div className={styles['calendar-day']}>13</div>
                  <div className={styles['calendar-day']}>14</div>
                  <div className={`${styles['calendar-day']} ${styles.today}`}>15</div>
                  <div className={styles['calendar-day']}>16</div>
                  <div className={styles['calendar-day']}>17</div>
                  <div className={styles['calendar-day']}>18</div>
                  <div className={styles['calendar-day']}>19</div>
                  <div className={styles['calendar-day']}>20</div>
                  <div className={styles['calendar-day']}>21</div>
                  <div className={styles['calendar-day']}>22</div>
                  <div className={styles['calendar-day']}>23</div>
                  <div className={styles['calendar-day']}>24</div>
                  <div className={`${styles['calendar-day']} ${styles['has-event']} ${styles['has-badge']}`} data-count="1">25</div>
                  <div className={styles['calendar-day']}>26</div>
                  <div className={`${styles['calendar-day']} ${styles['has-event']} ${styles['has-badge']}`} data-count="1">27</div>
                  <div className={styles['calendar-day']}>28</div>
                  <div className={styles['calendar-day']}>29</div>
                  <div className={styles['calendar-day']}>30</div>
                  
                  {/* Next month */}
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>1</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>2</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>3</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>4</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>5</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>6</div>
                  <div className={`${styles['calendar-day']} ${styles['other-month']}`}>7</div>
                </div>
                
                {/* Today's Appointments */}
                <div className={styles['calendar-appointments-list']}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                    Today&apos;s Appointments
                  </div>
                  
                  <div className={styles['calendar-appointment-mini']}>
                    <div className={styles['calendar-appointment-time-mini']}>10:00</div>
                    <div className={styles['calendar-appointment-info-mini']}>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>Maria Silva</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>2021 CHEVROLET Silverado</div>
                    </div>
                  </div>
                  
                  <div className={styles['calendar-appointment-mini']}>
                    <div className={styles['calendar-appointment-time-mini']}>14:00</div>
                    <div className={styles['calendar-appointment-info-mini']}>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>Lourenco Gadelha</div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>2022 CHEVROLET Tahoe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Actions */}
          <div className={styles.card} style={{ marginBottom: '24px' }}>
            <div className={styles['card-header']}>
              <div>
                <div className={styles['card-title']}>⚠️ Urgent Actions</div>
                <div className={styles['card-subtitle']}>5 items need attention</div>
              </div>
            </div>
            <div className={styles['card-body']}>
              {/* High Priority */}
              <div className={`${styles['urgent-item']} ${styles['priority-high']}`}>
                <div className={styles['urgent-icon']}>🔴</div>
                <div className={styles['urgent-item-content']}>
                  <div className={styles['urgent-text']}>
                    <strong>Estimates pending review</strong>
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>Waiting &gt; 3 days</div>
                  </div>
                  <span className={`${styles['urgent-count']} ${styles['priority-high']}`}>2</span>
                </div>
                <button className={styles['urgent-action-btn']}>Review Now</button>
              </div>

              {/* Medium Priority */}
              <div className={`${styles['urgent-item']} ${styles['priority-medium']}`}>
                <div className={styles['urgent-icon']}>🟠</div>
                <div className={styles['urgent-item-content']}>
                  <div className={styles['urgent-text']}>
                    <strong>Leads awaiting response</strong>
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>No contact made yet</div>
                  </div>
                  <span className={`${styles['urgent-count']} ${styles['priority-medium']}`}>3</span>
                </div>
                <button className={styles['urgent-action-btn']}>Contact</button>
              </div>

              {/* Low Priority */}
              <div className={`${styles['urgent-item']} ${styles['priority-low']}`}>
                <div className={styles['urgent-icon']}>🟡</div>
                <div className={styles['urgent-item-content']}>
                  <div className={styles['urgent-text']}>
                    <strong>Appointments to confirm</strong>
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>Next 24 hours</div>
                  </div>
                  <span className={`${styles['urgent-count']} ${styles['priority-low']}`}>1</span>
                </div>
                <button className={styles['urgent-action-btn']}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
