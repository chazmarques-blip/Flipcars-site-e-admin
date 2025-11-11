import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@common/decorators/public.decorator';
import { SupabaseStorageService } from '@modules/storage/supabase-storage.service';

/**
 * Upload Controller for Lead Photos
 * Handles photo uploads from public estimate form
 * NOW USING SUPABASE STORAGE (persistent, not ephemeral)
 */
@Controller('public/upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly supabaseStorage: SupabaseStorageService,
  ) {}

  @Post('photo')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (after compression)
      },
      fileFilter: (req, file, callback) => {
        // Only allow images
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(`📸 Uploading photo: ${file.originalname} (${file.size} bytes)`);

    try {
      // Upload to Supabase Storage (persistent cloud storage)
      const photoUrl = await this.supabaseStorage.uploadPhoto(file);

      this.logger.log(`✅ Photo uploaded successfully to Supabase: ${photoUrl}`);

      return {
        success: true,
        message: 'Photo uploaded successfully to Supabase Storage',
        data: {
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: photoUrl, // Supabase CDN URL (permanent)
        },
      };
    } catch (error) {
      this.logger.error(`❌ Upload failed: ${error.message}`, error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Health check endpoint to verify Supabase Storage connection
   */
  @Get('storage-health')
  @Public()
  async storageHealth() {
    const isHealthy = await this.supabaseStorage.healthCheck();
    const info = await this.supabaseStorage.getStorageInfo();

    return {
      success: isHealthy,
      message: isHealthy ? 'Supabase Storage is healthy' : 'Supabase Storage has issues',
      data: info,
    };
  }
}
