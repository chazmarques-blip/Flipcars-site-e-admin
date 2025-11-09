import apiClient from './client';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  LeadFilters,
  LeadStats,
  LeadStatus,
  LeadNote,
  LeadActivity,
} from '@/types/lead';
import { PaginatedResponse } from '@/types';
import { mockLeads, mockLeadNotes, mockLeadActivities } from '@/lib/mock/leadsMockData';
import { mockLeadStorage } from '@/lib/storage/mockLeadStorage';

// Mock mode flag - set to false when backend is ready
const USE_MOCK_DATA = false;

// Initialize storage with default leads on first load
if (typeof window !== 'undefined') {
  mockLeadStorage.initializeWithDefaults(mockLeads);
}

export const leadService = {
  /**
   * Get paginated leads with filters
   */
  async getLeads(
    page: number = 1,
    limit: number = 10,
    filters?: LeadFilters
  ): Promise<PaginatedResponse<Lead>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get leads from localStorage storage
      let filteredLeads = mockLeadStorage.getLeads();

      // Apply filters
      if (filters?.status) {
        filteredLeads = filteredLeads.filter(l => l.status === filters.status);
      }
      if (filters?.priority) {
        filteredLeads = filteredLeads.filter(l => l.priority === filters.priority);
      }
      if (filters?.hasInsurance !== undefined) {
        filteredLeads = filteredLeads.filter(l => l.hasInsurance === filters.hasInsurance);
      }
      if (filters?.assignedToId) {
        filteredLeads = filteredLeads.filter(l => l.assignedToId === filters.assignedToId);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredLeads = filteredLeads.filter(l =>
          l.name.toLowerCase().includes(search) ||
          l.email.toLowerCase().includes(search) ||
          l.phone.includes(search) ||
          l.referenceNumber.toLowerCase().includes(search)
        );
      }
      if (filters?.minAiScore) {
        filteredLeads = filteredLeads.filter(l => 
          l.aiQualificationScore && l.aiQualificationScore >= filters.minAiScore!
        );
      }
      if (filters?.maxAiScore) {
        filteredLeads = filteredLeads.filter(l => 
          l.aiQualificationScore && l.aiQualificationScore <= filters.maxAiScore!
        );
      }

      // Sort by created date (newest first)
      filteredLeads.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedLeads = filteredLeads.slice(start, end);

      return {
        data: paginatedLeads,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(filteredLeads.length / limit),
          total: filteredLeads.length,
          perPage: limit,
        },
      };
    }

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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get from localStorage storage
      const lead = mockLeadStorage.getLeadById(id);
      
      if (!lead) {
        console.error('[LeadService] Lead not found:', id);
        throw new Error('Lead not found');
      }
      
      console.log('[LeadService] Found lead:', lead.referenceNumber);
      return lead;
    }
    
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
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Create new lead with mock data
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        referenceNumber: data.referenceNumber || `FLIP-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: 'new',
        priority: 'medium',
        source: data.source || 'website',
        serviceType: data.serviceType || 'unknown',
        vehicle: data.vehicle,
        hasInsurance: data.hasInsurance || false,
        insuranceCompany: data.insuranceCompany,
        claimNumber: data.claimNumber,
        estimatedValue: data.estimatedValue,
        damageDescription: data.damageDescription,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage storage (persists across reloads)
      mockLeadStorage.addLead(newLead);
      
      console.log('[LeadService] Created and saved lead:', newLead.referenceNumber);
      
      return newLead;
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in localStorage
      const updatedLead = mockLeadStorage.updateLead(id, { status });
      
      if (!updatedLead) {
        throw new Error('Lead not found');
      }
      
      return updatedLead;
    }
    
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

  /**
   * Get lead notes
   */
  async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const notes = mockLeadNotes[leadId] || [];
      // Transform to match LeadNote interface
      return notes.map(note => ({
        id: note.id,
        leadId: note.leadId,
        content: note.content,
        createdBy: note.userName || note.createdBy || 'Unknown',
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        isInternal: note.isInternal,
      }));
    }
    
    const response = await apiClient.get(`/leads/${leadId}/notes`);
    return response.data;
  },

  /**
   * Get lead activities
   */
  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const activities = mockLeadActivities[leadId] || [];
      // Transform to match LeadActivity interface
      return activities.map(activity => ({
        id: activity.id,
        leadId: activity.leadId,
        type: activity.action || activity.type || 'update',
        description: activity.description,
        performedBy: activity.userName || activity.performedBy || 'System',
        timestamp: activity.createdAt,
        metadata: activity.metadata || {},
      }));
    }
    
    const response = await apiClient.get(`/leads/${leadId}/activities`);
    return response.data;
  },

  /**
   * Add note to lead
   */
  async addLeadNote(leadId: string, content: string): Promise<LeadNote> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In mock mode, just return success
      return {
        id: Date.now().toString(),
        leadId,
        content,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };
    }
    
    const response = await apiClient.post(`/leads/${leadId}/notes`, { content });
    return response.data;
  },

  /**
   * Update lead priority
   */
  async updateLeadPriority(leadId: string, priority: string): Promise<Lead> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in localStorage
      const updatedLead = mockLeadStorage.updateLead(leadId, { priority: priority as any });
      
      if (!updatedLead) {
        throw new Error('Lead not found');
      }
      
      return updatedLead;
    }
    
    return this.updateLead(leadId, { priority: priority as any });
  },
};
