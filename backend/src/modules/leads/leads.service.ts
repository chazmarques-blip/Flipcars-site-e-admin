import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead, LeadStatus, LeadPriority } from '@database/entities/lead.entity';
import { User } from '@database/entities/user.entity';
import { Customer } from '@database/entities/customer.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadsDto } from './dto/query-leads.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-status.dto';
import { QualifyLeadDto } from './dto/qualify-lead.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appointmentsService: AppointmentsService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Generate unique reference number for lead (FLIP-YYYYMMDD-XXXX)
   */
  private async generateReferenceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const prefix = `FLIP-${year}${month}${day}`;

    // Get count of leads created today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.leadRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }

  /**
   * Calculate lead priority based on AI score and other factors
   */
  private calculatePriority(aiScore?: number): LeadPriority {
    if (!aiScore) return LeadPriority.MEDIUM;

    if (aiScore >= 71) return LeadPriority.HIGH;
    if (aiScore >= 41) return LeadPriority.MEDIUM;
    return LeadPriority.LOW;
  }

  /**
   * DEBUG METHOD - Get SQL query for debugging
   */
  async getDebugSql() {
    try {
      const queryBuilder = this.leadRepository
        .createQueryBuilder('lead')
        .orderBy('lead.createdAt', 'DESC')
        .take(1);
      
      const sql = queryBuilder.getSql();
      const count = await this.leadRepository.count();
      
      return {
        success: true,
        sql,
        totalLeads: count,
        message: 'Query generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
        name: error.name,
        message: 'Failed to generate query'
      };
    }
  }

  /**
   * Find all leads with pagination, filtering, and search
   */
  async findAll(query: QueryLeadsDto) {
    try {
      console.log('[LeadsService] findAll called with query:', JSON.stringify(query));
      
      const {
        page = 1,
        limit = 10,
        search,
        status,
        priority,
        source,
        assignedAgentId,
        minAiScore,
        maxAiScore,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = query;

      const queryBuilder = this.leadRepository
        .createQueryBuilder('lead');
        // TEMPORARY: Joins disabled until we fix the schema mismatch
        // .leftJoinAndSelect('lead.customer', 'customer')
        // .leftJoinAndSelect('lead.vehicle', 'vehicle')
        // .leftJoinAndSelect('lead.assignedHumanAgent', 'agent');

      // Filter out soft-deleted leads (NEW: soft delete support)
      // TEMPORARILY DISABLED: Column doesn't exist in production yet, migration pending
      // queryBuilder.andWhere('lead.deletedAt IS NULL');

      // Search by reference number, name, email, or phone
      if (search) {
        queryBuilder.andWhere(
          '(LOWER(lead.referenceNumber) LIKE LOWER(:search) OR ' +
            'LOWER(lead.name) LIKE LOWER(:search) OR ' +
            'LOWER(lead.email) LIKE LOWER(:search) OR ' +
            'LOWER(lead.phone) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      // Filter by status
      if (status) {
        queryBuilder.andWhere('lead.status = :status', { status });
      }

      // Filter by priority
      if (priority) {
        queryBuilder.andWhere('lead.priority = :priority', { priority });
      }

      // Filter by source
      if (source) {
        queryBuilder.andWhere('lead.source = :source', { source });
      }

      // Filter by assigned agent
      // TEMPORARY: Disabled until schema is fixed
      // if (assignedAgentId) {
      //   queryBuilder.andWhere('lead.assignedHumanAgentId = :assignedAgentId', {
      //     assignedAgentId,
      //   });
      // }

      // Filter by AI score range
      if (minAiScore !== undefined && maxAiScore !== undefined) {
        queryBuilder.andWhere(
          'lead.aiQualificationScore BETWEEN :minAiScore AND :maxAiScore',
          { minAiScore, maxAiScore },
        );
      } else if (minAiScore !== undefined) {
        queryBuilder.andWhere('lead.aiQualificationScore >= :minAiScore', {
          minAiScore,
        });
      } else if (maxAiScore !== undefined) {
        queryBuilder.andWhere('lead.aiQualificationScore <= :maxAiScore', {
          maxAiScore,
        });
      }

      // Sorting
      const sortField = sortBy === 'createdAt' ? 'lead.createdAt' : `lead.${sortBy}`;
      queryBuilder.orderBy(sortField, sortOrder);

      // Pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      // Execute query
      console.log('[LeadsService] Executing query...');
      const [leads, total] = await queryBuilder.getManyAndCount();
      
      console.log(`[LeadsService] Query successful: found ${total} leads`);

      return {
        data: leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('[LeadsService] Error in findAll:', error.message);
      console.error('[LeadsService] Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Find a single lead by ID
   */
  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      // TEMPORARY: Relations disabled until we fix the schema mismatch
      // relations: ['customer', 'vehicle', 'assignedHumanAgent'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  /**
   * Find lead by reference number
   */
  async findByReferenceNumber(referenceNumber: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { referenceNumber },
      // TEMPORARY: Relations disabled until we fix the schema mismatch
      // relations: ['customer', 'vehicle', 'assignedHumanAgent'],
    });

    if (!lead) {
      throw new NotFoundException(
        `Lead with reference number ${referenceNumber} not found`,
      );
    }

    return lead;
  }

  /**
   * Create a new lead
   */
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Generate reference number
    const referenceNumber = await this.generateReferenceNumber();

    // TEMPORARY: Customer/Vehicle/Agent handling disabled until schema is fixed
    // // Handle customer - check if customer ID provided or find/create by email
    // let customerId = createLeadDto.customerId;
    // 
    // if (!customerId && createLeadDto.email) {
    //   // Check if customer exists by email
    //   let customer = await this.customerRepository.findOne({
    //     where: { email: createLeadDto.email },
    //   });

    //   // If customer doesn't exist, create one
    //   if (!customer) {
    //     customer = this.customerRepository.create({
    //       name: createLeadDto.name,
    //       email: createLeadDto.email,
    //       phone: createLeadDto.phone,
    //     });
    //     customer = await this.customerRepository.save(customer);
    //   }

    //   customerId = customer.id;
    // }

    // // Handle vehicle - only create Vehicle entity if we have VIN
    // // Otherwise, just store make/model/year in lead fields directly
    // let vehicleId = createLeadDto.vehicleId;
    // 
    // // Note: Vehicle entity requires VIN (unique constraint), so we only create
    // // a vehicle record when VIN is provided from the VIN decoder.
    // // For leads without VIN, vehicle info is stored in lead.vehicleMake/Model/Year fields
    // 
    // // Skip vehicle entity creation for now - vehicle info stored in lead fields
    // // if (!vehicleId && customerId && createLeadDto.vehicleMake && createLeadDto.vehicleVin) {
    // //   const vehicle = this.vehicleRepository.create({
    // //     vin: createLeadDto.vehicleVin,
    // //     make: createLeadDto.vehicleMake,
    // //     model: createLeadDto.vehicleModel || '',
    // //     year: createLeadDto.vehicleYear || '',
    // //     color: createLeadDto.vehicleColor,
    // //     customerId,
    // //   });
    // //   const savedVehicle = await this.vehicleRepository.save(vehicle);
    // //   vehicleId = savedVehicle.id;
    // // }

    // // Validate assigned agent if provided
    // if (createLeadDto.assignedHumanAgentId) {
    //   const agent = await this.userRepository.findOne({
    //     where: { id: createLeadDto.assignedHumanAgentId },
    //   });
    //   if (!agent) {
    //     throw new BadRequestException('Assigned agent not found');
    //   }
    // }

    // Calculate priority from AI score if not provided
    const priority =
      createLeadDto.priority ||
      this.calculatePriority(createLeadDto.aiQualificationScore);

    // Create lead
    const lead = this.leadRepository.create({
      referenceNumber,
      name: createLeadDto.name,
      email: createLeadDto.email,
      phone: createLeadDto.phone,
      preferredLanguage: createLeadDto.preferredLanguage || 'en',
      // TEMPORARY: Disabled until schema is fixed (column doesn't exist in database)
      // contactPreferences: createLeadDto.contactPreferences,
      vehicleMake: createLeadDto.vehicleMake,
      vehicleModel: createLeadDto.vehicleModel,
      vehicleYear: createLeadDto.vehicleYear,
      vehicleColor: createLeadDto.vehicleColor,
      hasInsurance: createLeadDto.hasInsurance || false,
      insuranceProvider: createLeadDto.insuranceProvider,
      claimNumber: createLeadDto.claimNumber,
      accidentDescription: createLeadDto.accidentDescription,
      accidentDate: createLeadDto.accidentDate
        ? new Date(createLeadDto.accidentDate)
        : undefined,
      isDrivable: createLeadDto.isDrivable !== undefined ? createLeadDto.isDrivable : true,
      needsTow: createLeadDto.needsTow || false,
      needsRental: createLeadDto.needsRental || false,
      damagePhotos: createLeadDto.damagePhotos || [],
      source: createLeadDto.source || 'website',
      status: createLeadDto.status || LeadStatus.NEW,
      priority,
      notes: createLeadDto.notes,
      estimatedValue: createLeadDto.estimatedValue,
      // TEMPORARY: Disabled until schema is fixed
      // customerId,
      // vehicleId,
      // assignedHumanAgentId: createLeadDto.assignedHumanAgentId,
      aiQualificationScore: createLeadDto.aiQualificationScore,
      assignedAiAgent: createLeadDto.assignedAiAgent,
      aiConversationHistory: [],
    });

    const savedLead = await this.leadRepository.save(lead);

    // AUTO-CREATE APPOINTMENT if preferredDate is provided
    if (createLeadDto.preferredDate && createLeadDto.preferredTimeSlot) {
      try {
        console.log('[LeadsService] 📅 AUTO-CREATE APPOINTMENT CHECK:');
        console.log(`  Lead ID: ${savedLead.id}`);
        console.log(`  Lead Reference: ${savedLead.referenceNumber}`);
        console.log(`  Preferred Date: ${createLeadDto.preferredDate}`);
        console.log(`  Preferred Time Slot: ${createLeadDto.preferredTimeSlot}`);
        console.log(`  Contact Preferences:`, createLeadDto.contactPreferences);
        
        const appointmentDto = {
          leadId: savedLead.id,
          appointmentDate: createLeadDto.preferredDate,
          appointmentTimeSlot: createLeadDto.preferredTimeSlot,
          contactPreferences: createLeadDto.contactPreferences,
        };
        
        console.log('[LeadsService] 📤 Calling appointmentsService.create() with:', appointmentDto);
        
        const createdAppointment = await this.appointmentsService.create(appointmentDto);
        
        console.log(`[LeadsService] ✅ Appointment auto-created successfully!`);
        console.log(`  Appointment ID: ${createdAppointment.id}`);
        console.log(`  Appointment Date: ${createdAppointment.appointmentDate}`);
        console.log(`  Appointment Time Slot: ${createdAppointment.appointmentTimeSlot}`);
        console.log(`  Appointment Status: ${createdAppointment.status}`);
      } catch (error) {
        // Log error but don't fail lead creation
        console.error('[LeadsService] ❌ ========================================');
        console.error('[LeadsService] ❌ FAILED TO AUTO-CREATE APPOINTMENT');
        console.error('[LeadsService] ❌ Error message:', error.message);
        console.error('[LeadsService] ❌ Error stack:', error.stack);
        console.error('[LeadsService] ❌ Error details:', error);
        console.error('[LeadsService] ❌ ========================================');
        console.error('[LeadsService] Lead was created successfully, but appointment creation failed');
      }
    } else {
      console.log('[LeadsService] ⏭️  SKIPPING appointment creation:');
      console.log(`  preferredDate: ${createLeadDto.preferredDate || 'NOT PROVIDED'}`);
      console.log(`  preferredTimeSlot: ${createLeadDto.preferredTimeSlot || 'NOT PROVIDED'}`);
    }

    // SEND CONFIRMATION EMAIL to customer with printable confirmation
    try {
      console.log('[LeadsService] 📧 Sending printable confirmation email to:', savedLead.email);
      const emailSent = await this.emailService.sendPrintableConfirmation(savedLead);
      
      if (emailSent) {
        console.log(`[LeadsService] ✅ Printable confirmation email sent successfully to ${savedLead.email}`);
      } else {
        console.warn(`[LeadsService] ⚠️ Failed to send confirmation email to ${savedLead.email}`);
      }
    } catch (error) {
      // Log error but don't fail lead creation
      console.error('[LeadsService] ❌ Error sending confirmation email:', error.message);
      console.error('[LeadsService] Lead was created successfully, but email sending failed');
    }

    return this.findOne(savedLead.id);
  }

  /**
   * Update a lead
   */
  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    // Update lead fields
    if (updateLeadDto.name !== undefined) lead.name = updateLeadDto.name;
    if (updateLeadDto.email !== undefined) lead.email = updateLeadDto.email;
    if (updateLeadDto.phone !== undefined) lead.phone = updateLeadDto.phone;
    if (updateLeadDto.preferredLanguage) lead.preferredLanguage = updateLeadDto.preferredLanguage;
    // TEMPORARY: Disabled until schema is fixed (column doesn't exist in database)
    // if (updateLeadDto.contactPreferences !== undefined) lead.contactPreferences = updateLeadDto.contactPreferences;
    
    if (updateLeadDto.vehicleMake !== undefined) lead.vehicleMake = updateLeadDto.vehicleMake;
    if (updateLeadDto.vehicleModel !== undefined) lead.vehicleModel = updateLeadDto.vehicleModel;
    if (updateLeadDto.vehicleYear !== undefined) lead.vehicleYear = updateLeadDto.vehicleYear;
    if (updateLeadDto.vehicleColor !== undefined) lead.vehicleColor = updateLeadDto.vehicleColor;
    
    if (updateLeadDto.hasInsurance !== undefined) lead.hasInsurance = updateLeadDto.hasInsurance;
    if (updateLeadDto.insuranceProvider !== undefined) lead.insuranceProvider = updateLeadDto.insuranceProvider;
    if (updateLeadDto.claimNumber !== undefined) lead.claimNumber = updateLeadDto.claimNumber;
    
    if (updateLeadDto.accidentDescription !== undefined) lead.accidentDescription = updateLeadDto.accidentDescription;
    if (updateLeadDto.accidentDate) lead.accidentDate = new Date(updateLeadDto.accidentDate);
    if (updateLeadDto.isDrivable !== undefined) lead.isDrivable = updateLeadDto.isDrivable;
    if (updateLeadDto.needsTow !== undefined) lead.needsTow = updateLeadDto.needsTow;
    if (updateLeadDto.needsRental !== undefined) lead.needsRental = updateLeadDto.needsRental;
    if (updateLeadDto.damagePhotos) lead.damagePhotos = updateLeadDto.damagePhotos;
    
    if (updateLeadDto.source !== undefined) lead.source = updateLeadDto.source;
    if (updateLeadDto.status) lead.status = updateLeadDto.status;
    if (updateLeadDto.priority) lead.priority = updateLeadDto.priority;
    if (updateLeadDto.notes !== undefined) lead.notes = updateLeadDto.notes;
    if (updateLeadDto.estimatedValue !== undefined) lead.estimatedValue = updateLeadDto.estimatedValue;

    // Update assigned agent
    // TEMPORARY: Disabled until schema is fixed
    // if (updateLeadDto.assignedHumanAgentId) {
    //   const agent = await this.userRepository.findOne({
    //     where: { id: updateLeadDto.assignedHumanAgentId },
    //   });
    //   if (!agent) {
    //     throw new BadRequestException('Assigned agent not found');
    //   }
    //   lead.assignedHumanAgentId = agent.id;
    // }

    // Update AI fields
    if (updateLeadDto.aiQualificationScore !== undefined) {
      lead.aiQualificationScore = updateLeadDto.aiQualificationScore;
      // Recalculate priority if AI score changed and priority not explicitly set
      if (!updateLeadDto.priority) {
        lead.priority = this.calculatePriority(updateLeadDto.aiQualificationScore);
      }
    }
    if (updateLeadDto.assignedAiAgent) lead.assignedAiAgent = updateLeadDto.assignedAiAgent;

    await this.leadRepository.save(lead);

    return this.findOne(id);
  }

  /**
   * Delete a lead (set status to LOST)
   */
  async remove(id: string): Promise<{ message: string }> {
    const lead = await this.findOne(id);

    lead.status = LeadStatus.LOST;
    await this.leadRepository.save(lead);

    return { message: 'Lead marked as lost successfully' };
  }

  /**
   * Soft delete a lead (marks as deleted, keeps in database)
   * NEW METHOD - Does not modify existing remove() method
   * Associated appointments are automatically deleted via CASCADE
   * 
   * TEMPORARILY DISABLED: deletedAt field doesn't exist in production DB yet
   * Will be enabled after migration runs successfully
   */
  async softDelete(id: string): Promise<{ message: string; lead: { id: string; referenceNumber: string } }> {
    throw new BadRequestException('Soft delete temporarily disabled. Feature will be available after database migration completes.');
    
    /* COMMENTED UNTIL MIGRATION RUNS:
    console.log(`[LeadsService] Soft deleting lead: ${id}`);
    
    const lead = await this.findOne(id);

    // Validation: Don't delete if already deleted
    if (lead.deletedAt) {
      console.warn(`[LeadsService] Lead ${id} is already deleted`);
      throw new BadRequestException('Lead is already deleted');
    }

    // Validation: Don't delete converted leads (optional - you can remove this)
    if (lead.status === LeadStatus.CONVERTED) {
      console.warn(`[LeadsService] Attempt to delete converted lead ${id}`);
      throw new BadRequestException('Cannot delete converted leads. Please archive them instead.');
    }

    // Mark as deleted (soft delete)
    lead.deletedAt = new Date();
    lead.status = LeadStatus.LOST; // Also update status for clarity
    
    await this.leadRepository.save(lead);

    console.log(`[LeadsService] ✅ Lead ${id} (${lead.referenceNumber}) soft deleted successfully`);
    console.log(`[LeadsService] Associated appointments will be deleted automatically via CASCADE`);

    return {
      message: 'Lead deleted successfully',
      lead: {
        id: lead.id,
        referenceNumber: lead.referenceNumber,
      },
    };
    */
  }

  /**
   * Update lead status
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateLeadStatusDto,
  ): Promise<Lead> {
    const lead = await this.findOne(id);

    lead.status = updateStatusDto.status;

    // Add status note to notes if provided
    if (updateStatusDto.statusNote) {
      const timestamp = new Date().toISOString();
      const statusNote = `[${timestamp}] Status changed to ${updateStatusDto.status}: ${updateStatusDto.statusNote}`;
      lead.notes = lead.notes
        ? `${lead.notes}\n\n${statusNote}`
        : statusNote;
    }

    await this.leadRepository.save(lead);

    return this.findOne(id);
  }

  /**
   * Assign lead to an agent
   */
  async assignLead(id: string, assignLeadDto: AssignLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    const agent = await this.userRepository.findOne({
      where: { id: assignLeadDto.agentId },
      relations: ['roles'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Verify user has agent or admin role
    const hasAgentRole = agent.roles.some(
      (role) => role.name === 'agent' || role.name === 'admin' || role.name === 'super_admin',
    );

    if (!hasAgentRole) {
      throw new BadRequestException('User is not an agent');
    }

    // TEMPORARY: Disabled until schema is fixed
    // lead.assignedHumanAgentId = agent.id;
    await this.leadRepository.save(lead);

    return this.findOne(id);
  }

  /**
   * Qualify lead with AI score
   */
  async qualifyLead(id: string, qualifyLeadDto: QualifyLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    lead.aiQualificationScore = qualifyLeadDto.aiQualificationScore;
    lead.lastAiInteraction = new Date();

    if (qualifyLeadDto.assignedAiAgent) {
      lead.assignedAiAgent = qualifyLeadDto.assignedAiAgent;
    }

    if (qualifyLeadDto.aiConversationHistory) {
      lead.aiConversationHistory = [
        ...(lead.aiConversationHistory || []),
        ...qualifyLeadDto.aiConversationHistory,
      ];
    }

    // Recalculate priority based on new AI score
    lead.priority = this.calculatePriority(qualifyLeadDto.aiQualificationScore);

    // Auto-update status if needed
    if (lead.status === LeadStatus.NEW) {
      lead.status = LeadStatus.QUALIFIED_AI;
    }

    await this.leadRepository.save(lead);

    return this.findOne(id);
  }

  /**
   * Get lead statistics
   */
  async getStatistics() {
    const totalLeads = await this.leadRepository.count();

    const statusCounts = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    const priorityCounts = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.priority')
      .getRawMany();

    const sourceCounts = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.source')
      .getRawMany();

    const avgAiScore = await this.leadRepository
      .createQueryBuilder('lead')
      .select('AVG(lead.aiQualificationScore)', 'avgScore')
      .where('lead.aiQualificationScore IS NOT NULL')
      .getRawOne();

    return {
      totalLeads,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      byPriority: priorityCounts.reduce((acc, item) => {
        acc[item.priority] = parseInt(item.count);
        return acc;
      }, {}),
      bySource: sourceCounts.reduce((acc, item) => {
        acc[item.source] = parseInt(item.count);
        return acc;
      }, {}),
      averageAiScore: avgAiScore?.avgScore
        ? parseFloat(avgAiScore.avgScore).toFixed(2)
        : null,
    };
  }

  /**
   * Get leads assigned to a specific agent
   */
  async getAgentLeads(agentId: string, query: QueryLeadsDto) {
    return this.findAll({ ...query, assignedAgentId: agentId });
  }
}
