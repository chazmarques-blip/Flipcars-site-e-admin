import apiClient from './client';
import { PaginatedResponse } from '@/types';

export interface ContactPreferences {
  phoneCall?: boolean;
  whatsapp?: boolean;
  textMessage?: boolean;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export interface Appointment {
  id: string;
  leadId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTimeSlot: string; // "9:00-11:00"
  appointmentStartTime?: string; // HH:MM:SS
  appointmentEndTime?: string; // HH:MM:SS
  status: AppointmentStatus;
  contactPreferences?: ContactPreferences;
  adminNotes?: string;
  confirmedAt?: string;
  confirmedById?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated relationships
  lead?: {
    id: string;
    referenceNumber: string;
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    // 🆕 New fields from backend DIA 1
    vehicleYear?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    hasInsurance?: boolean;
    insuranceProvider?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: string;
    estimatedValue?: number;
    // Legacy vehicle object (for backward compatibility)
    vehicle?: {
      year?: string;
      make?: string;
      model?: string;
      vin?: string;
    };
  };
  confirmedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAppointmentDto {
  leadId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTimeSlot: string; // "9:00-11:00"
  contactPreferences?: ContactPreferences;
  adminNotes?: string;
}

export interface UpdateAppointmentDto {
  appointmentDate?: string;
  appointmentTimeSlot?: string;
  status?: AppointmentStatus;
  contactPreferences?: ContactPreferences;
  adminNotes?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  rescheduled: number;
}

// 🆕 Dashboard stats from new backend endpoint
export interface DashboardStats {
  total: number;
  thisWeek: number;
  estimatedRevenue: string; // "15000.00"
  formattedRevenue: string; // "$15.0K"
}

export const appointmentsService = {
  /**
   * Get paginated appointments
   */
  async getAppointments(
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get<PaginatedResponse<Appointment>>(
      `/appointments?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get appointments for a specific month
   */
  async getAppointmentsByMonth(year: number, month: number): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(
      `/appointments/month/${year}/${month}`
    );
    return response.data;
  },

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Get appointment by lead ID
   */
  async getAppointmentByLeadId(leadId: string): Promise<Appointment | null> {
    try {
      const response = await apiClient.get<Appointment>(`/appointments/lead/${leadId}`);
      return response.data;
    } catch (error: any) {
      // Return null if appointment not found (404)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get appointment statistics
   */
  async getStatistics(): Promise<AppointmentStats> {
    const response = await apiClient.get<AppointmentStats>('/appointments/stats');
    return response.data;
  },

  /**
   * Create new appointment
   */
  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  /**
   * Update appointment
   */
  async updateAppointment(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Update appointment status
   */
  async updateStatus(id: string, status: AppointmentStatus, adminNotes?: string): Promise<Appointment> {
    const updateData: UpdateAppointmentDto = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    return this.updateAppointment(id, updateData);
  },

  /**
   * Delete appointment
   */
  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  },

  /**
   * Reschedule appointment
   */
  async rescheduleAppointment(
    id: string,
    newDate: string,
    newTimeSlot: string,
    adminNotes?: string
  ): Promise<Appointment> {
    return this.updateAppointment(id, {
      appointmentDate: newDate,
      appointmentTimeSlot: newTimeSlot,
      status: AppointmentStatus.RESCHEDULED,
      adminNotes,
    });
  },

  /**
   * Confirm appointment
   */
  async confirmAppointment(id: string, adminNotes?: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.CONFIRMED, adminNotes);
  },

  /**
   * Mark appointment as completed
   */
  async completeAppointment(id: string, adminNotes?: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.COMPLETED, adminNotes);
  },

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: string, adminNotes?: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.CANCELLED, adminNotes);
  },

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string, adminNotes?: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.NO_SHOW, adminNotes);
  },

  /**
   * 🆕 Get dashboard statistics (DIA 1 backend implementation)
   * Returns: total appointments, this week count, estimated revenue
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/appointments/dashboard/stats');
    return response.data;
  },
};
