import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Public } from '@common/decorators/public.decorator';

@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  /**
   * Upload a file
   * Accessible by: authenticated users
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile() file: any,
    @Body() uploadDto: UploadFileDto,
  ) {
    return this.storageService.uploadFile(file, uploadDto.category, {
      leadId: uploadDto.leadId,
      claimId: uploadDto.claimId,
      customerId: uploadDto.customerId,
      description: uploadDto.description,
    });
  }

  /**
   * Get file metadata
   * Accessible by: authenticated users
   */
  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string) {
    return this.storageService.getFile(fileId);
  }

  /**
   * Get signed URL for file access
   * Accessible by: authenticated users
   */
  @Get(':fileId/signed-url')
  async getSignedUrl(@Param('fileId') fileId: string) {
    const url = await this.storageService.getSignedUrl(fileId);
    return { url };
  }

  /**
   * Delete a file
   * Accessible by: admin, super_admin
   */
  @Delete(':fileId')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('fileId') fileId: string) {
    return this.storageService.deleteFile(fileId);
  }

  /**
   * Get storage statistics
   * Accessible by: admin, super_admin
   */
  @Get('statistics')
  @Roles('admin', 'super_admin')
  async getStatistics() {
    return this.storageService.getStatistics();
  }
}
