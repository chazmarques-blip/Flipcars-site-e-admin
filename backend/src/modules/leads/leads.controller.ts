import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadsDto } from './dto/query-leads.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-status.dto';
import { QualifyLeadDto } from './dto/qualify-lead.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@database/entities/user.entity';
import { Public } from '@common/decorators/public.decorator';

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Get all leads with pagination, filtering, and search
   * Accessible by: admin, agent, super_admin
   */
  @Get()
  @Roles('admin', 'agent', 'super_admin')
  async findAll(@Query() query: QueryLeadsDto) {
    return this.leadsService.findAll(query);
  }

  /**
   * Get lead statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.leadsService.getStatistics();
  }

  /**
   * Get leads assigned to current agent
   * Accessible by: agent, admin, super_admin
   */
  @Get('my-leads')
  @Roles('agent', 'admin', 'super_admin')
  async getMyLeads(@CurrentUser() user: User, @Query() query: QueryLeadsDto) {
    return this.leadsService.getAgentLeads(user.id, query);
  }

  /**
   * Get lead by reference number
   * Accessible by: admin, agent, super_admin, customer (if owns the lead)
   */
  @Get('reference/:referenceNumber')
  @Roles('admin', 'agent', 'super_admin', 'customer')
  async findByReferenceNumber(@Param('referenceNumber') referenceNumber: string) {
    return this.leadsService.findByReferenceNumber(referenceNumber);
  }

  /**
   * Get a single lead by ID
   * Accessible by: admin, agent, super_admin, customer (if owns the lead)
   */
  @Get(':id')
  @Roles('admin', 'agent', 'super_admin', 'customer')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  /**
   * Create a new lead
   * Accessible by: admin, agent, super_admin, or public (for web form submissions)
   */
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  /**
   * Update a lead
   * Accessible by: admin, agent (if assigned), super_admin
   */
  @Put(':id')
  @Roles('admin', 'agent', 'super_admin')
  async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  /**
   * Update lead status
   * Accessible by: admin, agent (if assigned), super_admin
   */
  @Patch(':id/status')
  @Roles('admin', 'agent', 'super_admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, updateStatusDto);
  }

  /**
   * Assign lead to an agent
   * Accessible by: admin, super_admin
   */
  @Patch(':id/assign')
  @Roles('admin', 'super_admin')
  async assignLead(@Param('id') id: string, @Body() assignLeadDto: AssignLeadDto) {
    return this.leadsService.assignLead(id, assignLeadDto);
  }

  /**
   * Qualify lead with AI score
   * Accessible by: admin, super_admin, or internal AI system
   */
  @Patch(':id/qualify')
  @Roles('admin', 'super_admin')
  async qualifyLead(@Param('id') id: string, @Body() qualifyLeadDto: QualifyLeadDto) {
    return this.leadsService.qualifyLead(id, qualifyLeadDto);
  }

  /**
   * Delete a lead (mark as lost)
   * Accessible by: admin, super_admin
   */
  @Delete(':id')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  /**
   * DEBUG ENDPOINT - Get leads count (public, temporary)
   */
  @Get('debug/count')
  @Public()
  async debugCount() {
    try {
      const result = await this.leadsService.findAll({ page: 1, limit: 1 });
      return {
        totalLeads: result.pagination?.total || 0,
        canConnect: true,
        message: 'Database connection OK'
      };
    } catch (error) {
      return {
        totalLeads: 0,
        canConnect: false,
        error: error.message,
        stack: error.stack,
        name: error.name,
        message: 'Database connection FAILED'
      };
    }
  }

  /**
   * DEBUG ENDPOINT - Get raw SQL query (public, temporary)
   */
  @Get('debug/sql')
  @Public()
  async debugSql() {
    return this.leadsService.getDebugSql();
  }

  /**
   * EMERGENCY ENDPOINT - Create sample leads if database is empty
   */
  @Post('emergency/create-samples')
  @Public()
  async createSampleLeads() {
    try {
      const existing = await this.leadsService.findAll({ page: 1, limit: 1 });
      
      if (existing.pagination?.total > 0) {
        return {
          success: false,
          message: 'Leads already exist in database',
          total: existing.pagination.total
        };
      }

      // Create 3 sample leads
      const samples = [
        {
          name: 'John Smith',
          phone: '+1234567890',
          email: 'john.smith@example.com',
          preferredLanguage: 'en',
          vehicleYear: '2020',
          vehicleMake: 'Toyota',
          vehicleModel: 'Camry',
          vehicleColor: 'Blue',
          hasInsurance: true,
          isDrivable: true,
          source: 'website'
        },
        {
          name: 'Maria Garcia',
          phone: '+1987654321',
          email: 'maria.garcia@example.com',
          preferredLanguage: 'en',
          vehicleYear: '2019',
          vehicleMake: 'Honda',
          vehicleModel: 'Civic',
          vehicleColor: 'Red',
          hasInsurance: false,
          isDrivable: true,
          source: 'referral'
        },
        {
          name: 'Robert Johnson',
          phone: '+1555555555',
          email: 'robert.j@example.com',
          preferredLanguage: 'en',
          vehicleYear: '2021',
          vehicleMake: 'Ford',
          vehicleModel: 'F-150',
          vehicleColor: 'Black',
          hasInsurance: true,
          isDrivable: false,
          source: 'website'
        }
      ];

      const created = [];
      for (const sample of samples) {
        const lead = await this.leadsService.create(sample);
        created.push(lead.referenceNumber);
      }

      return {
        success: true,
        message: 'Sample leads created successfully',
        created: created.length,
        references: created
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }
}
