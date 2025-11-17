'use client';

import React, { useEffect } from 'react';
import '../../mockup-exact/mockup-exact.css';
import { mockEventData, type EventData } from '../../mockup-exact/mockup-data';
import { showToast } from '../../mockup-exact/mockup-utils';

/**
 * APPOINTMENTS V2 - CALENDAR WITH REAL API DATA
 * This page uses the mockup design but loads real appointments from the backend API
 * Based on /mockup-exact but with calendar-with-api.js instead of mockup-calendar.js
 */
export default function AppointmentsV2Page() {
  useEffect(() => {
    // Load external script from public/ with REAL API integration
    const script = document.createElement('script');
    script.src = '/calendar-with-api.js'; // ← LOAD API VERSION
    script.async = true;
    script.onload = () => {
      console.log('✅ calendar-with-api.js loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load calendar-with-api.js');
    };
    document.body.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Appointments & Payments Calendar</h1>
        <p>Manage customer appointments, payment schedules, and follow-ups</p>
      </div>

      {/* Stats Cards - Will be updated by JavaScript */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value" id="statTotal">0</div>
          <div className="stat-subtitle">This month</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div className="stat-value" id="statToday">0</div>
          <div className="stat-subtitle">Nov 15, 2025</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-value" id="statWeek">0</div>
          <div className="stat-subtitle">Next 7 days</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Overdue</div>
          <div className="stat-value" id="statOverdue">0</div>
          <div className="stat-subtitle">Needs attention</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value" id="statRevenue">$0</div>
          <div className="stat-subtitle">Expected</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion</div>
          <div className="stat-value" id="statCompletion">0%</div>
          <div className="stat-subtitle">On schedule</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <span className="filter-label">Type:</span>
          <select className="filter-select" id="filterType">
            <option value="all">All Events</option>
            <option value="appointment">Appointments</option>
            <option value="payment">Payments</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <select className="filter-select" id="filterStatus">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Date:</span>
          <select className="filter-select" id="filterDate">
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <input 
          type="text" 
          className="search-input" 
          id="searchInput" 
          placeholder="Search customers, VIN..." 
        />
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-items">
          <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)' }}>Legend:</span>
          <div className="legend-item">
            <div className="legend-dot appointment"></div>
            <span>Appointment</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot payment"></div>
            <span>Payment Due</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot payment-overdue"></div>
            <span>Overdue</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot reminder"></div>
            <span>Reminder</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot completed"></div>
            <span>Completed</span>
          </div>
        </div>

        <div className="quick-actions">
          <button className="btn btn-sm" onClick={handleExport}>📊 Export</button>
          <button className="btn btn-sm" onClick={handleSettings}>⚙️ Settings</button>
        </div>
      </div>

      {/* Main Layout - Rendered by JSX (EXACT mockup structure) */}
      <div className="main-layout" id="mainLayout" dangerouslySetInnerHTML={{ __html: getMainLayoutHTML() }} />

      {/* Modal */}
      <div className="modal-overlay" id="modal" onClick={(e) => closeModalOnOverlay(e)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title" id="modalTitle">Event Details</div>
            <button className="modal-close" onClick={() => closeModal()}>&times;</button>
          </div>
          <div className="modal-body" id="modalBody">
            {/* Dynamic content populated by JavaScript */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper handlers
function handleExport() {
  showToast('📊 Export functionality coming soon!');
  console.log('Export calendar data to PDF/Excel');
}

function handleSettings() {
  showToast('⚙️ Settings panel coming soon!');
  console.log('Open settings modal');
}

function closeModalOnOverlay(event: React.MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

// Get main layout HTML (EXACT mockup structure)
function getMainLayoutHTML(): string {
  return `
    <!-- Left Panel: Overdue -->
    <div class="side-panel">
      <div class="side-panel-header">
        <div class="side-panel-title">
          ⚠️ Overdue
        </div>
        <span class="badge red" id="badgeOverdue">2</span>
      </div>
      <div class="side-panel-body">
        <div class="event-list">
          <!-- Payment Overdue -->
          <div class="event-item payment-overdue" onclick="window.openModal('payment1')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon payment-overdue">💰</div>
                <div class="event-main-info">
                  <div class="event-name">John Doe</div>
                  <div class="event-time-phone"><strong>$183.54</strong> • 📞 (689) 221-3162</div>
                </div>
                <span class="event-badge red">7d</span>
              </div>
              <div class="event-details">2021 Mitsubishi Outlander • Install 2/6</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('💬 Reminder sent!')">💬 Remind</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('payment1')">👁️ View</button>
            </div>
          </div>

          <!-- Payment Overdue -->
          <div class="event-item payment-overdue" onclick="window.openModal('payment2')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon payment-overdue">💰</div>
                <div class="event-main-info">
                  <div class="event-name">Maria Silva</div>
                  <div class="event-time-phone"><strong>$146.30</strong> • 📞 (654) 945-0938</div>
                </div>
                <span class="event-badge red">3d</span>
              </div>
              <div class="event-details">2020 Ford EcoSport • Install 1/2</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('💬 Reminder sent!')">💬 Remind</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('payment2')">👁️ View</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center: Calendar -->
    <div class="calendar-card">
      <div class="calendar-header">
        <div class="calendar-title">📅 Calendar</div>
        <div class="calendar-nav">
          <div class="view-buttons">
            <button class="view-btn active">Month</button>
            <button class="view-btn">Week</button>
            <button class="view-btn">Day</button>
            <button class="view-btn">Agenda</button>
          </div>
          <button class="btn btn-primary" onclick="window.openNewEventModal()">+ New</button>
        </div>
      </div>

      <div class="calendar-body">
        <div class="calendar-month-nav">
          <button class="btn btn-icon" onclick="window.changeMonth(-1)">◀</button>
          <div class="month-title" id="monthTitle">November 2025</div>
          <button class="btn btn-icon" onclick="window.changeMonth(1)">▶</button>
        </div>

        <div class="calendar-grid">
          <!-- Day Headers -->
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>

          <!-- Previous month days -->
          <div class="calendar-day other-month"><div class="day-number">26</div></div>
          <div class="calendar-day other-month"><div class="day-number">27</div></div>
          <div class="calendar-day other-month"><div class="day-number">28</div></div>
          <div class="calendar-day other-month"><div class="day-number">29</div></div>
          <div class="calendar-day other-month"><div class="day-number">30</div></div>

          <!-- November 2025 days -->
          <div class="calendar-day"><div class="day-number">1</div></div>
          <div class="calendar-day"><div class="day-number">2</div></div>
          <div class="calendar-day"><div class="day-number">3</div></div>
          <div class="calendar-day"><div class="day-number">4</div></div>
          <div class="calendar-day"><div class="day-number">5</div></div>
          <div class="calendar-day"><div class="day-number">6</div></div>
          <div class="calendar-day"><div class="day-number">7</div></div>

          <div class="calendar-day" onclick="window.openDayModal('2025-11-08')">
            <div class="day-number">8</div>
            <div class="day-events">
              <div class="event-indicator payment-overdue"></div>
            </div>
            <span class="event-badge">1</span>
          </div>

          <div class="calendar-day"><div class="day-number">9</div></div>
          <div class="calendar-day"><div class="day-number">10</div></div>
          <div class="calendar-day"><div class="day-number">11</div></div>

          <div class="calendar-day" onclick="window.openDayModal('2025-11-12')">
            <div class="day-number">12</div>
            <div class="day-events">
              <div class="event-indicator payment-overdue"></div>
            </div>
            <span class="event-badge">1</span>
          </div>

          <div class="calendar-day"><div class="day-number">13</div></div>

          <div class="calendar-day" onclick="window.openDayModal('2025-11-14')">
            <div class="day-number">14</div>
            <div class="day-events">
              <div class="event-indicator appointment"></div>
            </div>
            <span class="event-badge">1</span>
          </div>

          <div class="calendar-day today" onclick="window.openDayModal('2025-11-15')">
            <div class="day-number">15</div>
            <div class="day-events">
              <div class="event-indicator appointment"></div>
              <div class="event-indicator appointment"></div>
              <div class="event-indicator payment"></div>
            </div>
            <span class="event-badge">3</span>
          </div>

          <div class="calendar-day"><div class="day-number">16</div></div>

          <div class="calendar-day" onclick="window.openDayModal('2025-11-17')">
            <div class="day-number">17</div>
            <div class="day-events">
              <div class="event-indicator payment"></div>
            </div>
            <span class="event-badge">1</span>
          </div>

          <div class="calendar-day"><div class="day-number">18</div></div>
          <div class="calendar-day"><div class="day-number">19</div></div>
          <div class="calendar-day"><div class="day-number">20</div></div>
          <div class="calendar-day"><div class="day-number">21</div></div>
          <div class="calendar-day"><div class="day-number">22</div></div>
          <div class="calendar-day"><div class="day-number">23</div></div>
          <div class="calendar-day"><div class="day-number">24</div></div>
          <div class="calendar-day"><div class="day-number">25</div></div>
          <div class="calendar-day"><div class="day-number">26</div></div>
          <div class="calendar-day"><div class="day-number">27</div></div>
          <div class="calendar-day"><div class="day-number">28</div></div>
          <div class="calendar-day"><div class="day-number">29</div></div>
          <div class="calendar-day"><div class="day-number">30</div></div>

          <!-- Next month days -->
          <div class="calendar-day other-month"><div class="day-number">1</div></div>
          <div class="calendar-day other-month"><div class="day-number">2</div></div>
          <div class="calendar-day other-month"><div class="day-number">3</div></div>
          <div class="calendar-day other-month"><div class="day-number">4</div></div>
          <div class="calendar-day other-month"><div class="day-number">5</div></div>
          <div class="calendar-day other-month"><div class="day-number">6</div></div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Upcoming -->
    <div class="side-panel">
      <div class="side-panel-header">
        <div class="side-panel-title">
          📅 Upcoming
        </div>
        <span class="badge gold" id="badgeUpcoming">8</span>
      </div>
      <div class="side-panel-body">
        <div class="event-list">
          <!-- Appointment Today - Bob Johnson -->
          <div class="event-item appointment" onclick="window.openModal('appt1')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon appointment">🔧</div>
                <div class="event-main-info">
                  <div class="event-name">Bob Johnson</div>
                  <div class="event-time-phone"><strong>9:00-11:00</strong> • 📞 (555) 123-4567</div>
                </div>
                <span class="event-badge gold">Today</span>
              </div>
              <div class="event-details">2019 Honda Civic • Body Repair</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('✅ Confirmed!')">✅ Confirm</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.showToast('📞 Calling...')">📞 Call</button>
            </div>
          </div>

          <!-- Payment Today - Maria Garcia -->
          <div class="event-item payment" onclick="window.openModal('payment_nov15_maria')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon payment">💰</div>
                <div class="event-main-info">
                  <div class="event-name">Maria Garcia</div>
                  <div class="event-time-phone"><strong>$150.00</strong> • 📞 (321) 456-7890</div>
                </div>
                <span class="event-badge gold">Today</span>
              </div>
              <div class="event-details">2019 Honda Accord • Install 3/5</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('💰 Payment collected!')">💰 Collect</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('payment_nov15_maria')">👁️ View</button>
            </div>
          </div>

          <!-- Appointment Today - Robert Williams -->
          <div class="event-item appointment" onclick="window.openModal('appt_nov15_robert')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon appointment">🔧</div>
                <div class="event-main-info">
                  <div class="event-name">Robert Williams</div>
                  <div class="event-time-phone"><strong>14:00-16:00</strong> • 📞 (407) 789-0123</div>
                </div>
                <span class="event-badge gold">Today</span>
              </div>
              <div class="event-details">2021 Ford F-150 • Oil Change</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('✅ Checked in!')">✅ Check-in</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('appt_nov15_robert')">👁️ Details</button>
            </div>
          </div>

          <!-- More upcoming events would go here... -->
          <div class="event-item payment" onclick="window.openModal('payment3')">
            <div class="event-item-content">
              <div class="event-item-header">
                <div class="event-icon payment">💰</div>
                <div class="event-main-info">
                  <div class="event-name">Sarah Martinez</div>
                  <div class="event-time-phone"><strong>$209.63</strong> • 📞 (689) 345-3214</div>
                </div>
                <span class="event-badge gold">Nov 17</span>
              </div>
              <div class="event-details">2020 RAM 2500 • Install 1/7</div>
            </div>
            <div class="event-actions">
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('💬 Reminder sent!')">💬 Remind</button>
              <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('payment3')">👁️ View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
