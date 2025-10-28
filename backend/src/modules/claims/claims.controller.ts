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
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { QueryClaimsDto } from './dto/query-claims.dto';
import { UpdateClaimStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@database/entities/user.entity';

@Controller('claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  /**
   * Get all claims with pagination, filtering, and search
   * Accessible by: admin, agent, super_admin
   */
  @Get()
  @Roles('admin', 'agent', 'super_admin')
  async findAll(@Query() query: QueryClaimsDto) {
    return this.claimsService.findAll(query);
  }

  /**
   * Get claim statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.claimsService.getStatistics();
  }

  /**
   * Get claims assigned to current agent
   * Accessible by: agent, admin, super_admin
   */
  @Get('my-claims')
  @Roles('agent', 'admin', 'super_admin')
  async getMyClaims(@CurrentUser() user: User, @Query() query: QueryClaimsDto) {
    return this.claimsService.getAgentClaims(user.id, query);
  }

  /**
   * Get claim by claim number
   * Accessible by: admin, agent, super_admin, customer (if owns the claim)
   */
  @Get('number/:claimNumber')
  @Roles('admin', 'agent', 'super_admin', 'customer')
  async findByClaimNumber(@Param('claimNumber') claimNumber: string) {
    return this.claimsService.findByClaimNumber(claimNumber);
  }

  /**
   * Get a single claim by ID
   * Accessible by: admin, agent, super_admin, customer (if owns the claim)
   */
  @Get(':id')
  @Roles('admin', 'agent', 'super_admin', 'customer')
  async findOne(@Param('id') id: string) {
    return this.claimsService.findOne(id);
  }

  /**
   * Create a new claim
   * Accessible by: admin, agent, super_admin
   */
  @Post()
  @Roles('admin', 'agent', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto);
  }

  /**
   * Update a claim
   * Accessible by: admin, agent (if assigned), super_admin
   */
  @Put(':id')
  @Roles('admin', 'agent', 'super_admin')
  async update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(id, updateClaimDto);
  }

  /**
   * Update claim status
   * Accessible by: admin, agent (if assigned), super_admin
   */
  @Patch(':id/status')
  @Roles('admin', 'agent', 'super_admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateClaimStatusDto,
  ) {
    return this.claimsService.updateStatus(id, updateStatusDto);
  }

  /**
   * Delete a claim (set status to CANCELLED)
   * Accessible by: admin, super_admin
   */
  @Delete(':id')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.claimsService.remove(id);
  }
}
