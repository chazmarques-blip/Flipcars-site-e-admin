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
    // Define all functions inside useEffect to ensure they're in the client bundle
    // This prevents Next.js tree-shaking from removing them
    
    // Import functions and data that need to be available
    const eventsByDate: Record<string, any[]> = {
      '2025-11-15': [
        {
          type: 'appointment',
          time: '9:00-11:00',
          customer: 'Bob Johnson',
          phone: '(555) 123-4567',
          email: 'bob.johnson@email.com',
          vehicle: '2019 Honda Civic',
          vin: '2HGFC2F59KH123456',
          serviceType: 'Body Repair',
          serviceCategory: 'Body Shop',
          paymentType: 'Insurance',
          insuranceCompany: 'Progressive',
          claimNumber: 'PRG-2025-12345',
          estimateAmount: 'TBD',
          status: 'Scheduled',
          reference: '2025-1115-0001',
          eventId: 'appt1'
        },
        {
          type: 'payment',
          amount: '$150.00',
          installment: '3/5',
          customer: 'Maria Garcia',
          phone: '(321) 456-7890',
          email: 'maria.garcia@email.com',
          vehicle: '2019 Honda Accord',
          vin: '1HGCV1F39KA123456',
          serviceType: 'Paint Job',
          serviceCategory: 'Body Shop',
          paymentType: 'Private',
          insuranceCompany: 'N/A',
          totalAmount: '$750.00',
          paidAmount: '$450.00',
          remainingAmount: '$300.00',
          dueDate: '2025-11-15',
          status: 'Pending',
          reference: '2025-1115-0002',
          eventId: 'payment_nov15_maria'
        },
        {
          type: 'appointment',
          time: '14:00-16:00',
          customer: 'Robert Williams',
          phone: '(407) 789-0123',
          email: 'robert.w@email.com',
          vehicle: '2021 Ford F-150',
          vin: '1FTFW1E84MFA12345',
          serviceType: 'Oil Change + Inspection',
          serviceCategory: 'Mechanical',
          paymentType: 'Private',
          insuranceCompany: 'N/A',
          claimNumber: 'N/A',
          estimateAmount: '$120.00',
          status: 'Scheduled',
          reference: '2025-1115-0003',
          eventId: 'appt_nov15_robert'
        }
      ],
      '2025-11-08': [
        {
          type: 'payment',
          amount: '$183.54',
          installment: '2/6',
          customer: 'John Doe',
          phone: '(689) 221-3162',
          email: 'john.doe@email.com',
          vehicle: '2021 Mitsubishi Outlander',
          vin: 'JA4J3VA85MZ041362',
          serviceType: 'Body Repair',
          serviceCategory: 'Body Shop',
          paymentType: 'Insurance',
          insuranceCompany: 'State Farm',
          totalAmount: '$1,101.24',
          paidAmount: '$183.54',
          remainingAmount: '$734.16',
          dueDate: '2025-11-08',
          status: 'Overdue',
          reference: '2025-1010-0001',
          eventId: 'payment1'
        }
      ],
      '2025-11-12': [
        {
          type: 'payment',
          amount: '$146.30',
          installment: '1/2',
          customer: 'Maria Silva',
          phone: '(654) 945-0938',
          email: 'maria.silva@email.com',
          vehicle: '2020 Ford EcoSport',
          vin: '5NPEB4AC1LH123456',
          serviceType: 'Body Repair',
          serviceCategory: 'Body Shop',
          paymentType: 'Private',
          insuranceCompany: 'Private (Self-Pay)',
          totalAmount: '$292.60',
          paidAmount: '$0.00',
          remainingAmount: '$292.60',
          dueDate: '2025-11-12',
          status: 'Overdue',
          reference: '2025-1015-0001',
          eventId: 'payment2'
        }
      ],
      '2025-11-14': [
        {
          type: 'appointment',
          time: '13:00-15:00',
          customer: 'Alice Smith',
          phone: '(813) 786-5844',
          email: 'alice.smith@email.com',
          vehicle: '2019 Honda Civic',
          vin: '19XFC2F59KE123456',
          serviceType: 'Oil Change + Inspection',
          serviceCategory: 'Mechanic',
          paymentType: 'Private',
          insuranceCompany: 'N/A',
          estimateAmount: '$95.00',
          status: 'Confirmed',
          reference: '2025-1108-0001',
          eventId: 'appt2'
        }
      ],
      '2025-11-17': [
        {
          type: 'payment',
          amount: '$209.63',
          installment: '1/7',
          customer: 'Sarah Martinez',
          phone: '(689) 345-3214',
          email: 'sarah.martinez@email.com',
          vehicle: '2020 RAM 2500',
          vin: '1C6RR7FT8LS123456',
          serviceType: 'Body Repair',
          serviceCategory: 'Body Shop',
          paymentType: 'Insurance',
          insuranceCompany: 'Allstate',
          totalAmount: '$1,467.41',
          paidAmount: '$0.00',
          remainingAmount: '$1,467.41',
          dueDate: '2025-11-17',
          status: 'Pending',
          reference: '2025-1020-0001',
          eventId: 'payment3'
        }
      ]
    };
    
    // Initialize mockup JavaScript logic after mount
    initializeMockup();
    
    // Cleanup on unmount
    return () => {
      // Remove event listeners if needed
    };
    
    // All functions defined here to be in scope
    function initializeMockup() {
      console.log('✅ Mockup initialized!');
      
      calculateAndUpdateStats();
      
      // Expose functions to window
      if (typeof window !== 'undefined') {
        (window as any).openModal = openModal;
        (window as any).closeModal = closeModal;
        (window as any).changeMonth = changeMonth;
        (window as any).openDayModal = openDayModal;
        (window as any).openRescheduledEventModal = openRescheduledEventModal;
        (window as any).openNewEventModal = openNewEventModal;
        (window as any).openRescheduleModal = openRescheduleModal;
        (window as any).confirmReschedule = confirmReschedule;
        (window as any).showToast = showToast;
        (window as any).eventsByDate = eventsByDate;
        (window as any).calculateAndUpdateStats = calculateAndUpdateStats;
      }
      
      const filterType = document.getElementById('filterType');
      const filterStatus = document.getElementById('filterStatus');
      const filterDate = document.getElementById('filterDate');
      const searchInput = document.getElementById('searchInput');
      
      if (filterType) filterType.addEventListener('change', () => showToast('Filter applied'));
      if (filterStatus) filterStatus.addEventListener('change', () => showToast('Filter applied'));
      if (filterDate) filterDate.addEventListener('change', () => showToast('Filter applied'));
      if (searchInput) searchInput.addEventListener('input', () => console.log('Search...'));
      
      const viewButtons = document.querySelectorAll('.view-btn');
      viewButtons.forEach(btn => {
        btn.addEventListener('click', function(this: HTMLElement) {
          viewButtons.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          showToast(`Switched to ${this.textContent} view`);
        });
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      });
      
      makeEventsDraggable();
      showToast('✅ Calendar loaded successfully!', 2000);
    }
    
    function calculateAndUpdateStats() {
      const today = new Date('2025-11-15');
      const todayStr = '2025-11-15';
      
      let total = 0;
      let todayCount = 0;
      let thisWeekCount = 0;
      let overdueCount = 0;
      let upcomingCount = 0;
      let totalRevenue = 0;
      
      Object.keys(eventsByDate).forEach(dateStr => {
        const events = eventsByDate[dateStr];
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
    
    function openDayModal(date: string) {
      const modal = document.getElementById('modal');
      const title = document.getElementById('modalTitle');
      const body = document.getElementById('modalBody');

      if (!modal || !title || !body) return;

      const dayEvents = eventsByDate[date] || [];
      
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
    
    function openRescheduledEventModal(date: string, eventIndex: number) {
      const event = eventsByDate[date]?.[eventIndex];
      if (!event) return;
      
      openModal(event.eventId);
    }
    
    function openNewEventModal() {
      showToast('➕ New event functionality coming soon!');
    }
    
    function changeMonth(direction: number) {
      showToast(`📅 Month navigation coming soon!`);
    }
    
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

      title.textContent = data.type === 'payment' ? 'Payment Details' : 'Appointment Details';
      
      body.innerHTML = `
        <div class="modal-section">
          <div class="modal-section-title">Lead Information</div>
          <div class="modal-grid">
            <div class="modal-field"><strong>Reference:</strong> ${data.reference}</div>
            <div class="modal-field"><strong>Created:</strong> ${data.created}</div>
            <div class="modal-field"><strong>Source:</strong> ${data.source}</div>
            <div class="modal-field"><strong>Status:</strong> <span class="status-badge ${data.status.toLowerCase()}">${data.status}</span></div>
          </div>
        </div>
        
        <div class="modal-section">
          <div class="modal-section-title">${data.type === 'payment' ? 'Payment Schedule' : 'Appointment Details'}</div>
          <div class="modal-grid">
            ${data.type === 'payment' ? `
              <div class="modal-field"><strong>Total Amount:</strong> ${data.totalAmount}</div>
              <div class="modal-field"><strong>Installments:</strong> ${data.installments}</div>
              <div class="modal-field"><strong>Due Date:</strong> ${data.dueDate}</div>
              <div class="modal-field"><strong>Status:</strong> ${data.overdueStatus || 'On time'}</div>
            ` : `
              <div class="modal-field"><strong>Date:</strong> ${data.appointmentDate}</div>
              <div class="modal-field"><strong>Time:</strong> ${data.appointmentTime}</div>
              <div class="modal-field"><strong>Status:</strong> ${data.appointmentStatus}</div>
              <div class="modal-field"><strong>Confirmation:</strong> ${data.appointmentConfirmation}</div>
            `}
          </div>
        </div>
        
        <div class="modal-section">
          <div class="modal-section-title">Customer Information</div>
          <div class="modal-grid">
            <div class="modal-field"><strong>Name:</strong> ${data.firstName} ${data.lastName}</div>
            <div class="modal-field"><strong>Phone:</strong> ${data.phone}</div>
            <div class="modal-field"><strong>Email:</strong> ${data.email}</div>
            <div class="modal-field"><strong>Service Type:</strong> ${data.serviceType}</div>
          </div>
        </div>
        
        <div class="modal-section">
          <div class="modal-section-title">Vehicle Information</div>
          <div class="modal-grid">
            <div class="modal-field"><strong>VIN:</strong> ${data.vin}</div>
            <div class="modal-field"><strong>Vehicle:</strong> ${data.vehicle}</div>
            ${data.insuranceCompany && data.insuranceCompany !== 'N/A' ? `
              <div class="modal-field"><strong>Insurance:</strong> ${data.insuranceCompany}</div>
              <div class="modal-field"><strong>Claim #:</strong> ${data.claimNumber || 'N/A'}</div>
            ` : ''}
          </div>
        </div>
        
        <div class="modal-section">
          <div class="modal-section-title">Contact Preferences</div>
          <div class="modal-grid">
            <div class="modal-field"><strong>Preferred:</strong> ${data.contactPreference || 'Phone'}</div>
            <div class="modal-field"><strong>Best Time:</strong> ${data.bestTimeToContact || 'Anytime'}</div>
          </div>
        </div>
        
        ${data.additionalNotes ? `
          <div class="modal-section">
            <div class="modal-section-title">Additional Notes</div>
            <div class="modal-notes">${data.additionalNotes}</div>
          </div>
        ` : ''}
        
        ${data.adminNotes ? `
          <div class="modal-section">
            <div class="modal-section-title">Admin Notes</div>
            <div class="modal-notes">${data.adminNotes}</div>
          </div>
        ` : ''}
      `;
      
      modal.classList.add('active');
    }
    
    function closeModal() {
      const modal = document.getElementById('modal');
      if (modal) {
        modal.classList.remove('active');
      }
    }
    
    function openRescheduleModal(eventId: string, sourceDate: string) {
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
    
    function confirmReschedule(eventId: string, sourceDate: string, newTime: string) {
      const targetDate = (window as any).dragTargetDate;
      
      if (!targetDate) {
        showToast('❌ Error: No target date selected');
        return;
      }
      
      const sourceEvents = eventsByDate[sourceDate];
      if (!sourceEvents) return;
      
      const eventIndex = sourceEvents.findIndex((e: any) => e.eventId === eventId);
      if (eventIndex === -1) return;
      
      const event = sourceEvents.splice(eventIndex, 1)[0];
      event.time = `${newTime}-${(parseInt(newTime.split(':')[0]) + 2).toString().padStart(2, '0')}:00`;
      
      if (!eventsByDate[targetDate]) {
        eventsByDate[targetDate] = [];
      }
      eventsByDate[targetDate].push(event);
      
      updateCalendarDay(sourceDate);
      updateCalendarDay(targetDate);
      
      calculateAndUpdateStats();
      
      closeModal();
      showToast(`✅ Event rescheduled to ${targetDate} at ${newTime}`);
      
      delete (window as any).dragTargetDate;
    }
    
    function updateCalendarDay(dateStr: string) {
      const dayNumber = parseInt(dateStr.split('-')[2]);
      const days = document.querySelectorAll('.calendar-day');
      
      days.forEach(day => {
        const dayNumEl = day.querySelector('.day-number');
        if (dayNumEl && dayNumEl.textContent === dayNumber.toString()) {
          const events = eventsByDate[dateStr] || [];
          
          let badge = day.querySelector('.event-badge');
          if (events.length > 0) {
            if (!badge) {
              badge = document.createElement('span');
              badge.className = 'event-badge';
              day.appendChild(badge);
            }
            badge.textContent = events.length.toString();
            
            const targetDay = day as HTMLElement;
            targetDay.setAttribute('onclick', `window.openDayModal('${dateStr}')`);
          } else {
            if (badge) {
              badge.remove();
            }
            const targetDay = day as HTMLElement;
            targetDay.removeAttribute('onclick');
          }
        }
      });
    }
    
    function makeEventsDraggable() {
      const draggableEvents = document.querySelectorAll('.event-item');
      
      draggableEvents.forEach(event => {
        event.setAttribute('draggable', 'true');
        
        event.addEventListener('dragstart', (e: Event) => {
          const dragEvent = e as DragEvent;
          const target = dragEvent.currentTarget as HTMLElement;
          
          target.style.opacity = '0.5';
          
          const onclickAttr = target.getAttribute('onclick');
          if (onclickAttr) {
            const match = onclickAttr.match(/window\.openModal\('([^']+)'\)/);
            if (match) {
              const eventId = match[1];
              dragEvent.dataTransfer!.setData('eventId', eventId);
              
              let sourceDate = '';
              Object.keys(eventsByDate).forEach(date => {
                if (eventsByDate[date].some((ev: any) => ev.eventId === eventId)) {
                  sourceDate = date;
                }
              });
              
              dragEvent.dataTransfer!.setData('sourceDate', sourceDate);
            }
          }
        });
        
        event.addEventListener('dragend', (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          target.style.opacity = '1';
        });
      });
      
      const calendarDays = document.querySelectorAll('.calendar-day');
      
      calendarDays.forEach(day => {
        day.addEventListener('dragover', (e: Event) => {
          e.preventDefault();
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        });
        
        day.addEventListener('dragleave', (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          target.style.backgroundColor = '';
        });
        
        day.addEventListener('drop', (e: Event) => {
          e.preventDefault();
          const dragEvent = e as DragEvent;
          const target = dragEvent.currentTarget as HTMLElement;
          
          target.style.backgroundColor = '';
          
          const eventId = dragEvent.dataTransfer!.getData('eventId');
          const sourceDate = dragEvent.dataTransfer!.getData('sourceDate');
          
          const dayNumEl = target.querySelector('.day-number');
          if (dayNumEl) {
            const dayNumber = dayNumEl.textContent;
            const targetDate = `2025-11-${dayNumber!.padStart(2, '0')}`;
            
            (window as any).dragTargetDate = targetDate;
            
            openRescheduleModal(eventId, sourceDate);
          }
        });
      });
    }
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
// GLOBAL DATA - Events by date storage
// ============================================

// Events by date storage (from mockup lines 1420-1484)
const eventsByDate: Record<string, any[]> = {
  '2025-11-15': [
    {
      type: 'appointment',
      time: '9:00-11:00',
      customer: 'Bob Johnson',
      phone: '(555) 123-4567',
      email: 'bob.johnson@email.com',
      vehicle: '2019 Honda Civic',
      vin: '2HGFC2F59KH123456',
      serviceType: 'Body Repair',
      serviceCategory: 'Body Shop',
      paymentType: 'Insurance',
      insuranceCompany: 'Progressive',
      claimNumber: 'PRG-2025-12345',
      estimateAmount: 'TBD',
      status: 'Scheduled',
      reference: '2025-1115-0001',
      eventId: 'appt1'
    },
    {
      type: 'payment',
      amount: '$150.00',
      installment: '3/5',
      customer: 'Maria Garcia',
      phone: '(321) 456-7890',
      email: 'maria.garcia@email.com',
      vehicle: '2019 Honda Accord',
      vin: '1HGCV1F39KA123456',
      serviceType: 'Paint Job',
      serviceCategory: 'Body Shop',
      paymentType: 'Private',
      insuranceCompany: 'N/A',
      totalAmount: '$750.00',
      paidAmount: '$450.00',
      remainingAmount: '$300.00',
      dueDate: '2025-11-15',
      status: 'Pending',
      reference: '2025-1115-0002',
      eventId: 'payment_nov15_maria'
    },
    {
      type: 'appointment',
      time: '14:00-16:00',
      customer: 'Robert Williams',
      phone: '(407) 789-0123',
      email: 'robert.w@email.com',
      vehicle: '2021 Ford F-150',
      vin: '1FTFW1E84MFA12345',
      serviceType: 'Oil Change + Inspection',
      serviceCategory: 'Mechanical',
      paymentType: 'Private',
      insuranceCompany: 'N/A',
      claimNumber: 'N/A',
      estimateAmount: '$120.00',
      status: 'Scheduled',
      reference: '2025-1115-0003',
      eventId: 'appt_nov15_robert'
    }
  ],
  '2025-11-08': [
    {
      type: 'payment',
      amount: '$183.54',
      installment: '2/6',
      customer: 'John Doe',
      phone: '(689) 221-3162',
      email: 'john.doe@email.com',
      vehicle: '2021 Mitsubishi Outlander',
      vin: 'JA4J3VA85MZ041362',
      serviceType: 'Body Repair',
      serviceCategory: 'Body Shop',
      paymentType: 'Insurance',
      insuranceCompany: 'State Farm',
      totalAmount: '$1,101.24',
      paidAmount: '$183.54',
      remainingAmount: '$734.16',
      dueDate: '2025-11-08',
      status: 'Overdue',
      reference: '2025-1010-0001',
      eventId: 'payment1'
    }
  ],
  '2025-11-12': [
    {
      type: 'payment',
      amount: '$146.30',
      installment: '1/2',
      customer: 'Maria Silva',
      phone: '(654) 945-0938',
      email: 'maria.silva@email.com',
      vehicle: '2020 Ford EcoSport',
      vin: '5NPEB4AC1LH123456',
      serviceType: 'Body Repair',
      serviceCategory: 'Body Shop',
      paymentType: 'Private',
      insuranceCompany: 'Private (Self-Pay)',
      totalAmount: '$292.60',
      paidAmount: '$0.00',
      remainingAmount: '$292.60',
      dueDate: '2025-11-12',
      status: 'Overdue',
      reference: '2025-1015-0001',
      eventId: 'payment2'
    }
  ],
  '2025-11-14': [
    {
      type: 'appointment',
      time: '13:00-15:00',
      customer: 'Alice Smith',
      phone: '(813) 786-5844',
      email: 'alice.smith@email.com',
      vehicle: '2019 Honda Civic',
      vin: '19XFC2F59KE123456',
      serviceType: 'Oil Change + Inspection',
      serviceCategory: 'Mechanic',
      paymentType: 'Private',
      insuranceCompany: 'N/A',
      estimateAmount: '$95.00',
      status: 'Confirmed',
      reference: '2025-1108-0001',
      eventId: 'appt2'
    }
  ],
  '2025-11-17': [
    {
      type: 'payment',
      amount: '$209.63',
      installment: '1/7',
      customer: 'Sarah Martinez',
      phone: '(689) 345-3214',
      email: 'sarah.martinez@email.com',
      vehicle: '2020 RAM 2500',
      vin: '1C6RR7FT8LS123456',
      serviceType: 'Body Repair',
      serviceCategory: 'Body Shop',
      paymentType: 'Insurance',
      insuranceCompany: 'Allstate',
      totalAmount: '$1,467.41',
      paidAmount: '$0.00',
      remainingAmount: '$1,467.41',
      dueDate: '2025-11-17',
      status: 'Pending',
      reference: '2025-1020-0001',
      eventId: 'payment3'
    }
  ]
};

// ============================================
// OTHER MOCKUP FUNCTIONS
// ============================================

let currentMonth = 10; // November (0-indexed)
let currentYear = 2025;

/**
 * Calculate and update all statistics from eventsByDate
 * This function counts events, calculates revenue, and updates DOM elements
 */
function calculateAndUpdateStats() {
  console.log('🔵 calculateAndUpdateStats() CHAMADA!');
  const today = new Date('2025-11-15'); // Mockup "today" date
  const todayStr = '2025-11-15';
  
  let total = 0;
  let todayCount = 0;
  let thisWeekCount = 0;
  let overdueCount = 0;
  let upcomingCount = 0;
  let totalRevenue = 0;
  
  // Count events by date
  Object.keys(eventsByDate).forEach(dateStr => {
    const events = eventsByDate[dateStr];
    total += events.length;
    
    const eventDate = new Date(dateStr);
    const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Today's events
    if (dateStr === todayStr) {
      todayCount = events.length;
    }
    
    // This week (next 7 days from Nov 15, inclusive)
    if (daysDiff >= 0 && daysDiff <= 7) {
      thisWeekCount += events.length;
    }
    
    // Overdue (check status field, not just date)
    events.forEach(event => {
      if (event.status === 'Overdue') {
        overdueCount++;
      }
    });
    
    // Upcoming (today and future)
    if (daysDiff >= 0) {
      upcomingCount += events.length;
    }
    
    // Calculate revenue from payment events
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
  
  // Format revenue
  const revenueFormatted = totalRevenue >= 1000 
    ? `$${(totalRevenue / 1000).toFixed(1)}K`
    : `$${totalRevenue.toFixed(0)}`;
  
  // Calculate completion percentage
  const completedEvents = total - overdueCount;
  const completionPct = total > 0 ? Math.round((completedEvents / total) * 100) : 100;
  
  // Update Stats Cards
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
  
  // Update Side Panel Badges
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
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !title || !body) return;

  // Get events for this specific date
  const dayEvents = eventsByDate[date] || [];
  
  console.log('Opening modal for date:', date);
  console.log('Events found:', dayEvents);

  title.textContent = `Events for ${date}`;
  
  // If no events, show empty state
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
              <strong>${event.customer} - ${event.amount || 'N/A'}</strong>
              <small>${event.installment ? 'Installment ' + event.installment : ''} • ${event.phone}</small>
            </div>
          </div>
          <div class="dme-info">
            <div class="dme-row">
              <span>🚗 <strong>${event.vehicle}</strong></span>
              <span>• ${event.serviceType}</span>
            </div>
            <div class="dme-row">
              <span>${event.reference}</span>
              ${event.totalAmount ? `<span>• Total: <strong>${event.totalAmount}</strong></span>` : ''}
              ${event.remainingAmount ? `<span>• Remaining: <strong>${event.remainingAmount}</strong></span>` : ''}
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">📅 ALL EVENTS (${dayEvents.length})</div>
      <div class="event-list" style="gap: 10px;">
        ${eventsHtml}
      </div>
    </div>
    
    <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid var(--primary);">
      <div style="font-size: 10px; color: var(--text-secondary); line-height: 1.5;">
        <strong>💡 Quick Actions:</strong><br>
        • <strong>Click</strong> any event above to view full details<br>
        • <strong>Click</strong> events in side panels to see complete information
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function openRescheduledEventModal(date: string, eventIndex: number) {
  const event = eventsByDate[date]?.[eventIndex];
  if (!event) {
    console.error('Event not found:', date, eventIndex);
    return;
  }
  
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (!modal || !title || !body) return;
  
  title.textContent = `${event.type === 'appointment' ? 'Appointment' : 'Payment'} Details`;
  
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">📋 BASIC INFORMATION</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Customer</div>
          <div style="font-size: 12px; font-weight: 600;">${event.customer}</div>
        </div>
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Phone</div>
          <div style="font-size: 12px;"><a href="tel:${event.phone}" style="color: var(--primary); text-decoration: none;">${event.phone}</a></div>
        </div>
        ${event.time ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Time</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--primary);">${event.time}</div>
        </div>
        ` : ''}
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Status</div>
          <div style="font-size: 12px;"><span style="background: ${event.status === 'Overdue' ? '#d32f2f' : '#4caf50'}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 600;">${event.status}</span></div>
        </div>
      </div>
    </div>
    
    <div class="modal-section">
      <div class="modal-section-title">🚗 VEHICLE INFORMATION</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Vehicle</div>
          <div style="font-size: 12px; font-weight: 600;">${event.vehicle}</div>
        </div>
        ${event.vin && event.vin !== 'N/A' ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">VIN</div>
          <div style="font-size: 11px; font-family: monospace;">${event.vin}</div>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div class="modal-section">
      <div class="modal-section-title">🔧 SERVICE DETAILS</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Service Type</div>
          <div style="font-size: 12px;">${event.serviceType}</div>
        </div>
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Category</div>
          <div style="font-size: 12px;">${event.serviceCategory || 'General'}</div>
        </div>
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Reference</div>
          <div style="font-size: 12px; font-weight: 600; color: var(--primary);">${event.reference}</div>
        </div>
      </div>
    </div>
    
    <div class="modal-section">
      <div class="modal-section-title">💰 PAYMENT INFORMATION</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Payment Type</div>
          <div style="font-size: 12px;">${event.paymentType}</div>
        </div>
        ${event.insuranceCompany && event.insuranceCompany !== 'N/A' ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Insurance</div>
          <div style="font-size: 12px;">${event.insuranceCompany}</div>
        </div>
        ` : ''}
        ${event.estimateAmount ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Estimate</div>
          <div style="font-size: 12px; font-weight: 600;">${event.estimateAmount}</div>
        </div>
        ` : ''}
        ${event.amount ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Amount Due</div>
          <div style="font-size: 12px; font-weight: 700; color: var(--primary);">${event.amount}</div>
        </div>
        ` : ''}
        ${event.totalAmount ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Total Amount</div>
          <div style="font-size: 12px; font-weight: 600;">${event.totalAmount}</div>
        </div>
        ` : ''}
        ${event.remainingAmount ? `
        <div>
          <div style="font-size: 9px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">Remaining</div>
          <div style="font-size: 12px; font-weight: 600; color: #d32f2f;">${event.remainingAmount}</div>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div style="display: flex; gap: 8px; margin-top: 16px;">
      <button class="btn btn-primary" onclick="alert('Edit functionality coming soon!')">✏️ Edit Event</button>
      <button class="btn" onclick="window.openModal('${event.eventId}')">📋 Full Details</button>
      <button class="btn" style="background: #f44336; color: white;" onclick="if(confirm('Delete this event?')) { alert('Delete functionality coming soon!'); }">🗑️ Delete</button>
    </div>
  `;
  
  modal.classList.add('active');
}

function openNewEventModal() {
  showToast('➕ Create new event (redirects to estimate form)', 3000);
  console.log('In production: window.location.href = "/estimate-form"');
}

// ============================================
// DRAG AND DROP FUNCTIONALITY
// ============================================

let draggedEvent: HTMLElement | null = null;
let draggedEventData: any = null;

function makeEventsDraggable() {
  console.log('🔵 makeEventsDraggable() CHAMADA!');
  // Make all event items in side panels draggable
  const eventItems = document.querySelectorAll('.event-item');
  console.log('🔍 Eventos encontrados para drag:', eventItems.length);
  eventItems.forEach(item => {
    const htmlItem = item as HTMLElement;
    htmlItem.setAttribute('draggable', 'true');
    
    htmlItem.addEventListener('dragstart', function(this: HTMLElement, e: DragEvent) {
      draggedEvent = this;
      this.style.opacity = '0.5';
      
      // Extract eventId from onclick attribute
      const onclickAttr = this.getAttribute('onclick');
      const eventIdMatch = onclickAttr ? onclickAttr.match(/openModal\('([^']+)'\)/) : null;
      const eventId = eventIdMatch ? eventIdMatch[1] : null;
      
      // Get full event data
      let fullEventData = null;
      if (eventId && mockEventData[eventId]) {
        fullEventData = mockEventData[eventId];
      }
      
      // Extract visible info
      const eventNameEl = this.querySelector('.event-name');
      const eventName = eventNameEl ? eventNameEl.textContent : 'Unknown';
      const eventType = this.classList.contains('appointment') ? 'appointment' : 'payment';
      const timeElement = this.querySelector('.event-time-phone strong');
      const eventTime = timeElement ? timeElement.textContent : null;
      const phoneElement = this.querySelector('.event-time-phone');
      const phone = phoneElement ? phoneElement.textContent?.split('📞')[1]?.trim() : '(555) XXX-XXXX';
      const detailsElement = this.querySelector('.event-details');
      const details = detailsElement ? detailsElement.textContent : '';
      const vehicleInfo = details?.split('•')[0]?.trim() || 'Vehicle info';
      const serviceInfo = details?.split('•')[1]?.trim() || 'Service';
      
      // Store event data
      draggedEventData = {
        name: fullEventData ? `${fullEventData.firstName} ${fullEventData.lastName}` : eventName,
        type: eventType,
        time: eventTime,
        phone: fullEventData ? fullEventData.phone : phone,
        email: fullEventData ? fullEventData.email : null,
        vehicle: fullEventData ? `${fullEventData.vehicle.year} ${fullEventData.vehicle.make} ${fullEventData.vehicle.model}` : vehicleInfo,
        vin: fullEventData ? fullEventData.vin : null,
        serviceType: serviceInfo,
        serviceCategory: fullEventData ? fullEventData.serviceType : null,
        reference: fullEventData ? fullEventData.leadReference : null,
        paymentType: fullEventData ? (fullEventData.insuranceCompany && fullEventData.insuranceCompany !== 'Private (Self-Pay)' ? 'Insurance' : 'Private') : null,
        insuranceCompany: fullEventData ? fullEventData.insuranceCompany : null,
        element: this,
        eventId: eventId
      };
      
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
      }
      
      showToast(`📅 Dragging: ${eventName}`);
      console.log('Drag started with full data:', draggedEventData);
    });
    
    htmlItem.addEventListener('dragend', function(this: HTMLElement) {
      this.style.opacity = '1';
    });
  });
  
  // Make calendar days drop zones
  const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
  calendarDays.forEach(day => {
    const htmlDay = day as HTMLElement;
    
    htmlDay.addEventListener('dragover', function(this: HTMLElement, e: DragEvent) {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      this.style.background = '#fff9e6';
      this.style.border = '2px dashed var(--primary)';
    });
    
    htmlDay.addEventListener('dragleave', function(this: HTMLElement) {
      this.style.background = '';
      this.style.border = '';
    });
    
    htmlDay.addEventListener('drop', function(this: HTMLElement, e: DragEvent) {
      e.preventDefault();
      this.style.background = '';
      this.style.border = '';
      
      if (draggedEventData) {
        const dayNumberEl = this.querySelector('.day-number');
        const dayNumber = dayNumberEl ? dayNumberEl.textContent : '1';
        const eventName = draggedEventData.name;
        
        // Show confirmation
        showToast(`✅ ${eventName} moved to Nov ${dayNumber}`, 4000);
        
        // Open reschedule modal
        openRescheduleModal(eventName, dayNumber || '1', draggedEventData);
        
        console.log(`Event "${eventName}" dropped on day ${dayNumber}`);
      }
    });
  });
}

function openRescheduleModal(eventName: string, newDay: string, eventData: any) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (!modal || !title || !body) return;
  
  title.textContent = '🔄 Reschedule Event';
  
  const currentTime = eventData && eventData.time ? eventData.time : '9:00-11:00';
  
  body.innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">📅 RESCHEDULE DETAILS</div>
      
      <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
        <div style="font-size: 13px; margin-bottom: 8px;">
          <strong>Event:</strong> ${eventName}
        </div>
        <div style="font-size: 13px;">
          <strong>New Date:</strong> November ${newDay}, 2025
        </div>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 11px; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">
          ⏰ Select New Time Slot
        </label>
        <select id="rescheduleTime" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; font-size: 13px;">
          <option value="9:00-11:00" ${currentTime === '9:00-11:00' ? 'selected' : ''}>9:00 AM - 11:00 AM</option>
          <option value="11:00-13:00" ${currentTime === '11:00-13:00' ? 'selected' : ''}>11:00 AM - 1:00 PM</option>
          <option value="13:00-15:00" ${currentTime === '13:00-15:00' ? 'selected' : ''}>1:00 PM - 3:00 PM</option>
          <option value="14:00-16:00" ${currentTime === '14:00-16:00' ? 'selected' : ''}>2:00 PM - 4:00 PM</option>
          <option value="15:00-17:00" ${currentTime === '15:00-17:00' ? 'selected' : ''}>3:00 PM - 5:00 PM</option>
          <option value="16:00-18:00" ${currentTime === '16:00-18:00' ? 'selected' : ''}>4:00 PM - 6:00 PM</option>
        </select>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 11px; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">
          📝 Reason for Rescheduling (optional)
        </label>
        <textarea id="rescheduleReason" placeholder="Customer request, conflict, etc..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px; min-height: 60px; resize: vertical; font-family: inherit;"></textarea>
      </div>
      
      <div style="background: #e8f5e9; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #4caf50; margin-bottom: 16px;">
        <div style="font-size: 10px; color: #2e7d32; line-height: 1.4;">
          <strong>✅ Next Steps:</strong> Customer will receive automatic notification via email, SMS, and WhatsApp (if configured).
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn" onclick="window.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window.confirmReschedule('${eventName}', '${newDay}')">
          ✅ Confirm Reschedule
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function confirmReschedule(eventName: string, newDay: string) {
  const timeSlotEl = document.getElementById('rescheduleTime') as HTMLSelectElement;
  const reasonEl = document.getElementById('rescheduleReason') as HTMLTextAreaElement;
  
  const timeSlot = timeSlotEl ? timeSlotEl.value : '9:00-11:00';
  const reason = reasonEl ? reasonEl.value : '';
  
  // Close modal
  closeModal();
  
  // Store event in eventsByDate
  const dateKey = `2025-11-${newDay.toString().padStart(2, '0')}`;
  if (!eventsByDate[dateKey]) {
    eventsByDate[dateKey] = [];
  }
  
  // Create event object with full details
  const eventData = {
    type: draggedEventData ? draggedEventData.type : 'appointment',
    time: timeSlot,
    customer: eventName,
    phone: draggedEventData && draggedEventData.phone ? draggedEventData.phone : '(555) XXX-XXXX',
    email: draggedEventData && draggedEventData.email ? draggedEventData.email : 'contact@email.com',
    vehicle: draggedEventData && draggedEventData.vehicle ? draggedEventData.vehicle : 'Vehicle info',
    vin: draggedEventData && draggedEventData.vin ? draggedEventData.vin : 'N/A',
    serviceType: draggedEventData && draggedEventData.serviceType ? draggedEventData.serviceType : 'Service',
    serviceCategory: draggedEventData && draggedEventData.serviceCategory ? draggedEventData.serviceCategory : 'General',
    paymentType: draggedEventData && draggedEventData.paymentType ? draggedEventData.paymentType : 'Private',
    insuranceCompany: draggedEventData && draggedEventData.insuranceCompany ? draggedEventData.insuranceCompany : 'N/A',
    claimNumber: draggedEventData && draggedEventData.claimNumber ? draggedEventData.claimNumber : 'N/A',
    estimateAmount: draggedEventData && draggedEventData.estimateAmount ? draggedEventData.estimateAmount : 'TBD',
    status: 'Scheduled',
    reference: draggedEventData && draggedEventData.reference ? draggedEventData.reference : 'NO-REF',
    eventId: `rescheduled_${Date.now()}`,
    originalEventId: draggedEventData && draggedEventData.eventId ? draggedEventData.eventId : null,
    rescheduledFrom: 'moved via drag-drop',
    rescheduledReason: reason || 'No reason provided'
  };
  
  eventsByDate[dateKey].push(eventData);
  
  // Update calendar visually
  updateCalendarDay(newDay, eventName, timeSlot);
  
  // Remove event from side panel
  if (draggedEvent) {
    draggedEvent.style.display = 'none';
  }
  
  // Show success toast
  showToast(`✅ ${eventName} rescheduled to Nov ${newDay} at ${timeSlot}`, 5000);
  
  console.log('Event rescheduled:', {
    event: eventName,
    newDate: dateKey,
    newTime: timeSlot,
    reason: reason || 'No reason provided',
    storedEvents: eventsByDate
  });
  
  // Show alert
  setTimeout(() => {
    alert(`Event Rescheduled Successfully!\n\nEvent: ${eventName}\nNew Date: November ${newDay}, 2025\nNew Time: ${timeSlot}\n${reason ? 'Reason: ' + reason : ''}\n\n✅ Customer notified automatically\n\n💡 The calendar has been updated. Click on day ${newDay} to see the event.`);
  }, 500);
}

function updateCalendarDay(dayNumber: string, eventName: string, timeSlot: string) {
  // Find the calendar day
  const calendarDays = document.querySelectorAll('.calendar-day');
  let targetDay: HTMLElement | null = null;
  
  calendarDays.forEach(day => {
    const dayNum = day.querySelector('.day-number');
    if (dayNum && dayNum.textContent === dayNumber.toString()) {
      targetDay = day as HTMLElement;
    }
  });
  
  if (!targetDay) {
    console.error('Target day not found:', dayNumber);
    return;
  }
  
  // Add click handler if not exists
  if (!targetDay.hasAttribute('onclick')) {
    targetDay.setAttribute('onclick', `window.openDayModal('2025-11-${dayNumber.padStart(2, '0')}')`);
  }
  
  // Check if day-events container exists
  let dayEvents = targetDay.querySelector('.day-events');
  if (!dayEvents) {
    dayEvents = document.createElement('div');
    dayEvents.className = 'day-events';
    targetDay.appendChild(dayEvents);
  }
  
  // Add event indicator
  const eventIndicator = document.createElement('div');
  eventIndicator.className = 'event-indicator appointment';
  dayEvents.appendChild(eventIndicator);
  
  // Update or create badge
  let badge = targetDay.querySelector('.event-badge');
  if (badge) {
    const currentCount = parseInt(badge.textContent || '0') || 0;
    badge.textContent = (currentCount + 1).toString();
  } else {
    badge = document.createElement('span');
    badge.className = 'event-badge';
    badge.textContent = '1';
    targetDay.appendChild(badge);
  }
  
  console.log(`✅ Calendar day ${dayNumber} updated with new event: ${eventName} at ${timeSlot}`);
}

// ============================================
// INITIALIZATION
// ============================================

function initializeMockup() {
  console.log('✅ Mockup initialized!');
  console.log('🔍 Window object exists:', typeof window !== 'undefined');
  console.log('🔍 EventsByDate:', eventsByDate);
  
  // Calculate and update stats
  calculateAndUpdateStats();
  
  // Expose functions to window for onclick handlers
  if (typeof window !== 'undefined') {
    console.log('🔵 Expondo funções ao window...');
    (window as any).openModal = openModal;
    (window as any).closeModal = closeModal;
    (window as any).changeMonth = changeMonth;
    (window as any).openDayModal = openDayModal;
    (window as any).openRescheduledEventModal = openRescheduledEventModal;
    (window as any).openNewEventModal = openNewEventModal;
    (window as any).openRescheduleModal = openRescheduleModal;
    (window as any).confirmReschedule = confirmReschedule;
    (window as any).showToast = showToast;
    (window as any).eventsByDate = eventsByDate;
    (window as any).calculateAndUpdateStats = calculateAndUpdateStats;
    console.log('✅ Funções expostas ao window com sucesso!');
    console.log('🔍 window.openDayModal:', typeof (window as any).openDayModal);
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
  
  // Setup drag and drop
  makeEventsDraggable();
  
  showToast('✅ Calendar loaded successfully!', 2000);
}
