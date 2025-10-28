import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Get all customers with pagination, filtering, and search
   * Accessible by: admin, agent, super_admin
   */
  @Get()
  @Roles('admin', 'agent', 'super_admin')
  async findAll(@Query() query: QueryCustomersDto) {
    return this.customersService.findAll(query);
  }

  /**
   * Get customer statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.customersService.getStatistics();
  }

  /**
   * Get customer by ID
   * Accessible by: admin, agent, super_admin, customer (if owns the record)
   */
  @Get(':id')
  @Roles('admin', 'agent', 'super_admin', 'customer')
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  /**
   * Get customer history (leads, vehicles, claims)
   * Accessible by: admin, agent, super_admin
   */
  @Get(':id/history')
  @Roles('admin', 'agent', 'super_admin')
  async getHistory(@Param('id') id: string) {
    return this.customersService.getCustomerHistory(id);
  }

  /**
   * Create a new customer
   * Accessible by: admin, agent, super_admin
   */
  @Post()
  @Roles('admin', 'agent', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  /**
   * Update a customer
   * Accessible by: admin, agent, super_admin
   */
  @Put(':id')
  @Roles('admin', 'agent', 'super_admin')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  /**
   * Delete a customer (rarely used - prefer archiving)
   * Accessible by: super_admin only
   */
  @Delete(':id')
  @Roles('super_admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
