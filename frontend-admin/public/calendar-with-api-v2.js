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
    console.log(`📡 Loading calendar data for ${year}-${String(month).padStart(2, '0')}...`);
    
    // Get auth token from localStorage (try multiple possible key names)
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('auth_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No auth token found in localStorage');
      console.log('📋 Checked keys: accessToken, auth_token, token');
      console.log('📋 Available localStorage keys:', Object.keys(localStorage));
      console.log('📋 localStorage contents:', { ...localStorage });
      window.showToast('❌ Authentication required - Please log in');
      
      // Redirect to login if not authenticated
      if (window.location.pathname !== '/auth/login') {
        console.log('🔄 Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
      return;
    }
    
    console.log('✅ Found auth token:', token.substring(0, 20) + '...');
    
    // Call API
    const apiUrl = `/api/appointments/month/${year}/${month}`;
    console.log('📡 Calling API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 API Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const appointments = await response.json();
    console.log(`✅ Loaded ${appointments.length} appointments from API`);
    console.log('📋 Appointments data:', appointments);
    
    // Transform API data to calendar format
    console.log('🔄 Transforming appointments to calendar format...');
    window.eventsByDate = {};
    
    if (!appointments || appointments.length === 0) {
      console.warn('⚠️ No appointments returned from API');
      window.showToast('ℹ️ No appointments found for this month');
    } else {
      appointments.forEach((apt, index) => {
        const date = apt.appointmentDate; // YYYY-MM-DD
        console.log(`  Processing appointment ${index + 1}:`, {
          id: apt.id,
          date: date,
          status: apt.status,
          timeSlot: apt.appointmentTimeSlot
        });
        
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
      
      console.log('✅ Transformed data - eventsByDate:', window.eventsByDate);
      console.log('📊 Events by date summary:');
      Object.keys(window.eventsByDate).forEach(date => {
        console.log(`  ${date}: ${window.eventsByDate[date].length} events`);
      });
    }
    
    // Render calendar after loading
    renderCalendarWithData();
    calculateAndUpdateStats();
    populateSidePanels();
    
    console.log('📅 Calendar rendered with real data');
    window.showToast(`✅ Loaded ${appointments.length} appointments`);
    
  } catch (error) {
    console.error('❌ Error loading calendar data:', error);
    window.showToast('❌ Error loading calendar data');
    
    // Fallback to empty calendar
    window.eventsByDate = {};
    renderCalendarWithData();
    calculateAndUpdateStats();
    populateSidePanels();
  }
}

/**
 * Render/update calendar days with event badges
 */
function renderCalendarWithData() {
  // Update each day with event count and indicators
  const days = document.querySelectorAll('.calendar-day');
  
  days.forEach(day => {
    const dayNumEl = day.querySelector('.day-number');
    if (!dayNumEl) return;
    
    const dayNumber = parseInt(dayNumEl.textContent);
    if (isNaN(dayNumber)) return;
    
    const dateStr = `${window.currentYear}-${String(window.currentMonth).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const events = window.eventsByDate[dateStr] || [];
    
    // Remove existing indicators container and badge
    let eventsContainer = day.querySelector('.day-events');
    if (eventsContainer) {
      eventsContainer.remove();
    }
    
    let badge = day.querySelector('.event-badge');
    if (badge) {
      badge.remove();
    }
    
    // Add indicators and badge if events exist
    if (events.length > 0) {
      // Create events container
      eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events';
      
      // Add up to 3 event indicators
      events.slice(0, 3).forEach(event => {
        const indicator = document.createElement('div');
        indicator.className = 'event-indicator';
        
        // Determine indicator class based on event type/status
        if (event.status === 'Overdue' || event.type === 'payment-overdue') {
          indicator.classList.add('payment-overdue');
        } else if (event.type === 'appointment') {
          indicator.classList.add('appointment');
        } else if (event.type === 'payment') {
          indicator.classList.add('payment');
        } else if (event.status === 'Completed') {
          indicator.classList.add('completed');
        }
        
        eventsContainer.appendChild(indicator);
      });
      
      day.appendChild(eventsContainer);
      
      // Add badge with count
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
  
  console.log('✅ Calendar days rendered with event indicators');
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
// POPULATE SIDE PANELS
// ============================================
function populateSidePanels() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const overdueList = document.getElementById('overdueEventsList');
  const upcomingList = document.getElementById('upcomingEventsList');
  
  if (!overdueList || !upcomingList) {
    console.warn('Side panel lists not found');
    return;
  }
  
  const overdueEvents = [];
  const upcomingEvents = [];
  
  // Categorize events
  Object.keys(window.eventsByDate).forEach(dateStr => {
    const events = window.eventsByDate[dateStr];
    const eventDate = new Date(dateStr);
    const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    events.forEach(event => {
      if (event.status === 'Overdue' || daysDiff < 0) {
        overdueEvents.push({ ...event, date: dateStr, daysDiff });
      } else if (daysDiff >= 0) {
        upcomingEvents.push({ ...event, date: dateStr, daysDiff });
      }
    });
  });
  
  // Sort
  overdueEvents.sort((a, b) => a.daysDiff - b.daysDiff);
  upcomingEvents.sort((a, b) => a.daysDiff - b.daysDiff);
  
  // Render overdue
  overdueList.innerHTML = overdueEvents.length === 0 
    ? '<div style="padding: 20px; text-align: center; color: #999; font-size: 11px;">No overdue events</div>'
    : overdueEvents.map(event => renderEventItem(event, 'overdue')).join('');
  
  // Render upcoming (limit to 10)
  upcomingList.innerHTML = upcomingEvents.length === 0
    ? '<div style="padding: 20px; text-align: center; color: #999; font-size: 11px;">No upcoming events</div>'
    : upcomingEvents.slice(0, 10).map(event => renderEventItem(event, 'upcoming')).join('');
  
  // Re-setup drag and drop after rendering
  makeEventsDraggable();
  
  console.log('✅ Side panels populated:', { 
    overdue: overdueEvents.length, 
    upcoming: upcomingEvents.length 
  });
}

function renderEventItem(event, panel) {
  const eventId = event.eventId || event.id;
  const eventClass = event.type === 'appointment' ? 'appointment' : 
                     event.status === 'Overdue' || panel === 'overdue' ? 'payment-overdue' : 'payment';
  
  const icon = event.type === 'appointment' ? '🔧' : '💰';
  const timeDisplay = event.type === 'appointment' 
    ? event.time 
    : `$${event.amount || event.estimateAmount || '0.00'}`;
  
  // Calculate badge
  const eventDate = new Date(event.date);
  const today = new Date();
  const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let badgeText = '';
  let badgeClass = 'gold';
  if (daysDiff < 0) {
    badgeText = `${Math.abs(daysDiff)}d`;
    badgeClass = 'red';
  } else if (daysDiff === 0) {
    badgeText = 'Today';
    badgeClass = 'gold';
  } else if (daysDiff <= 7) {
    const dateObj = new Date(event.date);
    badgeText = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    badgeClass = 'gold';
  } else {
    const dateObj = new Date(event.date);
    badgeText = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    badgeClass = 'blue';
  }
  
  return `
    <div class="event-item ${eventClass}" 
         data-event-id="${eventId}" 
         data-event-date="${event.date}"
         onclick="window.openModal('${eventId}')" 
         draggable="true">
      <div class="event-item-content">
        <div class="event-item-header">
          <div class="event-icon ${eventClass}">${icon}</div>
          <div class="event-main-info">
            <div class="event-name">${event.customer || 'Unknown'}</div>
            <div class="event-time-phone"><strong>${timeDisplay}</strong> • 📞 ${event.phone || 'N/A'}</div>
          </div>
          <span class="event-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="event-details">${event.vehicle || 'Unknown Vehicle'} • ${event.serviceType || 'N/A'}</div>
      </div>
      <div class="event-actions">
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.showToast('💬 Reminder sent!')">💬 Remind</button>
        <button class="btn btn-sm" onclick="event.stopPropagation(); window.openModal('${eventId}')">👁️ View</button>
      </div>
    </div>
  `;
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openDayModal(date) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  const dayEvents = window.eventsByDate[date] || [];
  
  console.log('Opening modal for date:', date);
  console.log('Events found:', dayEvents);

  // Format date nicely
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  title.textContent = `Events for ${formattedDate}`;
  
  if (dayEvents.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: #999;">
        <div style="font-size: 36px; margin-bottom: 12px;">📅</div>
        <div style="font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #666;">No events scheduled</div>
        <div style="font-size: 11px; color: #999;">Click on events in the side panels to view details.</div>
      </div>
    `;
    modal.classList.add('active');
    return;
  }
  
  const eventsHtml = dayEvents.map((event, index) => {
    const clickHandler = `window.openEventDetailsModal('${event.eventId || event.id}')`;
    
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

function openEventDetailsModal(eventId) {
  // This is the detailed modal (Modal Type 2)
  openModal(eventId);
}

function openModal(eventId) {
  console.log('Opening EVENT DETAILS modal for eventId:', eventId);
  
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) {
    console.error('Modal elements not found');
    return;
  }

  // Find the event in eventsByDate
  let event = null;
  let eventDate = '';
  
  Object.keys(window.eventsByDate).forEach(date => {
    const found = window.eventsByDate[date].find(e => e.eventId === eventId || e.id === eventId);
    if (found) {
      event = found;
      eventDate = date;
    }
  });

  if (!event) {
    console.error('Event not found:', eventId);
    window.showToast('❌ Event not found');
    return;
  }

  console.log('Found event:', event);

  // Format date nicely
  const dateObj = new Date(eventDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  title.textContent = 'Appointment Details';
  
  body.innerHTML = `
    <!-- Status Badge and View Lead Link -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px 4px 12px; border-bottom: 1px solid #e0e0e0;">
      <span style="
        display: inline-block;
        padding: 3px 8px;
        background: #f5f5f5;
        color: #666;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      ">${event.status}</span>
      
      <a href="/dashboard/leads/${event.leadData?.id || event.id}" 
         style="color: #666; text-decoration: none; font-size: 10px; font-weight: 500;">
        View Lead #${event.reference}
      </a>
    </div>

    <!-- Customer Information -->
    <div style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">
      <div style="font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: #999; margin-bottom: 6px;">
        CUSTOMER INFORMATION
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px;">
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Name</div>
          <div style="font-size: 11px; font-weight: 500; color: #1a1a1a;">
            ${event.customer || 'Unknown'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Phone</div>
          <div style="font-size: 11px; font-weight: 500; color: #1a1a1a;">
            ${event.phone || 'N/A'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Email</div>
          <div style="font-size: 10px; color: #666;">
            ${event.email || 'N/A'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Vehicle</div>
          <div style="font-size: 10px; color: #666;">
            ${event.vehicle || 'N/A'}
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Details -->
    <div style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">
      <div style="font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: #999; margin-bottom: 6px;">
        APPOINTMENT DETAILS
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px;">
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Date</div>
          <div style="font-size: 11px; font-weight: 500; color: #1a1a1a;">
            ${formattedDate}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Time Slot</div>
          <div style="font-size: 11px; font-weight: 500; color: #1a1a1a;">
            ${event.time || 'N/A'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Service</div>
          <div style="font-size: 10px; color: #666;">
            ${event.serviceType || 'N/A'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 8px; color: #999; text-transform: uppercase; margin-bottom: 2px;">Reference</div>
          <div style="font-size: 10px; color: #666;">
            ${event.reference}
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Notes (Compacto) -->
    <div style="padding: 8px 12px; border-bottom: 1px solid #e0e0e0;">
      <div style="font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: #999; margin-bottom: 4px;">
        ADMIN NOTES
      </div>
      
      <textarea 
        id="appointmentNotes"
        placeholder="Add notes..."
        style="
          width: 100%;
          min-height: 60px;
          padding: 6px 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 10px;
          font-family: inherit;
          resize: vertical;
          box-sizing: border-box;
          color: #666;
        "
      >${event.notes || ''}</textarea>
      
      <button 
        onclick="window.saveAppointmentNotes('${eventId}')"
        style="
          margin-top: 4px;
          padding: 4px 8px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        "
        onmouseover="this.style.background='#e0e0e0'"
        onmouseout="this.style.background='#f5f5f5'"
      >Save Notes</button>
    </div>

    <!-- Action Buttons (Cores Sutis) -->
    <div style="padding: 8px 12px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
        <button 
          onclick="window.confirmAppointment('${eventId}')"
          style="
            padding: 6px 8px;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#e8f5e9'; this.style.borderColor='#c8e6c9'"
          onmouseout="this.style.background='#f5f5f5'; this.style.borderColor='#e0e0e0'"
        >
          ✅ Confirm
        </button>
        
        <button 
          onclick="window.completeAppointment('${eventId}')"
          style="
            padding: 6px 8px;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#e0e0e0'"
          onmouseout="this.style.background='#f5f5f5'"
        >
          ✔️ Complete
        </button>
        
        <button 
          onclick="window.cancelAppointment('${eventId}')"
          style="
            padding: 6px 8px;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#ffebee'; this.style.borderColor='#ffcdd2'"
          onmouseout="this.style.background='#f5f5f5'; this.style.borderColor='#e0e0e0'"
        >
          🚫 Cancel
        </button>
        
        <button 
          onclick="window.noShowAppointment('${eventId}')"
          style="
            padding: 6px 8px;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#fff3e0'; this.style.borderColor='#ffe0b2'"
          onmouseout="this.style.background='#f5f5f5'; this.style.borderColor='#e0e0e0'"
        >
          🚷 No Show
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ============================================
// APPOINTMENT ACTION FUNCTIONS
// ============================================
async function confirmAppointment(eventId) {
  await updateAppointmentStatus(eventId, 'Confirmed');
}

async function completeAppointment(eventId) {
  await updateAppointmentStatus(eventId, 'Completed');
}

async function cancelAppointment(eventId) {
  await updateAppointmentStatus(eventId, 'Cancelled');
}

async function noShowAppointment(eventId) {
  await updateAppointmentStatus(eventId, 'No-Show');
}

async function updateAppointmentStatus(eventId, newStatus) {
  try {
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('auth_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    window.showToast(`⏳ Updating status to ${newStatus}...`);

    const response = await fetch(`/api/appointments/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Update local data
    Object.keys(window.eventsByDate).forEach(date => {
      const event = window.eventsByDate[date].find(e => e.eventId === eventId || e.id === eventId);
      if (event) {
        event.status = newStatus;
      }
    });

    // Reload calendar data to ensure consistency
    await loadCalendarData(window.currentYear, window.currentMonth);

    closeModal();
    window.showToast(`✅ Status updated to ${newStatus}`);
  } catch (error) {
    console.error('❌ Error updating status:', error);
    window.showToast('❌ Error updating status. Please try again.');
  }
}

async function saveAppointmentNotes(eventId) {
  try {
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('auth_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const notesTextarea = document.querySelector('textarea');
    const notes = notesTextarea ? notesTextarea.value : '';

    window.showToast('⏳ Saving notes...');

    const response = await fetch(`/api/appointments/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notes: notes
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Update local data
    Object.keys(window.eventsByDate).forEach(date => {
      const event = window.eventsByDate[date].find(e => e.eventId === eventId || e.id === eventId);
      if (event) {
        event.notes = notes;
      }
    });

    window.showToast('✅ Notes saved successfully');
  } catch (error) {
    console.error('❌ Error saving notes:', error);
    window.showToast('❌ Error saving notes. Please try again.');
  }
}

async function changeMonth(direction) {
  // Update current month
  window.currentMonth += direction;
  
  // Handle year wraparound
  if (window.currentMonth > 12) {
    window.currentMonth = 1;
    window.currentYear++;
  } else if (window.currentMonth < 1) {
    window.currentMonth = 12;
    window.currentYear--;
  }
  
  // Update calendar header
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const calendarHeader = document.querySelector('.calendar-header h2');
  if (calendarHeader) {
    calendarHeader.textContent = `${monthNames[window.currentMonth - 1]} ${window.currentYear}`;
  }
  
  // Reload data for new month
  await loadCalendarData(window.currentYear, window.currentMonth);
  
  window.showToast(`📅 ${monthNames[window.currentMonth - 1]} ${window.currentYear}`);
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
      e.currentTarget.classList.add('dragging');
      
      // Try data attributes first (new dynamic events)
      let eventId = e.currentTarget.getAttribute('data-event-id');
      let sourceDate = e.currentTarget.getAttribute('data-event-date');
      
      // Fallback to onclick parsing (legacy hardcoded events)
      if (!eventId) {
        const onclickAttr = e.currentTarget.getAttribute('onclick');
        if (onclickAttr) {
          const match = onclickAttr.match(/window\.openModal\('([^']+)'\)/);
          if (match) {
            eventId = match[1];
            // Find sourceDate from eventsByDate
            Object.keys(window.eventsByDate).forEach(date => {
              if (window.eventsByDate[date].some(ev => (ev.eventId === eventId || ev.id === eventId))) {
                sourceDate = date;
              }
            });
          }
        }
      }
      
      if (eventId && sourceDate) {
        e.dataTransfer.setData('eventId', eventId);
        e.dataTransfer.setData('sourceDate', sourceDate);
        console.log('🎯 Drag started:', eventId, 'from', sourceDate);
      } else {
        console.warn('⚠️ Could not extract eventId/sourceDate for drag');
      }
    });
    
    event.addEventListener('dragend', (e) => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.classList.remove('dragging');
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
        const dayNumber = dayNumEl.textContent.trim();
        const targetDate = `${window.currentYear}-${String(window.currentMonth).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        
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
    // Get auth token (try multiple possible key names)
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('auth_token') || 
                  localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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
  window.loadCalendarData = loadCalendarData;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.changeMonth = changeMonth;
  window.openDayModal = openDayModal;
  window.openRescheduledEventModal = openRescheduledEventModal;
  window.openNewEventModal = openNewEventModal;
  window.openRescheduleModal = openRescheduleModal;
  window.confirmReschedule = confirmReschedule;
  window.openEventDetailsModal = openEventDetailsModal;
  window.confirmAppointment = confirmAppointment;
  window.completeAppointment = completeAppointment;
  window.cancelAppointment = cancelAppointment;
  window.noShowAppointment = noShowAppointment;
  window.saveAppointmentNotes = saveAppointmentNotes;
  window.eventsByDate = eventsByDate;
  window.calculateAndUpdateStats = calculateAndUpdateStats;
  window.populateSidePanels = populateSidePanels;
  
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
