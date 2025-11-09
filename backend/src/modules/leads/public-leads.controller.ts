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
      this.logger.log('📝 Received public lead submission');
      this.logger.debug('Lead data:', {
        email: createPublicLeadDto.email,
        serviceType: createPublicLeadDto.serviceType,
        source: createPublicLeadDto.source,
      });

      // Transform public DTO to internal CreateLeadDto
      const leadData = await this.transformPublicLead(createPublicLeadDto);

      // Create lead using existing service
      const lead = await this.leadsService.create(leadData as any);

      this.logger.log(`✅ Lead created successfully: ${lead.referenceNumber}`);

      // Return minimal response (don't expose internal IDs)
      return {
        success: true,
        message: 'Lead created successfully',
        data: {
          referenceNumber: lead.referenceNumber,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          serviceType: createPublicLeadDto.serviceType,
          status: lead.status,
          createdAt: lead.createdAt,
        },
      };
    } catch (error) {
      this.logger.error('❌ Error creating public lead:', error);
      
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

    // Build damage description based on service type
    let damageDescription = '';
    
    if (dto.serviceType === 'bodyshop') {
      damageDescription = dto.additionalNotes || 'Body shop repair needed';
      if (dto.insuranceCompany) {
        damageDescription += `\n\nInsurance: ${dto.insuranceCompany}`;
        if (dto.claimNumber) {
          damageDescription += ` (Claim #${dto.claimNumber})`;
        }
      }
    } else if (dto.serviceType === 'mechanic') {
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
    if (dto.additionalNotes && dto.serviceType === 'mechanic') {
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
    const contactPrefs: string[] = [];
    if (dto.contactPreferences.phoneCall) contactPrefs.push('Phone Call');
    if (dto.contactPreferences.whatsapp) contactPrefs.push('WhatsApp');
    if (dto.contactPreferences.textMessage) contactPrefs.push('Text Message');
    
    const contactPrefsNote = contactPrefs.length > 0 
      ? `\n\nPreferred Contact Methods: ${contactPrefs.join(', ')}`
      : '';

    // Build scheduling note
    let schedulingNote = '';
    if (dto.preferredDate && !dto.dateSkipped) {
      schedulingNote = `\n\nPreferred Date: ${dto.preferredDate}`;
      if (dto.preferredTimeSlot) {
        schedulingNote += ` at ${dto.preferredTimeSlot}`;
      }
    } else if (dto.dateSkipped) {
      schedulingNote = '\n\nScheduling: Customer will call to schedule';
    }

    // Create final notes combining everything
    const finalNotes = `${damageDescription}${contactPrefsNote}${schedulingNote}`.trim();

    // Return transformed data in CreateLeadDto format
    return {
      name: fullName,
      email: dto.email,
      phone: dto.phone,
      preferredLanguage: 'en', // Default to English
      vehicleMake: dto.vehicle?.make,
      vehicleModel: dto.vehicle?.model,
      vehicleYear: dto.vehicle?.year,
      vehicleColor: undefined,
      hasInsurance: dto.serviceType === 'bodyshop' && !!dto.insuranceCompany,
      insuranceProvider: dto.insuranceCompany,
      claimNumber: dto.claimNumber || dto.warrantyClaimNumber,
      accidentDescription: damageDescription,
      accidentDate: undefined,
      isDrivable: true, // Assume drivable unless specified
      needsTow: false,
      needsRental: false,
      damagePhotos: photoUrls,
      source: dto.source || 'website_estimate_form',
      status: 'new',
      priority: undefined, // Will be calculated by service
      notes: finalNotes,
      estimatedValue: undefined,
    };
  }
}
