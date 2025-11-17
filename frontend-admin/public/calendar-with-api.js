// ============================================
// CALENDAR WITH REAL API DATA
// Standalone script that loads appointments from backend API
// ============================================

console.log('📅 Loading calendar-with-api.js...');

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(message, duration = 3000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  
  // Add CSS if not already present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1f2937;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .toast-notification.fade-out {
        animation: slideOut 0.3s ease-out forwards;
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Expose to window
window.showToast = showToast;

// ============================================
// API DATA LOADING
// ============================================

// Initialize empty - will be loaded from API
window.eventsByDate = {};
window.currentYear = 2025;
window.currentMonth = 11; // November (1-indexed for API)

/**
 * Load appointments from API for a specific month
 */
async function loadCalendarData(year, month) {
  try {
    console.log(`📡 Loading calendar data for ${year}-${month}...`);
    
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No auth token found');
      window.showToast('❌ Authentication required');
      return;
    }
    
    // Call API
    const response = await fetch(`/api/appointments/month/${year}/${month}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const appointments = await response.json();
    console.log(`✅ Loaded ${appointments.length} appointments from API`);
    
    // Transform API data to calendar format
    window.eventsByDate = {};
    appointments.forEach(apt => {
      const date = apt.appointmentDate; // YYYY-MM-DD
      
      if (!window.eventsByDate[date]) {
        window.eventsByDate[date] = [];
      }
      
      const lead = apt.lead || {};
      const vehicle = lead.vehicleYear && lead.vehicleMake && lead.vehicleModel
        ? `${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`
        : (lead.vehicle ? `${lead.vehicle.year || ''} ${lead.vehicle.make || ''} ${lead.vehicle.model || ''}`.trim() : 'Unknown Vehicle');
      
      window.eventsByDate[date].push({
        id: apt.id,
        type: 'appointment',
        time: apt.appointmentTimeSlot || '9:00-11:00',
        customer: lead.name || 'Unknown',
        phone: lead.phone || '',
        email: lead.email || '',
        vehicle: vehicle,
        vin: lead.vehicle?.vin || '',
        serviceType: lead.serviceType || '',
        serviceCategory: 'Service',
        paymentType: lead.hasInsurance ? 'Insurance' : 'Private',
        insuranceCompany: lead.insuranceProvider || 'N/A',
        claimNumber: '',
        estimateAmount: lead.estimatedValue ? `$${lead.estimatedValue}` : 'TBD',
        status: apt.status || 'Scheduled',
        reference: lead.referenceNumber || apt.id.substring(0, 8),
        eventId: apt.id,
        leadData: lead
      });
    });
    
    // Render calendar after loading
    renderCalendarWithData();
    calculateAndUpdateStats();
    
    console.log('📅 Calendar rendered with real data');
    window.showToast(`✅ Loaded ${appointments.length} appointments`);
    
  } catch (error) {
    console.error('❌ Error loading calendar data:', error);
    window.showToast('❌ Error loading calendar data');
    
    // Fallback to empty calendar
    window.eventsByDate = {};
    renderCalendarWithData();
    calculateAndUpdateStats();
  }
}

/**
 * Render/update calendar days with event badges
 */
function renderCalendarWithData() {
  // Update each day with event count
  const days = document.querySelectorAll('.calendar-day');
  
  days.forEach(day => {
    const dayNumEl = day.querySelector('.day-number');
    if (!dayNumEl) return;
    
    const dayNumber = parseInt(dayNumEl.textContent);
    if (isNaN(dayNumber)) return;
    
    const dateStr = `${window.currentYear}-${String(window.currentMonth).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const events = window.eventsByDate[dateStr] || [];
    
    // Remove existing badge
    let badge = day.querySelector('.event-badge');
    if (badge) {
      badge.remove();
    }
    
    // Add badge if events exist
    if (events.length > 0) {
      badge = document.createElement('span');
      badge.className = 'event-badge';
      badge.textContent = events.length.toString();
      day.appendChild(badge);
      
      // Add onclick handler
      day.setAttribute('onclick', `window.openDayModal('${dateStr}')`);
    } else {
      day.removeAttribute('onclick');
    }
  });
}

// ============================================
// STATS CALCULATION
// ============================================
function calculateAndUpdateStats() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  let total = 0;
  let todayCount = 0;
  let thisWeekCount = 0;
  let overdueCount = 0;
  let upcomingCount = 0;
  let totalRevenue = 0;
  
  Object.keys(window.eventsByDate).forEach(dateStr => {
    const events = window.window.eventsByDate[dateStr];
    total += events.length;
    
    const eventDate = new Date(dateStr);
    const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dateStr === todayStr) {
      todayCount = events.length;
    }
    
    if (daysDiff >= 0 && daysDiff <= 7) {
      thisWeekCount += events.length;
    }
    
    events.forEach(event => {
      if (event.status === 'Overdue') {
        overdueCount++;
      }
    });
    
    if (daysDiff >= 0) {
      upcomingCount += events.length;
    }
    
    events.forEach(event => {
      if (event.type === 'payment') {
        const amountStr = event.amount || '0';
        const amount = parseFloat(amountStr.replace(/[$,]/g, ''));
        if (!isNaN(amount)) {
          totalRevenue += amount;
        }
      }
    });
  });
  
  const revenueFormatted = totalRevenue >= 1000 
    ? `$${(totalRevenue / 1000).toFixed(1)}K`
    : `$${totalRevenue.toFixed(0)}`;
  
  const completedEvents = total - overdueCount;
  const completionPct = total > 0 ? Math.round((completedEvents / total) * 100) : 100;
  
  const statTotal = document.getElementById('statTotal');
  const statToday = document.getElementById('statToday');
  const statWeek = document.getElementById('statWeek');
  const statOverdue = document.getElementById('statOverdue');
  const statRevenue = document.getElementById('statRevenue');
  const statCompletion = document.getElementById('statCompletion');
  
  if (statTotal) statTotal.textContent = total.toString();
  if (statToday) statToday.textContent = todayCount.toString();
  if (statWeek) statWeek.textContent = thisWeekCount.toString();
  if (statOverdue) statOverdue.textContent = overdueCount.toString();
  if (statRevenue) statRevenue.textContent = revenueFormatted;
  if (statCompletion) statCompletion.textContent = `${completionPct}%`;
  
  const badgeOverdue = document.getElementById('badgeOverdue');
  const badgeUpcoming = document.getElementById('badgeUpcoming');
  
  if (badgeOverdue) badgeOverdue.textContent = overdueCount.toString();
  if (badgeUpcoming) badgeUpcoming.textContent = upcomingCount.toString();
  
  console.log('📊 Stats updated:', { 
    total, 
    todayCount, 
    thisWeekCount, 
    overdueCount, 
    upcomingCount,
    totalRevenue: revenueFormatted, 
    completionPct: `${completionPct}%`
  });
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openDayModal(date) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  const dayEvents = window.window.eventsByDate[date] || [];
  
  console.log('Opening modal for date:', date);
  console.log('Events found:', dayEvents);

  title.textContent = `Events for ${date}`;
  
  if (dayEvents.length === 0) {
    body.innerHTML = `
      <div class="modal-section">
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
          <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
          <div style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">No events scheduled</div>
          <div style="font-size: 11px;">Click on events in the side panels to view details, or create a new event.</div>
        </div>
      </div>
    `;
    modal.classList.add('active');
    return;
  }
  
  const eventsHtml = dayEvents.map((event, index) => {
    const clickHandler = `window.openRescheduledEventModal('${date}', ${index})`;
    
    if (event.type === 'appointment') {
      return `
        <div class="day-modal-event appointment" onclick="${clickHandler}" style="cursor: pointer;">
          <div class="dme-header">
            <div class="dme-icon appointment">🔧</div>
            <div class="dme-title">
              <strong>${event.customer}</strong>
              <small>${event.time} • ${event.phone}</small>
            </div>
          </div>
          <div class="dme-info">
            <div class="dme-row">
              <span>🚗 <strong>${event.vehicle}</strong></span>
              <span>• ${event.serviceType}</span>
            </div>
            <div class="dme-row">
              <span>${event.reference}</span>
              <span>•</span>
              <span>${event.paymentType === 'Insurance' ? `🛡️ ${event.insuranceCompany}` : '💳 Private'}</span>
              ${event.estimateAmount !== 'TBD' ? `<span>• <strong>${event.estimateAmount}</strong></span>` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="day-modal-event payment" onclick="${clickHandler}" style="cursor: pointer;">
          <div class="dme-header">
            <div class="dme-icon payment">💰</div>
            <div class="dme-title">
              <strong>${event.customer}</strong>
              <small>${event.amount} • ${event.phone}</small>
            </div>
          </div>
          <div class="dme-info">
            <div class="dme-row">
              <span>🚗 <strong>${event.vehicle}</strong></span>
              <span>• ${event.serviceType}</span>
            </div>
            <div class="dme-row">
              <span>${event.reference}</span>
              <span>•</span>
              <span>Installment ${event.installment}</span>
              <span>• <strong>${event.status}</strong></span>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');
  
  body.innerHTML = `
    <div class="modal-section">
      <div class="day-modal-events">
        ${eventsHtml}
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function openRescheduledEventModal(date, eventIndex) {
  const event = window.window.eventsByDate[date]?.[eventIndex];
  if (!event) return;
  
  openModal(event.eventId);
}

function openModal(eventId) {
  console.log('Opening modal for eventId:', eventId);
  window.showToast('📋 Event details: ' + eventId);
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function changeMonth(direction) {
  window.showToast(`📅 Month navigation: ${direction > 0 ? 'Next' : 'Previous'}`);
}

function openNewEventModal() {
  window.showToast('➕ New event functionality coming soon!');
}

// ============================================
// DRAG AND DROP
// ============================================
function makeEventsDraggable() {
  console.log('🎯 Setting up drag and drop...');
  
  const draggableEvents = document.querySelectorAll('.event-item');
  
  draggableEvents.forEach(event => {
    event.setAttribute('draggable', 'true');
    
    event.addEventListener('dragstart', (e) => {
      e.currentTarget.style.opacity = '0.5';
      
      const onclickAttr = e.currentTarget.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/window\.openModal\('([^']+)'\)/);
        if (match) {
          const eventId = match[1];
          e.dataTransfer.setData('eventId', eventId);
          
          let sourceDate = '';
          Object.keys(window.eventsByDate).forEach(date => {
            if (window.eventsByDate[date].some(ev => ev.eventId === eventId)) {
              sourceDate = date;
            }
          });
          
          e.dataTransfer.setData('sourceDate', sourceDate);
          console.log('🎯 Drag started:', eventId, sourceDate);
        }
      }
    });
    
    event.addEventListener('dragend', (e) => {
      e.currentTarget.style.opacity = '1';
    });
  });
  
  const calendarDays = document.querySelectorAll('.calendar-day');
  
  calendarDays.forEach(day => {
    day.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    });
    
    day.addEventListener('dragleave', (e) => {
      e.currentTarget.style.backgroundColor = '';
    });
    
    day.addEventListener('drop', (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = '';
      
      const eventId = e.dataTransfer.getData('eventId');
      const sourceDate = e.dataTransfer.getData('sourceDate');
      
      const dayNumEl = e.currentTarget.querySelector('.day-number');
      if (dayNumEl) {
        const dayNumber = dayNumEl.textContent;
        const targetDate = `2025-11-${dayNumber.padStart(2, '0')}`;
        
        console.log('📍 Dropped on:', targetDate);
        window.dragTargetDate = targetDate;
        
        openRescheduleModal(eventId, sourceDate);
      }
    });
  });
  
  console.log('✅ Drag and drop configured');
}

function openRescheduleModal(eventId, sourceDate) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  title.textContent = 'Reschedule Event';
  
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">Select New Time</div>
      <div class="time-selector">
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '09:00')">9:00 AM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '10:00')">10:00 AM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '11:00')">11:00 AM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '13:00')">1:00 PM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '14:00')">2:00 PM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '15:00')">3:00 PM</button>
        <button class="time-option" onclick="window.confirmReschedule('${eventId}', '${sourceDate}', '16:00')">4:00 PM</button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

async function confirmReschedule(eventId, sourceDate, newTime) {
  const targetDate = window.dragTargetDate;
  
  if (!targetDate) {
    window.showToast('❌ Error: No target date selected');
    return;
  }
  
  const sourceEvents = window.eventsByDate[sourceDate];
  if (!sourceEvents) return;
  
  const eventIndex = sourceEvents.findIndex(e => e.eventId === eventId);
  if (eventIndex === -1) return;
  
  const event = sourceEvents[eventIndex];
  const newTimeSlot = `${newTime}-${(parseInt(newTime.split(':')[0]) + 2).toString().padStart(2, '0')}:00`;
  
  // Show loading
  window.showToast('⏳ Saving changes...');
  
  try {
    // Get auth token
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    
    // Update via API
    const response = await fetch(`/api/appointments/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentDate: targetDate,
        appointmentTimeSlot: newTimeSlot
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Update local data after API success
    sourceEvents.splice(eventIndex, 1);
    event.time = newTimeSlot;
    event.date = targetDate;
    
    if (!window.eventsByDate[targetDate]) {
      window.eventsByDate[targetDate] = [];
    }
    window.eventsByDate[targetDate].push(event);
    
    updateCalendarDay(sourceDate);
    updateCalendarDay(targetDate);
    calculateAndUpdateStats();
    
    closeModal();
    window.showToast(`✅ Event rescheduled to ${targetDate} at ${newTime}`);
    
  } catch (error) {
    console.error('❌ Error rescheduling event:', error);
    window.showToast('❌ Error saving changes. Please try again.');
  }
  
  delete window.dragTargetDate;
}

function updateCalendarDay(dateStr) {
  const dayNumber = parseInt(dateStr.split('-')[2]);
  const days = document.querySelectorAll('.calendar-day');
  
  days.forEach(day => {
    const dayNumEl = day.querySelector('.day-number');
    if (dayNumEl && dayNumEl.textContent === dayNumber.toString()) {
      const events = window.eventsByDate[dateStr] || [];
      
      let badge = day.querySelector('.event-badge');
      if (events.length > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'event-badge';
          day.appendChild(badge);
        }
        badge.textContent = events.length.toString();
        
        day.setAttribute('onclick', `window.openDayModal('${dateStr}')`);
      } else {
        if (badge) {
          badge.remove();
        }
        day.removeAttribute('onclick');
      }
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
async function initializeMockupCalendar() {
  console.log('✅ Initializing calendar with real API data...');
  
  // Load data from API first
  await loadCalendarData(window.currentYear, window.currentMonth);
  
  // Expose functions to window
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.changeMonth = changeMonth;
  window.openDayModal = openDayModal;
  window.openRescheduledEventModal = openRescheduledEventModal;
  window.openNewEventModal = openNewEventModal;
  window.openRescheduleModal = openRescheduleModal;
  window.confirmReschedule = confirmReschedule;
  window.eventsByDate = eventsByDate;
  window.calculateAndUpdateStats = calculateAndUpdateStats;
  
  // Setup event listeners
  const filterType = document.getElementById('filterType');
  const filterStatus = document.getElementById('filterStatus');
  const filterDate = document.getElementById('filterDate');
  const searchInput = document.getElementById('searchInput');
  
  if (filterType) filterType.addEventListener('change', () => window.showToast('Filter applied'));
  if (filterStatus) filterStatus.addEventListener('change', () => window.showToast('Filter applied'));
  if (filterDate) filterDate.addEventListener('change', () => window.showToast('Filter applied'));
  if (searchInput) searchInput.addEventListener('input', () => console.log('Search...'));
  
  const viewButtons = document.querySelectorAll('.view-btn');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      viewButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      window.showToast(`Switched to ${this.textContent} view`);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Setup drag and drop
  makeEventsDraggable();
  
  window.showToast('✅ Calendar loaded successfully!', 2000);
  console.log('✅ Mockup calendar initialized!');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMockupCalendar);
} else {
  initializeMockupCalendar();
}
