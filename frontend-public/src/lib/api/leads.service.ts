import apiClient from './client';
import { EstimateRequest } from '@/types/estimate';

export interface CreateLeadResponse {
  id: string;
  referenceNumber: string;
  status: string;
  createdAt: string;
}

export const leadsService = {
  /**
   * Create a new lead from estimate request
   */
  async createLead(data: Partial<EstimateRequest>): Promise<CreateLeadResponse> {
    console.log('[LeadsService] Creating lead:', data);
    
    // Transform estimate data to lead format
    const leadData = {
      // Customer information
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      
      // Service details
      serviceType: data.serviceType,
      damageDescription: data.damageDescription || data.issueDescription,
      
      // Vehicle information
      vehicle: data.vehicle ? {
        vin: data.vehicle.vin,
        year: data.vehicle.year,
        make: data.vehicle.make,
        model: data.vehicle.model,
      } : undefined,
      
      // Insurance information (for bodyshop)
      hasInsurance: data.hasInsurance,
      insuranceInfo: data.insuranceInfo ? {
        provider: data.insuranceInfo.provider,
        policyNumber: data.insuranceInfo.policyNumber,
        claimNumber: data.insuranceInfo.claimNumber,
      } : undefined,
      
      // Scheduling
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      
      // Contact preferences
      contactPreferences: data.contactPreferences,
      
      // Photos/documents (URLs)
      photos: data.photos,
      warrantyDocs: data.warrantyDocs,
      
      // Source
      source: 'website_estimate_form',
      status: 'new',
    };

    const response = await apiClient.post<CreateLeadResponse>('/leads', leadData);
    console.log('[LeadsService] Lead created:', response.data);
    return response.data;
  },

  /**
   * Get lead by reference number
   */
  async getLeadByReference(referenceNumber: string): Promise<any> {
    const response = await apiClient.get(`/leads/reference/${referenceNumber}`);
    return response.data;
  },
};
