import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@database/entities/customer.entity';
import { User } from '@database/entities/user.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomersDto } from './dto/query-customers.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Find all customers with pagination, filtering, and search
   */
  async findAll(query: QueryCustomersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      state,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('customer.vehicles', 'vehicles');
      // TEMPORARY: Disabled until schema is fixed
      // .leftJoinAndSelect('customer.leads', 'leads');

    // Search by name, email, or phone
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(customer.name) LIKE LOWER(:search) OR ' +
          'LOWER(customer.email) LIKE LOWER(:search) OR ' +
          'LOWER(customer.phone) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Filter by city
    if (city) {
      queryBuilder.andWhere('LOWER(customer.city) = LOWER(:city)', { city });
    }

    // Filter by state
    if (state) {
      queryBuilder.andWhere('LOWER(customer.state) = LOWER(:state)', { state });
    }

    // Sorting
    const sortField = sortBy === 'createdAt' ? 'customer.createdAt' : `customer.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [customers, total] = await queryBuilder.getManyAndCount();

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single customer by ID
   */
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['user', 'vehicles', 'leads', 'claims'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  /**
   * Find customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { email },
      relations: ['user', 'vehicles', 'leads'],
    });
  }

  /**
   * Create a new customer
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if customer already exists by email
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    // Validate user if userId provided
    if (createCustomerDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createCustomerDto.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    // Create customer
    const customer = this.customerRepository.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone,
      alternatePhone: createCustomerDto.alternatePhone,
      address: createCustomerDto.address,
      city: createCustomerDto.city,
      state: createCustomerDto.state,
      zipCode: createCustomerDto.zipCode,
      preferredLanguage: createCustomerDto.preferredLanguage || 'en',
      notes: createCustomerDto.notes,
      communicationPreferences: createCustomerDto.communicationPreferences || {},
      userId: createCustomerDto.userId,
    });

    const savedCustomer = await this.customerRepository.save(customer);

    return this.findOne(savedCustomer.id);
  }

  /**
   * Update a customer
   */
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    // Check email uniqueness if changing email
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });
      if (existingCustomer) {
        throw new ConflictException('Email already in use');
      }
    }

    // Validate user if userId provided
    if (updateCustomerDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateCustomerDto.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    // Update fields
    if (updateCustomerDto.name !== undefined) customer.name = updateCustomerDto.name;
    if (updateCustomerDto.email !== undefined) customer.email = updateCustomerDto.email;
    if (updateCustomerDto.phone !== undefined) customer.phone = updateCustomerDto.phone;
    if (updateCustomerDto.alternatePhone !== undefined)
      customer.alternatePhone = updateCustomerDto.alternatePhone;
    if (updateCustomerDto.address !== undefined) customer.address = updateCustomerDto.address;
    if (updateCustomerDto.city !== undefined) customer.city = updateCustomerDto.city;
    if (updateCustomerDto.state !== undefined) customer.state = updateCustomerDto.state;
    if (updateCustomerDto.zipCode !== undefined) customer.zipCode = updateCustomerDto.zipCode;
    if (updateCustomerDto.preferredLanguage)
      customer.preferredLanguage = updateCustomerDto.preferredLanguage;
    if (updateCustomerDto.notes !== undefined) customer.notes = updateCustomerDto.notes;
    if (updateCustomerDto.communicationPreferences) {
      customer.communicationPreferences = {
        ...customer.communicationPreferences,
        ...updateCustomerDto.communicationPreferences,
      };
    }
    if (updateCustomerDto.userId !== undefined) customer.userId = updateCustomerDto.userId;

    await this.customerRepository.save(customer);

    return this.findOne(id);
  }

  /**
   * Delete a customer (should rarely be used - consider archiving instead)
   */
  async remove(id: string): Promise<{ message: string }> {
    const customer = await this.findOne(id);

    // Check if customer has active leads or claims
    // TEMPORARY: Disabled until schema is fixed
    // if (customer.leads && customer.leads.length > 0) {
    //   throw new BadRequestException(
    //     'Cannot delete customer with existing leads. Archive instead.',
    //   );
    // }

    if (customer.claims && customer.claims.length > 0) {
      throw new BadRequestException(
        'Cannot delete customer with existing claims. Archive instead.',
      );
    }

    await this.customerRepository.remove(customer);

    return { message: 'Customer deleted successfully' };
  }

  /**
   * Get customer statistics
   */
  async getStatistics() {
    const totalCustomers = await this.customerRepository.count();

    // TEMPORARY: Disabled until schema is fixed
    const customersWithLeads = 0;
    // const customersWithLeads = await this.customerRepository
    //   .createQueryBuilder('customer')
    //   .leftJoin('customer.leads', 'leads')
    //   .where('leads.id IS NOT NULL')
    //   .getCount();

    const customersWithClaims = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.claims', 'claims')
      .where('claims.id IS NOT NULL')
      .getCount();

    const customersByState = await this.customerRepository
      .createQueryBuilder('customer')
      .select('customer.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .where('customer.state IS NOT NULL')
      .groupBy('customer.state')
      .getRawMany();

    return {
      totalCustomers,
      customersWithLeads,
      customersWithClaims,
      byState: customersByState.reduce((acc, item) => {
        acc[item.state] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  /**
   * Get customer's complete history (leads, vehicles, claims)
   */
  async getCustomerHistory(id: string) {
    const customer = await this.findOne(id);

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
      },
      // TEMPORARY: Disabled until schema is fixed
      leads: [], // customer.leads || [],
      vehicles: customer.vehicles || [],
      claims: customer.claims || [],
    };
  }
}
