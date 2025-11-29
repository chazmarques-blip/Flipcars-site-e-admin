import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreatePublicLeadDto } from './dto/create-public-lead.dto';
import { Public } from '@common/decorators/public.decorator';

/**
 * Public Leads Controller
 * Handles lead creation from public website estimate form
 * No authentication required - rate limiting applied
 */
@Controller('public/leads')
export class PublicLeadsController {
  private readonly logger = new Logger(PublicLeadsController.name);

  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Create a new lead from website estimate form
   * Public endpoint - no authentication required
   * 
   * @param createPublicLeadDto - Lead data from estimate form
   * @returns Created lead with reference number
   */
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createPublicLead(@Body() createPublicLeadDto: CreatePublicLeadDto) {
    try {
      this.logger.log('🚀 =========================');
      this.logger.log('📝 Received public lead submission');
      this.logger.log('Lead data:', {
        firstName: createPublicLeadDto.firstName,
        lastName: createPublicLeadDto.lastName,
        email: createPublicLeadDto.email,
        source: createPublicLeadDto.source,
      });

      // Transform public DTO to internal CreateLeadDto
      this.logger.log('🔄 Transforming lead data...');
      const leadData = await this.transformPublicLead(createPublicLeadDto);
      
      this.logger.log('📋 Transformed lead data summary:');
      this.logger.log(`  Name: ${leadData.name}`);
      this.logger.log(`  Email: ${leadData.email}`);
      this.logger.log(`  Phone: ${leadData.phone}`);
      this.logger.log(`  Preferred Date: ${leadData.preferredDate || 'NOT SET'}`);
      this.logger.log(`  Preferred Time Slot: ${leadData.preferredTimeSlot || 'NOT SET'}`);
      this.logger.log(`  Contact Preferences:`, leadData.contactPreferences);

      // Create lead using existing service
      this.logger.log('💾 Creating lead in database...');
      const lead = await this.leadsService.create(leadData as any);

      this.logger.log(`✅ Lead created successfully with reference: ${lead.referenceNumber}`);
      this.logger.log(`🆔 Lead ID: ${lead.id}`);

      // Build response object
      const response = {
        success: true,
        message: 'Lead created successfully',
        data: {
          referenceNumber: lead.referenceNumber,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: lead.status,
          createdAt: lead.createdAt,
        },
      };

      this.logger.log('📤 Sending response:', JSON.stringify(response));
      this.logger.log('✅ =========================');

      // Return minimal response (don't expose internal IDs)
      return response;
    } catch (error) {
      this.logger.error('❌ =========================');
      this.logger.error('❌ Error creating public lead:', error);
      this.logger.error('❌ Error stack:', error.stack);
      this.logger.error('❌ =========================');
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(
        'Failed to create lead. Please check your data and try again.',
      );
    }
  }

  /**
   * Transform public lead DTO to internal lead format
   */
  private async transformPublicLead(dto: CreatePublicLeadDto) {
    // Combine first and last name
    const fullName = `${dto.firstName} ${dto.lastName}`.trim();

    // Build damage description
    let damageDescription = '';
    
    // Check if bodyshop data exists
    if (dto.insuranceCompany || dto.claimNumber || dto.photos) {
      damageDescription = dto.additionalNotes || 'Body shop repair needed';
      if (dto.insuranceCompany) {
        damageDescription += `\n\nInsurance: ${dto.insuranceCompany}`;
        if (dto.claimNumber) {
          damageDescription += ` (Claim #${dto.claimNumber})`;
        }
      }
    } else if (dto.warrantyCompany || dto.warrantyDocs) {
      // Use warranty symptoms description
      damageDescription = dto.warrantyDocs?.symptomsDescription || 'Mechanic service needed';
      
      if (dto.warrantyDocs && dto.warrantyDocs.selectedIssues && dto.warrantyDocs.selectedIssues.length > 0) {
        damageDescription += `\n\nAffected Systems: ${dto.warrantyDocs.selectedIssues.join(', ')}`;  
      }
      
      if (dto.warrantyCompany) {
        damageDescription += `\n\nWarranty: ${dto.warrantyCompany}`;
        if (dto.warrantyClaimNumber) {
          damageDescription += ` (Claim #${dto.warrantyClaimNumber})`;
        }
      }
    }

    // Add additional notes
    if (dto.additionalNotes) {
      damageDescription += `\n\nAdditional Notes: ${dto.additionalNotes}`;
    }

    // Collect all photo URLs
    const photoUrls: string[] = [];
    
    if (dto.photos) {
      if (dto.photos.driverFront) photoUrls.push(dto.photos.driverFront);
      if (dto.photos.passengerFront) photoUrls.push(dto.photos.passengerFront);
      if (dto.photos.driverRear) photoUrls.push(dto.photos.driverRear);
      if (dto.photos.passengerRear) photoUrls.push(dto.photos.passengerRear);
      if (dto.photos.vinNumber) photoUrls.push(dto.photos.vinNumber);
      if (dto.photos.odometer) photoUrls.push(dto.photos.odometer);
      if (dto.photos.details) photoUrls.push(...dto.photos.details);
    }
    
    if (dto.warrantyDocs) {
      if (dto.warrantyDocs.policyDocument) photoUrls.push(dto.warrantyDocs.policyDocument);
      if (dto.warrantyDocs.vinPhoto) photoUrls.push(dto.warrantyDocs.vinPhoto);
      if (dto.warrantyDocs.odometerPhoto) photoUrls.push(dto.warrantyDocs.odometerPhoto);
    }

    // Build contact preferences note
    // TEMPORARY: Disabled until schema is fixed (column doesn't exist in database)
    // const contactPrefs: string[] = [];
    // if (dto.contactPreferences.phoneCall) contactPrefs.push('Phone Call');
    // if (dto.contactPreferences.whatsapp) contactPrefs.push('WhatsApp');
    // if (dto.contactPreferences.textMessage) contactPrefs.push('Text Message');
    
    const contactPrefsNote = ''; // Temporarily disabled
    // const contactPrefsNote = contactPrefs.length > 0 
    //   ? `\n\nPreferred Contact Methods: ${contactPrefs.join(', ')}`
    //   : '';

    // Build scheduling note
    let schedulingNote = '';
    if (dto.dateSkipped) {
      schedulingNote = '\n\nScheduling: Customer will call to schedule';
    } else if (dto.preferredDate && dto.preferredTimeSlot) {
      // Format the date for display in notes
      const dateObj = new Date(dto.preferredDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      schedulingNote = `\n\nScheduled Appointment: ${formattedDate} at ${dto.preferredTimeSlot}`;
      
      this.logger.log(`📅 Appointment scheduling data found:`);
      this.logger.log(`   Date: ${dto.preferredDate} (${formattedDate})`);
      this.logger.log(`   Time Slot: ${dto.preferredTimeSlot}`);
    }

    // Create final notes combining everything
    const finalNotes = `${damageDescription}${contactPrefsNote}${schedulingNote}`.trim();

    // Parse preferredDate to YYYY-MM-DD format if it's an ISO string
    let formattedPreferredDate: string | undefined = undefined;
    if (dto.preferredDate && !dto.dateSkipped) {
      try {
        // Convert ISO 8601 string (2024-11-21T00:00:00.000Z) to YYYY-MM-DD
        const dateObj = new Date(dto.preferredDate);
        formattedPreferredDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        
        this.logger.log(`📅 Converted preferredDate:`);
        this.logger.log(`   Input: ${dto.preferredDate}`);
        this.logger.log(`   Output: ${formattedPreferredDate}`);
      } catch (error) {
        this.logger.warn(`⚠️ Failed to parse preferredDate: ${dto.preferredDate}`, error);
      }
    }

    // Return transformed data in CreateLeadDto format
    return {
      name: fullName,
      email: dto.email,
      phone: dto.phone,
      preferredLanguage: 'en', // Default to English
      // CRITICAL FIX: Include appointment scheduling fields
      preferredDate: formattedPreferredDate,
      preferredTimeSlot: dto.preferredTimeSlot,
      contactPreferences: dto.contactPreferences,
      vehicleMake: dto.vehicle?.make,
      vehicleModel: dto.vehicle?.model,
      vehicleYear: dto.vehicle?.year,
      vehicleColor: undefined,
      hasInsurance: !!dto.insuranceCompany,
      insuranceProvider: dto.insuranceCompany,
      claimNumber: dto.claimNumber || dto.warrantyClaimNumber,
      accidentDescription: damageDescription,
      accidentDate: undefined,
      isDrivable: true, // Assume drivable unless specified
      needsTow: false,
      needsRental: false,
      damagePhotos: photoUrls,
      // NEW: Service-specific fields (backward compatible - undefined if not provided)
      serviceType: dto.serviceType,
      warrantyCompany: dto.warrantyCompany,
      selectedServices: dto.warrantyDocs?.selectedIssues,
      symptomsDescription: dto.warrantyDocs?.symptomsDescription,
      source: dto.source || 'website_estimate_form',
      status: 'new',
      priority: undefined, // Will be calculated by service
      notes: finalNotes,
      estimatedValue: undefined,
    };
  }
}
