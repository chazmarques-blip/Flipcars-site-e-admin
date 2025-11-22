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
    // serviceType removed - not supported by backend
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
    
    // CRITICAL: Remove serviceType from input data to prevent it from being sent
    // The backend DTO explicitly rejects this field (create-public-lead.dto.ts:135-137)
    const { serviceType, ...cleanData } = data;
    
    console.log('[LeadsService] ⚠️  Removed serviceType from payload');
    console.log('[LeadsService] 🧹 Clean data keys:', Object.keys(cleanData));
    
    // Transform estimate data to public lead DTO format
    const leadData = {
      // Step 1: Basic contact information (REQUIRED)
      firstName: cleanData.firstName!,
      lastName: cleanData.lastName!,
      email: cleanData.email!,
      phone: cleanData.phone!,
      // serviceType explicitly excluded above
      
      // Step 2A: Body Shop information (OPTIONAL)
      insuranceCompany: cleanData.insuranceCompany,
      claimNumber: cleanData.claimNumber,
      hasClaimNumber: !!cleanData.claimNumber,
      
      // Step 2B: Mechanic/Warranty information (OPTIONAL)
      warrantyCompany: cleanData.warrantyCompany,
      warrantyClaimNumber: cleanData.warrantyClaimNumber,
      hasWarrantyClaimNumber: !!cleanData.warrantyClaimNumber,
      
      // Scheduling information (OPTIONAL)
      // Convert preferredDate to ISO 8601 format if present
      ...(cleanData.preferredDate && cleanData.preferredDate.trim() !== '' ? { 
        preferredDate: new Date(cleanData.preferredDate).toISOString() 
      } : {}),
      preferredTimeSlot: cleanData.preferredTimeSlot,
      dateSkipped: cleanData.dateSkipped,
      
      // Vehicle information (OPTIONAL)
      vehicle: cleanData.vehicle,
      
      // Step 3: Photos (OPTIONAL - bodyshop only)
      // Photos should be URLs (already uploaded), not File objects
      // Accept both relative paths (/uploads/) and full URLs (https://)
      ...(cleanData.photos && Object.values(cleanData.photos).some(
        (photo) => typeof photo === 'string' && (photo.startsWith('/uploads/') || photo.startsWith('http'))
      ) ? { photos: cleanData.photos } : {}),
      
      // Step 2.5: Warranty Documents (OPTIONAL - mechanic only)
      // Only include if there are actual string URLs (not File objects or Base64)
      ...(cleanData.warrantyDocs && cleanData.warrantyDocs.selectedIssues && cleanData.warrantyDocs.symptomsDescription ? {
        warrantyDocs: {
          // Only include document URLs if they are strings (uploaded URLs, not Base64)
          ...(typeof cleanData.warrantyDocs.policyDocument === 'string' && 
              cleanData.warrantyDocs.policyDocument.startsWith('http') ? 
              { policyDocument: cleanData.warrantyDocs.policyDocument } : {}),
          ...(typeof cleanData.warrantyDocs.vinPhoto === 'string' && 
              cleanData.warrantyDocs.vinPhoto.startsWith('http') ? 
              { vinPhoto: cleanData.warrantyDocs.vinPhoto } : {}),
          ...(typeof cleanData.warrantyDocs.odometerPhoto === 'string' && 
              cleanData.warrantyDocs.odometerPhoto.startsWith('http') ? 
              { odometerPhoto: cleanData.warrantyDocs.odometerPhoto } : {}),
          selectedIssues: cleanData.warrantyDocs.selectedIssues || [],
          symptomsDescription: cleanData.warrantyDocs.symptomsDescription || '',
        }
      } : {}),
      
      // Step 4: Contact preferences (REQUIRED)
      // Frontend already uses correct field names (phoneCall, whatsapp, textMessage)
      contactPreferences: {
        phoneCall: cleanData.contactPreferences?.phoneCall || false,
        whatsapp: cleanData.contactPreferences?.whatsapp || false,
        textMessage: cleanData.contactPreferences?.textMessage || false,
      },
      additionalNotes: cleanData.additionalNotes,
      
      // System fields
      source: 'website_estimate_form',
      status: 'new',
    };

    console.log('[LeadsService] 📤 Final payload to send:', leadData);
    console.log('[LeadsService] 📋 Payload keys:', Object.keys(leadData));
    
    // CRITICAL: Final validation - ensure serviceType is NOT in payload
    if ('serviceType' in leadData) {
      console.error('[LeadsService] ❌ CRITICAL: serviceType found in payload! Removing...');
      delete (leadData as any).serviceType;
    }
    
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
