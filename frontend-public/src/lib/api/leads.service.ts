import apiClient from './client';
import { EstimateRequest } from '@/types/estimate';

export interface CreateLeadResponse {
  success: boolean;
  message: string;
  data: {
    referenceNumber: string;
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    status: string;
    createdAt: string;
  };
}

export const leadsService = {
  /**
   * Create a new lead from estimate request using public endpoint
   */
  async createLead(data: Partial<EstimateRequest>): Promise<CreateLeadResponse> {
    console.log('[LeadsService] Creating lead via public endpoint:', data);
    console.log('[LeadsService] 📋 Input data keys:', Object.keys(data));
    
    // Transform estimate data to public lead DTO format
    const leadData = {
      // Step 1: Basic contact information (REQUIRED)
      firstName: data.firstName!,
      lastName: data.lastName!,
      email: data.email!,
      phone: data.phone!,
      serviceType: data.serviceType!,
      
      // Step 2A: Body Shop information (OPTIONAL)
      insuranceCompany: data.insuranceCompany,
      claimNumber: data.claimNumber,
      hasClaimNumber: !!data.claimNumber,
      
      // Step 2B: Mechanic/Warranty information (OPTIONAL)
      warrantyCompany: data.warrantyCompany,
      warrantyClaimNumber: data.warrantyClaimNumber,
      hasWarrantyClaimNumber: !!data.warrantyClaimNumber,
      
      // Scheduling information (OPTIONAL)
      // Convert preferredDate to ISO 8601 format if present
      ...(data.preferredDate && data.preferredDate.trim() !== '' ? { 
        preferredDate: new Date(data.preferredDate).toISOString() 
      } : {}),
      preferredTimeSlot: data.preferredTimeSlot,
      dateSkipped: data.dateSkipped,
      
      // Vehicle information (OPTIONAL)
      vehicle: data.vehicle,
      
      // Step 3: Photos (OPTIONAL - bodyshop only)
      photos: data.photos,
      
      // Step 2.5: Warranty Documents (OPTIONAL - mechanic only)
      warrantyDocs: data.warrantyDocs ? {
        policyDocument: typeof data.warrantyDocs.policyDocument === 'string' 
          ? data.warrantyDocs.policyDocument 
          : undefined,
        vinPhoto: typeof data.warrantyDocs.vinPhoto === 'string'
          ? data.warrantyDocs.vinPhoto
          : undefined,
        odometerPhoto: typeof data.warrantyDocs.odometerPhoto === 'string'
          ? data.warrantyDocs.odometerPhoto
          : undefined,
        selectedIssues: data.warrantyDocs.selectedIssues || [],
        symptomsDescription: data.warrantyDocs.symptomsDescription || '',
      } : undefined,
      
      // Step 4: Contact preferences (REQUIRED)
      // Map frontend fields to backend DTO structure
      contactPreferences: {
        phoneCall: data.contactPreferences?.phone || false,
        whatsapp: false, // Not currently captured in frontend
        textMessage: data.contactPreferences?.sms || false,
      },
      additionalNotes: data.additionalNotes,
      
      // System fields
      source: 'website_estimate_form',
      status: 'new',
    };

    console.log('[LeadsService] 📤 Final payload to send:', leadData);
    console.log('[LeadsService] 📋 Payload keys:', Object.keys(leadData));
    console.log('[LeadsService] 🔍 Checking for duplicates...');
    const keys = Object.keys(leadData);
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicates.length > 0) {
      console.warn('[LeadsService] ⚠️  Found duplicate keys:', duplicates);
    }

    try {
      const response = await apiClient.post<CreateLeadResponse>(
        '/public/leads',
        leadData
      );
      
      console.log('[LeadsService] ✅ Lead created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[LeadsService] ❌ Error creating lead:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  },

  /**
   * Get lead by reference number (not available for public, requires auth)
   */
  async getLeadByReference(referenceNumber: string): Promise<any> {
    const response = await apiClient.get(`/leads/reference/${referenceNumber}`);
    return response.data;
  },
};
