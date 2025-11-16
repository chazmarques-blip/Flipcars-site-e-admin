'use client';

import React, { useEffect } from 'react';
import './mockup-exact.css';

/**
 * EXACT MOCKUP REPLICATION
 * This page copies the mockup HTML/CSS/JS EXACTLY with minimal React adaptations
 * All classes, structure, and logic preserved from /home/user/mockup/index.html
 */
export default function MockupExactPage() {
  useEffect(() => {
    // Initialize mockup JavaScript logic after mount
    initializeMockup();
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
          <button className="btn btn-sm">📊 Export</button>
          <button className="btn btn-sm">⚙️ Settings</button>
        </div>
      </div>

      {/* Main Layout - Will be populated by JavaScript */}
      <div className="main-layout" id="mainLayout">
        {/* Content will be rendered by initializeMockup() */}
      </div>

      {/* Modal - Will be shown by JavaScript */}
      <div className="modal-overlay" id="modal">
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title" id="modalTitle">Event Details</div>
            <button className="modal-close" onClick={() => closeModal()}>&times;</button>
          </div>
          <div className="modal-body" id="modalBody">
            {/* Dynamic content */}
          </div>
          <div className="modal-footer">
            <button className="btn">Cancel</button>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Initialize mockup logic - will be extracted from mockup JS
function initializeMockup() {
  console.log('Initializing mockup...');
  
  // TODO: Copy all JavaScript from mockup (lines 1565-3400)
  // This includes:
  // - Event data structure
  // - Calendar rendering
  // - Modal opening/closing
  // - Filter logic
  // - etc.
  
  // For now, render placeholder
  const mainLayout = document.getElementById('mainLayout');
  if (mainLayout) {
    mainLayout.innerHTML = `
      <div style="padding: 20px; text-align: center; grid-column: 1 / -1;">
        <h3>Mockup JavaScript Loading...</h3>
        <p>Next step: Copy all JS logic from mockup lines 1565-3400</p>
      </div>
    `;
  }
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
  }
}
