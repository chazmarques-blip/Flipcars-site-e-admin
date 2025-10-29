import apiClient from './client';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  LeadFilters,
  LeadStats,
  LeadStatus,
} from '@/types/lead';
import { PaginatedResponse } from '@/types';

export const leadService = {
  /**
   * Get paginated leads with filters
   */
  async getLeads(
    page: number = 1,
    limit: number = 10,
    filters?: LeadFilters
  ): Promise<PaginatedResponse<Lead>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.hasInsurance !== undefined) params.append('hasInsurance', filters.hasInsurance.toString());
    if (filters?.minAiScore) params.append('minAiScore', filters.minAiScore.toString());
    if (filters?.maxAiScore) params.append('maxAiScore', filters.maxAiScore.toString());

    const response = await apiClient.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return response.data;
  },

  /**
   * Get lead statistics
   */
  async getStatistics(): Promise<LeadStats> {
    const response = await apiClient.get<LeadStats>('/leads/statistics');
    return response.data;
  },

  /**
   * Get leads assigned to current user
   */
  async getMyLeads(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Lead>> {
    const response = await apiClient.get<PaginatedResponse<Lead>>(
      `/leads/my-leads?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get lead by ID
   */
  async getLeadById(id: string): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  /**
   * Get lead by reference number
   */
  async getLeadByReference(referenceNumber: string): Promise<Lead> {
    const response = await apiClient.get<Lead>(`/leads/reference/${referenceNumber}`);
    return response.data;
  },

  /**
   * Create new lead
   */
  async createLead(data: CreateLeadDto): Promise<Lead> {
    const response = await apiClient.post<Lead>('/leads', data);
    return response.data;
  },

  /**
   * Update lead
   */
  async updateLead(id: string, data: UpdateLeadDto): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/${id}`, data);
    return response.data;
  },

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: LeadStatus, note?: string): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/${id}/status`, {
      status,
      statusNote: note,
    });
    return response.data;
  },

  /**
   * Assign lead to user
   */
  async assignLead(id: string, userId: string): Promise<Lead> {
    const response = await apiClient.patch<Lead>(`/leads/${id}/assign`, {
      assignedToId: userId,
    });
    return response.data;
  },

  /**
   * Qualify lead (set AI score)
   */
  async qualifyLead(id: string, score: number, notes?: string): Promise<Lead> {
    const response = await apiClient.post<Lead>(`/leads/${id}/qualify`, {
      aiQualificationScore: score,
      aiQualificationNotes: notes,
    });
    return response.data;
  },

  /**
   * Delete lead
   */
  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  },
};
