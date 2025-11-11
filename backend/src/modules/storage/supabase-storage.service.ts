import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'lead-photos';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('❌ Supabase credentials not configured!');
      throw new Error('Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.logger.log('✅ Supabase Storage Service initialized');
    this.logger.log(`📦 Bucket: ${this.bucketName}`);
    this.logger.log(`🔗 URL: ${supabaseUrl}`);
  }

  /**
   * Upload a photo to Supabase Storage
   * @param file Express.Multer.File
   * @returns Public URL of uploaded file
   */
  async uploadPhoto(file: Express.Multer.File): Promise<string> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.round(Math.random() * 1e9);
      const extension = file.originalname.split('.').pop() || 'jpg';
      const filename = `${timestamp}-${randomId}.${extension}`;
      const path = `${filename}`;

      this.logger.log(`📤 Uploading photo: ${filename} (${file.size} bytes)`);

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // Don't overwrite existing files
          cacheControl: '3600', // Cache for 1 hour
        });

      if (error) {
        this.logger.error(`❌ Upload failed: ${error.message}`, error);
        throw new InternalServerErrorException(`Failed to upload photo: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl;

      this.logger.log(`✅ Photo uploaded successfully: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      this.logger.error('❌ Error uploading photo to Supabase', error);
      throw new InternalServerErrorException('Failed to upload photo');
    }
  }

  /**
   * Delete a photo from Supabase Storage
   * @param photoUrl Full URL or path to photo
   */
  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const filename = photoUrl.split('/').pop();
      
      if (!filename) {
        this.logger.warn(`⚠️ Could not extract filename from URL: ${photoUrl}`);
        return;
      }

      this.logger.log(`🗑️ Deleting photo: ${filename}`);

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filename]);

      if (error) {
        this.logger.error(`❌ Delete failed: ${error.message}`, error);
        throw new InternalServerErrorException(`Failed to delete photo: ${error.message}`);
      }

      this.logger.log(`✅ Photo deleted successfully: ${filename}`);
    } catch (error) {
      this.logger.error('❌ Error deleting photo from Supabase', error);
      // Don't throw - deletion is not critical
    }
  }

  /**
   * Check if Supabase Storage is properly configured
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to list buckets as a health check
      const { data, error } = await this.supabase.storage.listBuckets();

      if (error) {
        this.logger.error(`❌ Health check failed: ${error.message}`);
        return false;
      }

      const bucketExists = data?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        this.logger.warn(`⚠️ Bucket '${this.bucketName}' not found!`);
        this.logger.warn('Please create the bucket in Supabase Dashboard:');
        this.logger.warn('1. Go to Storage');
        this.logger.warn('2. Create new bucket: "lead-photos"');
        this.logger.warn('3. Set as PUBLIC');
        return false;
      }

      this.logger.log(`✅ Health check passed - bucket '${this.bucketName}' exists`);
      return true;
    } catch (error) {
      this.logger.error('❌ Health check error', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageInfo() {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucket = buckets?.find(b => b.name === this.bucketName);

      return {
        bucketName: this.bucketName,
        bucketExists: !!bucket,
        bucketPublic: bucket?.public || false,
      };
    } catch (error) {
      this.logger.error('Error getting storage info', error);
      return {
        bucketName: this.bucketName,
        bucketExists: false,
        bucketPublic: false,
        error: error.message,
      };
    }
  }
}
