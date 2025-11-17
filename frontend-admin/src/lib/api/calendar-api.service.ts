/**
 * CALENDAR API SERVICE
 * Serviço isolado para integração do calendário com dados reais da API
 * Não modifica appointments.service.ts existente
 */

import apiClient from './client';
import { Appointment } from './appointments.service';

// ============================================
// INTERFACES
// ============================================

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'appointment' | 'payment';
  customer: string;
  phone: string;
  email: string;
  time?: string; // "9:00-11:00"
  amount?: string; // "$150.00"
  installment?: string; // "3/5"
  status: string;
  vehicle: string;
  vin?: string;
  serviceType: string;
  serviceCategory?: string;
  paymentType?: string;
  insuranceCompany?: string;
  claimNumber?: string;
  estimateAmount?: string;
  totalAmount?: string;
  paidAmount?: string;
  remainingAmount?: string;
  dueDate?: string;
  reference: string;
  eventId: string;
  
  // Dados completos do lead para modal
  leadData?: any;
}

export interface CalendarStats {
  total: number;
  today: number;
  thisWeek: number;
  overdue: number;
  upcoming: number;
  revenue: string; // "$689" ou "$1.5K"
  completion: string; // "71%"
}

// ============================================
// TRANSFORMERS
// ============================================

/**
 * Transforma Appointment da API para CalendarEvent do calendário
 */
function transformAppointmentToEvent(appointment: Appointment): CalendarEvent {
  const lead = appointment.lead;
  
  // Montar string do veículo
  let vehicle = 'Unknown Vehicle';
  if (lead) {
    if (lead.vehicleYear && lead.vehicleMake && lead.vehicleModel) {
      vehicle = `${lead.vehicleYear} ${lead.vehicleMake} ${lead.vehicleModel}`;
    } else if (lead.vehicle?.year && lead.vehicle?.make && lead.vehicle?.model) {
      vehicle = `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}`;
    }
  }
  
  return {
    id: appointment.id,
    date: appointment.appointmentDate,
    type: 'appointment',
    customer: lead?.name || 'Unknown',
    phone: lead?.phone || '',
    email: lead?.email || '',
    time: appointment.appointmentTimeSlot,
    status: appointment.status,
    vehicle,
    vin: lead?.vehicle?.vin || '',
    serviceType: lead?.serviceType || '',
    serviceCategory: 'Service',
    paymentType: lead?.hasInsurance ? 'Insurance' : 'Private',
    insuranceCompany: lead?.insuranceProvider || 'N/A',
    estimateAmount: lead?.estimatedValue ? `$${lead.estimatedValue}` : 'TBD',
    reference: lead?.referenceNumber || appointment.id.substring(0, 8),
    eventId: appointment.id,
    leadData: lead
  };
}

/**
 * Agrupa eventos por data no formato do calendário
 */
function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const grouped: Record<string, CalendarEvent[]> = {};
  
  events.forEach(event => {
    if (!grouped[event.date]) {
      grouped[event.date] = [];
    }
    grouped[event.date].push(event);
  });
  
  return grouped;
}

/**
 * Calcula estatísticas do calendário
 */
function calculateStats(eventsByDate: Record<string, CalendarEvent[]>, today: string): CalendarStats {
  const todayDate = new Date(today);
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
    const daysDiff = Math.floor((eventDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Today
    if (dateStr === today) {
      todayCount = events.length;
    }
    
    // This week (next 7 days)
    if (daysDiff >= 0 && daysDiff <= 7) {
      thisWeekCount += events.length;
    }
    
    // Upcoming (today and future)
    if (daysDiff >= 0) {
      upcomingCount += events.length;
    }
    
    // Overdue (check status)
    events.forEach(event => {
      if (event.status === 'overdue' || event.status === 'Overdue') {
        overdueCount++;
      }
    });
    
    // Revenue (from payments and estimates)
    events.forEach(event => {
      if (event.type === 'payment' && event.amount) {
        const amount = parseFloat(event.amount.replace(/[$,]/g, ''));
        if (!isNaN(amount)) {
          totalRevenue += amount;
        }
      } else if (event.estimateAmount && event.estimateAmount !== 'TBD') {
        const amount = parseFloat(event.estimateAmount.replace(/[$,]/g, ''));
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
  
  // Calculate completion
  const completedEvents = total - overdueCount;
  const completionPct = total > 0 ? Math.round((completedEvents / total) * 100) : 100;
  
  return {
    total,
    today: todayCount,
    thisWeek: thisWeekCount,
    overdue: overdueCount,
    upcoming: upcomingCount,
    revenue: revenueFormatted,
    completion: `${completionPct}%`
  };
}

// ============================================
// API SERVICE
// ============================================

export const calendarApiService = {
  /**
   * Busca eventos (appointments) de um mês específico
   */
  async getEventsByMonth(year: number, month: number): Promise<Record<string, CalendarEvent[]>> {
    try {
      const response = await apiClient.get(`/appointments/month/${year}/${month}`);
      const appointments: Appointment[] = response.data;
      
      // Transformar appointments em calendar events
      const events = appointments.map(transformAppointmentToEvent);
      
      // Agrupar por data
      const eventsByDate = groupEventsByDate(events);
      
      console.log(`📅 Loaded ${events.length} events for ${year}-${month}`);
      return eventsByDate;
    } catch (error) {
      console.error('❌ Error loading calendar events:', error);
      throw error;
    }
  },
  
  /**
   * Calcula estatísticas do calendário
   */
  async getCalendarStats(year: number, month: number): Promise<CalendarStats> {
    try {
      const eventsByDate = await this.getEventsByMonth(year, month);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const stats = calculateStats(eventsByDate, today);
      console.log('📊 Calendar stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error calculating stats:', error);
      throw error;
    }
  },
  
  /**
   * Atualiza data e horário de um appointment (drag-drop)
   */
  async updateEventDate(appointmentId: string, newDate: string, newTimeSlot: string): Promise<void> {
    try {
      await apiClient.patch(`/appointments/${appointmentId}`, {
        appointmentDate: newDate,
        appointmentTimeSlot: newTimeSlot
      });
      
      console.log(`✅ Event ${appointmentId} updated to ${newDate} ${newTimeSlot}`);
    } catch (error) {
      console.error('❌ Error updating event date:', error);
      throw error;
    }
  },
  
  /**
   * Busca um appointment específico por ID
   */
  async getEventById(appointmentId: string): Promise<CalendarEvent | null> {
    try {
      const response = await apiClient.get(`/appointments/${appointmentId}`);
      const appointment: Appointment = response.data;
      
      return transformAppointmentToEvent(appointment);
    } catch (error) {
      console.error('❌ Error loading event:', error);
      return null;
    }
  }
};

export default calendarApiService;
