import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '@common/decorators/public.decorator';

/**
 * Upload Controller for Lead Photos
 * Handles photo uploads from public estimate form
 */
@Controller('public/upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  @Post('photo')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/lead-photos',
        filename: (req, file, callback) => {
          // Generate unique filename: timestamp-random-originalname
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
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

    this.logger.log(`📸 Photo uploaded: ${file.filename} (${file.size} bytes)`);

    // Return the BACKEND URL to access the file
    // Frontend will proxy through API URL
    const backendUrl = process.env.BACKEND_URL || 'https://upbeat-dedication-production.up.railway.app';
    const fileUrl = `${backendUrl}/uploads/lead-photos/${file.filename}`;

    return {
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
      },
    };
  }
}
