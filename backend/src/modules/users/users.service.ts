import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '@database/entities/user.entity';
import { Role } from '@database/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Find all users with pagination, filtering, and search
   */
  async findAll(query: QueryUsersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles');

    // Search by name or email
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Filter by status
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    // Filter by role
    if (role) {
      queryBuilder.andWhere('roles.name = :role', { role });
    }

    // Sorting
    const sortField = sortBy === 'createdAt' ? 'user.createdAt' : `user.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find a single user by ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  /**
   * Create a new user (admin only)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Get roles
    let roles: Role[] = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
      });

      if (roles.length !== createUserDto.roleIds.length) {
        throw new BadRequestException('One or more role IDs are invalid');
      }
    } else {
      // Default to customer role if no roles specified
      const customerRole = await this.roleRepository.findOne({
        where: { name: 'customer' as any },
      });
      if (customerRole) {
        roles = [customerRole];
      }
    }

    // Create user
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      language: createUserDto.language || 'en',
      status: createUserDto.status || UserStatus.ACTIVE,
      roles,
    });

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  /**
   * Update a user (admin only)
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check email uniqueness if changing email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update basic fields
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.language) user.language = updateUserDto.language;
    if (updateUserDto.status) user.status = updateUserDto.status;

    // Hash new password if provided
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update roles if provided
    if (updateUserDto.roleIds) {
      const roles = await this.roleRepository.findBy({
        id: In(updateUserDto.roleIds),
      });

      if (roles.length !== updateUserDto.roleIds.length) {
        throw new BadRequestException('One or more role IDs are invalid');
      }

      user.roles = roles;
    }

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  /**
   * Update user's own profile
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update basic profile fields
    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.phone) user.phone = updateProfileDto.phone;
    if (updateProfileDto.language) user.language = updateProfileDto.language;

    // Handle password change
    if (updateProfileDto.newPassword) {
      if (!updateProfileDto.currentPassword) {
        throw new BadRequestException('Current password is required to change password');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        updateProfileDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash new password
      user.password = await bcrypt.hash(updateProfileDto.newPassword, 10);
    }

    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  /**
   * Soft delete a user (set status to inactive)
   */
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Instead of soft delete, set status to inactive
    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);

    return { message: 'User deactivated successfully' };
  }

  /**
   * Update user status (activate/deactivate/suspend)
   */
  async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = updateStatusDto.status;
    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  /**
   * Assign roles to a user (super_admin only)
   */
  async assignRoles(id: string, assignRolesDto: AssignRolesDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validate roles
    const roles = await this.roleRepository.findBy({
      id: In(assignRolesDto.roleIds),
    });

    if (roles.length !== assignRolesDto.roleIds.length) {
      throw new BadRequestException('One or more role IDs are invalid');
    }

    // Assign new roles
    user.roles = roles;
    const savedUser = await this.userRepository.save(user);

    return this.sanitizeUser(savedUser);
  }

  /**
   * Upload user avatar (placeholder - will be implemented in Week 4 with S3)
   */
  async uploadAvatar(userId: string, file: any): Promise<{ avatarUrl: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement file upload to S3 in Week 4
    // For now, return a placeholder
    const avatarUrl = `https://placeholder.com/avatars/${userId}`;

    user.avatarUrl = avatarUrl;
    await this.userRepository.save(user);

    return { avatarUrl };
  }

  /**
   * Get user statistics
   */
  async getStatistics() {
    const totalUsers = await this.userRepository.count();

    const activeUsers = await this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });

    const inactiveUsers = await this.userRepository.count({
      where: { status: UserStatus.INACTIVE },
    });

    const suspendedUsers = await this.userRepository.count({
      where: { status: UserStatus.SUSPENDED },
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
    };
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): any {
    const { password, resetPasswordToken, resetPasswordExpires, ...sanitized } = user;
    return sanitized;
  }
}
