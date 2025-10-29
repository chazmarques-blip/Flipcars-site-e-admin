import apiClient from './client';
import {
  Claim,
  CreateClaimDto,
  UpdateClaimDto,
  ClaimFilters,
  ClaimStats,
  ClaimStatus,
  ClaimDocument,
} from '@/types/claim';
import { PaginatedResponse } from '@/types';

export const claimService = {
  /**
   * Get paginated claims with filters
   */
  async getClaims(
    page: number = 1,
    limit: number = 10,
    filters?: ClaimFilters
  ): Promise<PaginatedResponse<Claim>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.damageType) params.append('damageType', filters.damageType);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
    if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
    if (filters?.minRiskScore) params.append('minRiskScore', filters.minRiskScore.toString());
    if (filters?.maxRiskScore) params.append('maxRiskScore', filters.maxRiskScore.toString());
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await apiClient.get<PaginatedResponse<Claim>>(`/claims?${params.toString()}`);
    return response.data;
  },

  /**
   * Get claim statistics
   */
  async getStatistics(): Promise<ClaimStats> {
    const response = await apiClient.get<ClaimStats>('/claims/statistics');
    return response.data;
  },

  /**
   * Get claims assigned to current user
   */
  async getMyClaims(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Claim>> {
    const response = await apiClient.get<PaginatedResponse<Claim>>(
      `/claims/my-claims?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get claim by ID
   */
  async getClaimById(id: string): Promise<Claim> {
    const response = await apiClient.get<Claim>(`/claims/${id}`);
    return response.data;
  },

  /**
   * Get claim by claim number
   */
  async getClaimByNumber(claimNumber: string): Promise<Claim> {
    const response = await apiClient.get<Claim>(`/claims/number/${claimNumber}`);
    return response.data;
  },

  /**
   * Get claims by customer ID
   */
  async getClaimsByCustomer(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Claim>> {
    const response = await apiClient.get<PaginatedResponse<Claim>>(
      `/claims/customer/${customerId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Create new claim
   */
  async createClaim(data: CreateClaimDto): Promise<Claim> {
    const response = await apiClient.post<Claim>('/claims', data);
    return response.data;
  },

  /**
   * Update claim
   */
  async updateClaim(id: string, data: UpdateClaimDto): Promise<Claim> {
    const response = await apiClient.patch<Claim>(`/claims/${id}`, data);
    return response.data;
  },

  /**
   * Update claim status
   */
  async updateClaimStatus(id: string, status: ClaimStatus, note?: string): Promise<Claim> {
    const response = await apiClient.patch<Claim>(`/claims/${id}/status`, {
      status,
      statusNote: note,
    });
    return response.data;
  },

  /**
   * Assign claim to user
   */
  async assignClaim(id: string, userId: string): Promise<Claim> {
    const response = await apiClient.patch<Claim>(`/claims/${id}/assign`, {
      assignedToId: userId,
    });
    return response.data;
  },

  /**
   * Approve claim with amount
   */
  async approveClaim(id: string, approvedAmount: number, notes?: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/approve`, {
      approvedAmount,
      approvalNotes: notes,
    });
    return response.data;
  },

  /**
   * Reject claim
   */
  async rejectClaim(id: string, reason: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/reject`, {
      rejectionReason: reason,
    });
    return response.data;
  },

  /**
   * Upload document to claim
   */
  async uploadDocument(id: string, file: File): Promise<ClaimDocument> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ClaimDocument>(
      `/claims/${id}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete document from claim
   */
  async deleteDocument(claimId: string, documentId: string): Promise<void> {
    await apiClient.delete(`/claims/${claimId}/documents/${documentId}`);
  },

  /**
   * Analyze claim with AI
   */
  async analyzeClaim(id: string): Promise<Claim> {
    const response = await apiClient.post<Claim>(`/claims/${id}/analyze`);
    return response.data;
  },

  /**
   * Delete claim
   */
  async deleteClaim(id: string): Promise<void> {
    await apiClient.delete(`/claims/${id}`);
  },
};
