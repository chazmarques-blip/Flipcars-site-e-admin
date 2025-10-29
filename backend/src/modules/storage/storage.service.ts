import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload, FileCategory } from '@database/entities/file-upload.entity';
import { FileUploadResponseDto } from './dto/upload-file.dto';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly s3Enabled: boolean;
  private readonly s3Bucket: string;
  private readonly s3Region: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
  ) {
    this.s3Bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';
    this.s3Region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.s3Enabled = !!this.s3Bucket && this.s3Bucket !== 'your-s3-bucket-name';
  }

  /**
   * Upload a file
   * TODO: Implement actual S3 upload in production
   */
  async uploadFile(
    file: Express.Multer.File,
    category: FileCategory,
    metadata?: {
      leadId?: string;
      claimId?: string;
      customerId?: string;
      description?: string;
    },
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // Generate unique file ID
    const fileId = crypto.randomUUID();
    const timestamp = Date.now();
    const sanitizedFilename = this.sanitizeFilename(file.originalname);
    const s3Key = `${category}/${timestamp}-${fileId}-${sanitizedFilename}`;

    // For now, return a mock URL (placeholder for S3)
    // In production, this would upload to S3 and return the actual URL
    const fileUrl = this.s3Enabled
      ? `https://${this.s3Bucket}.s3.${this.s3Region}.amazonaws.com/${s3Key}`
      : `http://localhost:3000/uploads/${s3Key}`;

    // Save file metadata to database
    const fileUpload = this.fileUploadRepository.create({
      fileName: sanitizedFilename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      filePath: s3Key,
      fileUrl,
      category,
      uploadedById: metadata?.customerId, // This should be the actual user ID
    });

    const savedFile = await this.fileUploadRepository.save(fileUpload);

    // TODO: Actual S3 upload would happen here
    // const s3Client = new S3Client({ region: this.s3Region });
    // await s3Client.send(new PutObjectCommand({
    //   Bucket: this.s3Bucket,
    //   Key: s3Key,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    // }));

    return {
      fileId: savedFile.id,
      fileName: savedFile.fileName,
      fileUrl: savedFile.fileUrl,
      fileSize: savedFile.fileSize,
      mimeType: savedFile.mimeType,
      category: savedFile.category,
      createdAt: savedFile.createdAt,
    };
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<FileUpload> {
    const file = await this.fileUploadRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return file;
  }

  /**
   * Generate signed URL for file access
   * TODO: Implement S3 signed URL generation
   */
  async getSignedUrl(fileId: string, expiresIn: number = 3600): Promise<string> {
    const file = await this.getFile(fileId);

    if (!this.s3Enabled) {
      // Return direct URL for local development
      return file.fileUrl;
    }

    // TODO: Generate S3 signed URL
    // const s3Client = new S3Client({ region: this.s3Region });
    // const command = new GetObjectCommand({
    //   Bucket: this.s3Bucket,
    //   Key: file.filePath,
    // });
    // return await getSignedUrl(s3Client, command, { expiresIn });

    return file.fileUrl;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<{ message: string }> {
    const file = await this.getFile(fileId);

    // TODO: Delete from S3
    // const s3Client = new S3Client({ region: this.s3Region });
    // await s3Client.send(new DeleteObjectCommand({
    //   Bucket: this.s3Bucket,
    //   Key: file.filePath,
    // }));

    await this.fileUploadRepository.remove(file);

    return { message: 'File deleted successfully' };
  }

  /**
   * Get storage statistics
   */
  async getStatistics() {
    const totalFiles = await this.fileUploadRepository.count();

    const filesByCategory = await this.fileUploadRepository
      .createQueryBuilder('file')
      .select('file.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('file.category')
      .getRawMany();

    const totalSize = await this.fileUploadRepository
      .createQueryBuilder('file')
      .select('SUM(file.fileSize)', 'totalSize')
      .getRawOne();

    return {
      totalFiles,
      byCategory: filesByCategory.reduce((acc, item) => {
        acc[item.category] = parseInt(item.count);
        return acc;
      }, {}),
      totalSizeBytes: parseInt(totalSize?.totalSize || '0'),
      totalSizeMB: (parseInt(totalSize?.totalSize || '0') / (1024 * 1024)).toFixed(2),
      s3Enabled: this.s3Enabled,
    };
  }

  /**
   * Helper: Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9.-]/gi, '_')
      .toLowerCase();
  }
}
