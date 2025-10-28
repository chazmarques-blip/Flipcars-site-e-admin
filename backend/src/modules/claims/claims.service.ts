import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Claim, ClaimStatus } from '@database/entities/claim.entity';
import { Customer } from '@database/entities/customer.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { User } from '@database/entities/user.entity';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { QueryClaimsDto } from './dto/query-claims.dto';
import { UpdateClaimStatusDto } from './dto/update-status.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Generate unique claim number (CLM-YYYYMMDD-XXXX)
   */
  private async generateClaimNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const prefix = `CLM-${year}${month}${day}`;

    // Get count of claims created today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.claimRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }

  /**
   * Find all claims with pagination, filtering, and search
   */
  async findAll(query: QueryClaimsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customerId,
      assignedAgentId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.claimRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.customer', 'customer')
      .leftJoinAndSelect('claim.vehicle', 'vehicle')
      .leftJoinAndSelect('claim.assignedAgent', 'agent');

    // Search by claim number or customer name
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(claim.claimNumber) LIKE LOWER(:search) OR ' +
          'LOWER(customer.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Filter by status
    if (status) {
      queryBuilder.andWhere('claim.status = :status', { status });
    }

    // Filter by customer
    if (customerId) {
      queryBuilder.andWhere('claim.customerId = :customerId', { customerId });
    }

    // Filter by assigned agent
    if (assignedAgentId) {
      queryBuilder.andWhere('claim.assignedAgentId = :assignedAgentId', {
        assignedAgentId,
      });
    }

    // Sorting
    const sortField = sortBy === 'createdAt' ? 'claim.createdAt' : `claim.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [claims, total] = await queryBuilder.getManyAndCount();

    return {
      data: claims,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single claim by ID
   */
  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { id },
      relations: ['customer', 'vehicle', 'assignedAgent', 'timeline', 'documents'],
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    return claim;
  }

  /**
   * Find claim by claim number
   */
  async findByClaimNumber(claimNumber: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { claimNumber },
      relations: ['customer', 'vehicle', 'assignedAgent', 'timeline', 'documents'],
    });

    if (!claim) {
      throw new NotFoundException(
        `Claim with number ${claimNumber} not found`,
      );
    }

    return claim;
  }

  /**
   * Create a new claim
   */
  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    // Validate customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: createClaimDto.customerId },
    });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    // Validate vehicle exists
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createClaimDto.vehicleId },
    });
    if (!vehicle) {
      throw new BadRequestException('Vehicle not found');
    }

    // Validate assigned agent if provided
    if (createClaimDto.assignedAgentId) {
      const agent = await this.userRepository.findOne({
        where: { id: createClaimDto.assignedAgentId },
      });
      if (!agent) {
        throw new BadRequestException('Assigned agent not found');
      }
    }

    // Generate claim number
    const claimNumber = await this.generateClaimNumber();

    // Create claim
    const claim = this.claimRepository.create({
      claimNumber,
      customerId: createClaimDto.customerId,
      vehicleId: createClaimDto.vehicleId,
      description: createClaimDto.description,
      insuranceCompany: createClaimDto.insuranceCompany,
      insuranceClaimNumber: createClaimDto.insuranceClaimNumber,
      estimatedCost: createClaimDto.estimatedCost,
      finalCost: createClaimDto.finalCost,
      status: createClaimDto.status || ClaimStatus.OPEN,
      assignedAgentId: createClaimDto.assignedAgentId,
      dropOffDate: createClaimDto.dropOffDate
        ? new Date(createClaimDto.dropOffDate)
        : undefined,
      estimatedCompletionDate: createClaimDto.estimatedCompletionDate
        ? new Date(createClaimDto.estimatedCompletionDate)
        : undefined,
      actualCompletionDate: createClaimDto.actualCompletionDate
        ? new Date(createClaimDto.actualCompletionDate)
        : undefined,
      notes: createClaimDto.notes,
    });

    const savedClaim = await this.claimRepository.save(claim);

    return this.findOne(savedClaim.id);
  }

  /**
   * Update a claim
   */
  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<Claim> {
    const claim = await this.findOne(id);

    // Validate assigned agent if provided
    if (updateClaimDto.assignedAgentId) {
      const agent = await this.userRepository.findOne({
        where: { id: updateClaimDto.assignedAgentId },
      });
      if (!agent) {
        throw new BadRequestException('Assigned agent not found');
      }
    }

    // Update fields
    if (updateClaimDto.description !== undefined)
      claim.description = updateClaimDto.description;
    if (updateClaimDto.insuranceCompany !== undefined)
      claim.insuranceCompany = updateClaimDto.insuranceCompany;
    if (updateClaimDto.insuranceClaimNumber !== undefined)
      claim.insuranceClaimNumber = updateClaimDto.insuranceClaimNumber;
    if (updateClaimDto.estimatedCost !== undefined)
      claim.estimatedCost = updateClaimDto.estimatedCost;
    if (updateClaimDto.finalCost !== undefined)
      claim.finalCost = updateClaimDto.finalCost;
    if (updateClaimDto.status) claim.status = updateClaimDto.status;
    if (updateClaimDto.assignedAgentId !== undefined)
      claim.assignedAgentId = updateClaimDto.assignedAgentId;
    if (updateClaimDto.dropOffDate)
      claim.dropOffDate = new Date(updateClaimDto.dropOffDate);
    if (updateClaimDto.estimatedCompletionDate)
      claim.estimatedCompletionDate = new Date(updateClaimDto.estimatedCompletionDate);
    if (updateClaimDto.actualCompletionDate)
      claim.actualCompletionDate = new Date(updateClaimDto.actualCompletionDate);
    if (updateClaimDto.notes !== undefined) claim.notes = updateClaimDto.notes;

    await this.claimRepository.save(claim);

    return this.findOne(id);
  }

  /**
   * Delete a claim (set status to CANCELLED)
   */
  async remove(id: string): Promise<{ message: string }> {
    const claim = await this.findOne(id);

    claim.status = ClaimStatus.CANCELLED;
    await this.claimRepository.save(claim);

    return { message: 'Claim cancelled successfully' };
  }

  /**
   * Update claim status
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateClaimStatusDto,
  ): Promise<Claim> {
    const claim = await this.findOne(id);

    claim.status = updateStatusDto.status;

    // Add status note to notes if provided
    if (updateStatusDto.statusNote) {
      const timestamp = new Date().toISOString();
      const statusNote = `[${timestamp}] Status changed to ${updateStatusDto.status}: ${updateStatusDto.statusNote}`;
      claim.notes = claim.notes ? `${claim.notes}\n\n${statusNote}` : statusNote;
    }

    // Auto-set actual completion date if status is COMPLETED
    if (updateStatusDto.status === ClaimStatus.COMPLETED && !claim.actualCompletionDate) {
      claim.actualCompletionDate = new Date();
    }

    await this.claimRepository.save(claim);

    return this.findOne(id);
  }

  /**
   * Get claim statistics
   */
  async getStatistics() {
    const totalClaims = await this.claimRepository.count();

    const statusCounts = await this.claimRepository
      .createQueryBuilder('claim')
      .select('claim.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('claim.status')
      .getRawMany();

    const avgEstimatedCost = await this.claimRepository
      .createQueryBuilder('claim')
      .select('AVG(claim.estimatedCost)', 'avgCost')
      .where('claim.estimatedCost IS NOT NULL')
      .getRawOne();

    const avgFinalCost = await this.claimRepository
      .createQueryBuilder('claim')
      .select('AVG(claim.finalCost)', 'avgCost')
      .where('claim.finalCost IS NOT NULL')
      .getRawOne();

    return {
      totalClaims,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      averageEstimatedCost: avgEstimatedCost?.avgCost
        ? parseFloat(avgEstimatedCost.avgCost).toFixed(2)
        : null,
      averageFinalCost: avgFinalCost?.avgCost
        ? parseFloat(avgFinalCost.avgCost).toFixed(2)
        : null,
    };
  }

  /**
   * Get claims assigned to a specific agent
   */
  async getAgentClaims(agentId: string, query: QueryClaimsDto) {
    return this.findAll({ ...query, assignedAgentId: agentId });
  }
}
