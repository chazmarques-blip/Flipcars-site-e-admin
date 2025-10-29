import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FileCategory } from '@database/entities/file-upload.entity';

export class UploadFileDto {
  @IsEnum(FileCategory)
  category: FileCategory;

  @IsString()
  @IsOptional()
  leadId?: string;

  @IsString()
  @IsOptional()
  claimId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class FileUploadResponseDto {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: string;
  createdAt: Date;
}
