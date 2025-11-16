'use client';

import React, { useEffect } from 'react';
import './mockup-exact.css';
import { mockEventData, type EventData } from './mockup-data';
import { showToast } from './mockup-utils';

/**
 * EXACT MOCKUP REPLICATION
 * This page copies the mockup HTML/CSS/JS EXACTLY with minimal React adaptations
 * All classes, structure, and logic preserved from /home/user/mockup/index.html
 */
export default function MockupExactPage() {
  useEffect(() => {
    // Initialize mockup JavaScript logic after mount
    initializeMockup();
    
    // Cleanup on unmount
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Appointments & Payments Calendar</h1>
        <p>Manage customer appointments, payment schedules, and follow-ups</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value">11</div>
          <div className="stat-subtitle">This month</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div className="stat-value">3</div>
          <div className="stat-subtitle">Bob, Maria, Robert</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-value">8</div>
          <div className="stat-subtitle">Next 7 days</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Overdue</div>
          <div className="stat-value">2</div>
          <div className="stat-subtitle">John & Maria</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value">$6.7K</div>
          <div className="stat-subtitle">Expected</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion</div>
          <div className="stat-value">100%</div>
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
            {/* Dynamic content */}
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={() => closeModal()}>Cancel</button>
            <button className="btn btn-primary">Save Changes</button>
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
        <span class="badge red">2</span>
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
        <span class="badge gold">8</span>
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


// ============================================
// MODAL FUNCTIONS (From mockup lines 1565-1132)
// ============================================

function openModal(eventId: string) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  const data = mockEventData[eventId];
  if (!data) {
    console.error('Event not found:', eventId);
    return;
  }

  const fullName = `${data.firstName} ${data.lastName}`;
  const vehicleDisplay = `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}`;
  
  title.textContent = `${data.type} - ${fullName}`;
  
  if (data.type === 'Payment Overdue' || data.type === 'Payment' || data.type === 'Payment Due') {
    // Payment modal content
    body.innerHTML = `
      <!-- Lead Information -->
      <div class="modal-section">
        <div class="modal-section-title">📋 LEAD INFO (From Form)</div>
        <div class="modal-info-grid-4">
          <div class="modal-info-item">
            <div class="modal-info-label">Ref Number</div>
            <div class="modal-info-value" style="color: var(--primary); font-weight: 600;">${data.leadReference}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Created</div>
            <div class="modal-info-value">${data.leadCreatedAt}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Source</div>
            <div class="modal-info-value">${data.leadSource}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Status</div>
            <div class="modal-info-value" style="color: #4caf50; font-weight: 600;">${data.status}</div>
          </div>
        </div>
      </div>

      <!-- Payment Schedule -->
      ${data.paymentSchedule ? `
      <div class="modal-section" style="background: #fffbf0; padding: 5px 8px; border-radius: 4px; border: 1px solid var(--primary);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
          <div class="modal-section-title" style="color: #8B7000; margin-bottom: 0;">💰 PAYMENT SCHEDULE</div>
          <span style="font-size: 7px; color: #8B7000; font-weight: 600;">⚠️ Added by admin</span>
        </div>
        <div style="padding: 5px 6px; background: white; border-radius: 3px;">
          <div class="modal-info-grid-4">
            <div class="modal-info-item">
              <div class="modal-info-label">Amount Due</div>
              <div class="modal-info-value" style="font-size: 13px; font-weight: 700; color: var(--primary);">${data.paymentSchedule.installmentAmount}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Installment</div>
              <div class="modal-info-value">${data.paymentSchedule.currentInstallment}/${data.paymentSchedule.numberOfInstallments}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Total Amount</div>
              <div class="modal-info-value">${data.paymentSchedule.totalAmount}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Remaining Balance</div>
              <div class="modal-info-value">${data.paymentSchedule.remainingAmount}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Due Date</div>
              <div class="modal-info-value">${data.dueDate}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Payment Status</div>
              <div class="modal-info-value" style="color: ${data.paymentStatus === 'Overdue' ? '#d32f2f' : 'var(--primary)'}; font-weight: 600;">
                ${data.paymentStatus} ${data.overdueDays ? `(${data.overdueDays})` : ''}
              </div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Payment Method</div>
              <div class="modal-info-value">${data.paymentMethod || 'N/A'}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label">Paid Amount</div>
              <div class="modal-info-value">${data.paymentSchedule.paidAmount}</div>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Customer Info -->
      <div class="modal-section">
        <div class="modal-section-title">👤 CUSTOMER INFO (Step 1)</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">First Name</div>
            <div class="modal-info-value" style="font-weight: 600;">${data.firstName}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Last Name</div>
            <div class="modal-info-value" style="font-weight: 600;">${data.lastName}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Phone</div>
            <div class="modal-info-value">
              <a href="tel:${data.phone}" style="color: var(--primary); text-decoration: none;">${data.phone}</a>
            </div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Email</div>
            <div class="modal-info-value">
              <a href="mailto:${data.email}" style="color: var(--primary); text-decoration: none;">${data.email}</a>
            </div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Service Type</div>
            <div class="modal-info-value">${data.serviceType}</div>
          </div>
        </div>
      </div>

      <!-- Vehicle Info -->
      <div class="modal-section">
        <div class="modal-section-title">🚗 VEHICLE INFO (Step 3 - VIN Scan)</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">VIN</div>
            <div class="modal-info-value" style="font-family: monospace; font-weight: 600;">${data.vin}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Vehicle</div>
            <div class="modal-info-value" style="font-weight: 600;">${vehicleDisplay}</div>
          </div>
        </div>
      </div>

      <!-- Contact Preferences -->
      <div class="modal-section">
        <div class="modal-section-title">📞 CONTACT PREFERENCES (Step 4)</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">Phone Call</div>
            <div class="modal-info-value">${data.contactPreferences.phoneCall ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">WhatsApp</div>
            <div class="modal-info-value">${data.contactPreferences.whatsapp ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Text Message</div>
            <div class="modal-info-value">${data.contactPreferences.textMessage ? '✅ Yes' : '❌ No'}</div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${data.additionalNotes ? `
      <div class="modal-section">
        <div class="modal-section-title">📝 ADDITIONAL NOTES</div>
        <div style="padding: 8px 10px; background: #f9f9f9; border-radius: 4px;">
          <p style="font-size: 11px; margin: 0; line-height: 1.5;">${data.additionalNotes}</p>
        </div>
      </div>
      ` : ''}

      <!-- Admin Notes -->
      ${data.adminNotes ? `
      <div class="modal-section">
        <div class="modal-section-title">🔒 ADMIN NOTES</div>
        <div style="padding: 8px 10px; background: #fff3cd; border-radius: 4px; border-left: 3px solid #ffc107;">
          <p style="font-size: 11px; margin: 0; line-height: 1.5;">${data.adminNotes}</p>
        </div>
      </div>
      ` : ''}
    `;
  } else {
    // Appointment modal content
    body.innerHTML = `
      <!-- Lead Information -->
      <div class="modal-section">
        <div class="modal-section-title">📋 LEAD INFO</div>
        <div class="modal-info-grid-4">
          <div class="modal-info-item">
            <div class="modal-info-label">Ref Number</div>
            <div class="modal-info-value" style="color: var(--primary); font-weight: 600;">${data.leadReference}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Created</div>
            <div class="modal-info-value">${data.leadCreatedAt}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Source</div>
            <div class="modal-info-value">${data.leadSource}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Status</div>
            <div class="modal-info-value" style="color: ${data.status === 'confirmed' ? '#4caf50' : '#ff9800'}; font-weight: 600;">${data.status}</div>
          </div>
        </div>
      </div>

      <!-- Appointment Details -->
      <div class="modal-section">
        <div class="modal-section-title">📅 APPOINTMENT DETAILS</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">Date</div>
            <div class="modal-info-value" style="font-weight: 600;">${data.preferredDate}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Time Slot</div>
            <div class="modal-info-value" style="font-weight: 600;">${data.preferredTimeSlot}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Status</div>
            <div class="modal-info-value" style="color: ${data.appointmentStatus === 'Confirmed' ? '#4caf50' : '#ff9800'}; font-weight: 600;">${data.appointmentStatus || 'Pending'}</div>
          </div>
        </div>
        ${data.confirmedAt ? `
        <div style="margin-top: 8px; padding: 8px 10px; background: #e8f5e9; border-radius: 4px;">
          <div style="font-size: 10px; color: #2e7d32;">
            <strong>✅ Confirmed:</strong> ${data.confirmedAt}${data.confirmedBy ? ` by ${data.confirmedBy}` : ''}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Customer Info -->
      <div class="modal-section">
        <div class="modal-section-title">👤 CUSTOMER INFO</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">Name</div>
            <div class="modal-info-value" style="font-weight: 600;">${fullName}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Phone</div>
            <div class="modal-info-value">
              <a href="tel:${data.phone}" style="color: var(--primary); text-decoration: none;">${data.phone}</a>
            </div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Email</div>
            <div class="modal-info-value">
              <a href="mailto:${data.email}" style="color: var(--primary); text-decoration: none;">${data.email}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Info -->
      <div class="modal-section">
        <div class="modal-section-title">🚗 VEHICLE INFO</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">VIN</div>
            <div class="modal-info-value" style="font-family: monospace; font-weight: 600;">${data.vin}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Vehicle</div>
            <div class="modal-info-value" style="font-weight: 600;">${vehicleDisplay}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Service Type</div>
            <div class="modal-info-value">${data.serviceType}</div>
          </div>
        </div>
      </div>

      <!-- Service Details -->
      <div class="modal-section">
        <div class="modal-section-title">🔧 SERVICE DETAILS</div>
        <div class="modal-info-grid-3">
          ${data.insuranceCompany ? `
          <div class="modal-info-item">
            <div class="modal-info-label">Insurance Company</div>
            <div class="modal-info-value">${data.insuranceCompany}</div>
          </div>
          ${data.claimNumber ? `
          <div class="modal-info-item">
            <div class="modal-info-label">Claim Number</div>
            <div class="modal-info-value">${data.claimNumber}</div>
          </div>
          ` : ''}
          ` : ''}
          ${data.warrantyCompany ? `
          <div class="modal-info-item">
            <div class="modal-info-label">Warranty Company</div>
            <div class="modal-info-value">${data.warrantyCompany}</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Contact Preferences -->
      <div class="modal-section">
        <div class="modal-section-title">📞 CONTACT PREFERENCES</div>
        <div class="modal-info-grid-3">
          <div class="modal-info-item">
            <div class="modal-info-label">Phone Call</div>
            <div class="modal-info-value">${data.contactPreferences.phoneCall ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">WhatsApp</div>
            <div class="modal-info-value">${data.contactPreferences.whatsapp ? '✅ Yes' : '❌ No'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">Text Message</div>
            <div class="modal-info-value">${data.contactPreferences.textMessage ? '✅ Yes' : '❌ No'}</div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${data.additionalNotes ? `
      <div class="modal-section">
        <div class="modal-section-title">📝 ADDITIONAL NOTES</div>
        <div style="padding: 8px 10px; background: #f9f9f9; border-radius: 4px;">
          <p style="font-size: 11px; margin: 0; line-height: 1.5;">${data.additionalNotes}</p>
        </div>
      </div>
      ` : ''}

      <!-- Admin Notes -->
      ${data.adminNotes ? `
      <div class="modal-section">
        <div class="modal-section-title">🔒 ADMIN NOTES</div>
        <div style="padding: 8px 10px; background: #fff3cd; border-radius: 4px; border-left: 3px solid #ffc107;">
          <p style="font-size: 11px; margin: 0; line-height: 1.5;">${data.adminNotes}</p>
        </div>
      </div>
      ` : ''}
    `;
  }
  
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ============================================
// OTHER MOCKUP FUNCTIONS
// ============================================

let currentMonth = 10; // November (0-indexed)
let currentYear = 2025;

function changeMonth(direction: number) {
  currentMonth += direction;
  
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthTitle = document.getElementById('monthTitle');
  if (monthTitle) {
    monthTitle.textContent = `${months[currentMonth]} ${currentYear}`;
  }
  
  showToast(`Viewing ${months[currentMonth]} ${currentYear}`);
  console.log(`Month changed to: ${months[currentMonth]} ${currentYear}`);
}

function openDayModal(date: string) {
  showToast(`📅 Day view: ${date}`, 2000);
  console.log('Open day modal for:', date);
  // In production: show all events for this day
}

function openNewEventModal() {
  showToast('➕ Create new event (redirects to estimate form)', 3000);
  console.log('In production: window.location.href = "/estimate-form"');
}

// ============================================
// INITIALIZATION
// ============================================

function initializeMockup() {
  console.log('✅ Mockup initialized!');
  
  // Expose functions to window for onclick handlers
  if (typeof window !== 'undefined') {
    (window as any).openModal = openModal;
    (window as any).closeModal = closeModal;
    (window as any).changeMonth = changeMonth;
    (window as any).openDayModal = openDayModal;
    (window as any).openNewEventModal = openNewEventModal;
    (window as any).showToast = showToast;
  }
  
  // Setup filter handlers
  const filterType = document.getElementById('filterType');
  const filterStatus = document.getElementById('filterStatus');
  const filterDate = document.getElementById('filterDate');
  const searchInput = document.getElementById('searchInput');
  
  if (filterType) filterType.addEventListener('change', () => showToast('Filter applied'));
  if (filterStatus) filterStatus.addEventListener('change', () => showToast('Filter applied'));
  if (filterDate) filterDate.addEventListener('change', () => showToast('Filter applied'));
  if (searchInput) searchInput.addEventListener('input', () => console.log('Search...'));
  
  // Setup view buttons
  const viewButtons = document.querySelectorAll('.view-btn');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function(this: HTMLElement) {
      viewButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      showToast(`Switched to ${this.textContent} view`);
    });
  });
  
  // Setup ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  showToast('✅ Calendar loaded successfully!', 2000);
}
