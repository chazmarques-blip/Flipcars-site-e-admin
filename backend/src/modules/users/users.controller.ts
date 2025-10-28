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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@database/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users with pagination, filtering, and search
   * Accessible by: admin, agent
   */
  @Get()
  @Roles('admin', 'agent', 'super_admin')
  async findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  /**
   * Get user statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.usersService.getStatistics();
  }

  /**
   * Get current user profile
   * Accessible by: all authenticated users
   */
  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  /**
   * Update current user profile
   * Accessible by: all authenticated users
   */
  @Put('me')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  /**
   * Upload avatar for current user
   * Accessible by: all authenticated users
   */
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: any,
  ) {
    return this.usersService.uploadAvatar(user.id, file);
  }

  /**
   * Get a single user by ID
   * Accessible by: admin, agent, super_admin
   */
  @Get(':id')
  @Roles('admin', 'agent', 'super_admin')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Create a new user
   * Accessible by: admin, super_admin
   */
  @Post()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update a user
   * Accessible by: admin, super_admin
   */
  @Put(':id')
  @Roles('admin', 'super_admin')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Update user status (activate/deactivate/suspend)
   * Accessible by: admin, super_admin
   */
  @Patch(':id/status')
  @Roles('admin', 'super_admin')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateStatusDto);
  }

  /**
   * Assign roles to a user
   * Accessible by: super_admin only
   */
  @Patch(':id/roles')
  @Roles('super_admin')
  async assignRoles(
    @Param('id') id: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return this.usersService.assignRoles(id, assignRolesDto);
  }

  /**
   * Delete a user (soft delete)
   * Accessible by: admin, super_admin
   */
  @Delete(':id')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
