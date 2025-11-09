import apiClient from './client';
import { compressImage } from '@/lib/utils/image-compress';

export interface UploadPhotoResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
  };
}

export const uploadService = {
  /**
   * Upload a photo to the server
   * Automatically compresses the image before uploading
   * @param file - The image file to upload
   * @returns Upload response with file URL
   */
  async uploadPhoto(file: File): Promise<UploadPhotoResponse> {
    console.log('[UploadService] 📸 Starting photo upload:', file.name);
    
    try {
      // Step 1: Compress the image
      console.log('[UploadService] 🔄 Compressing image...');
      const compressedFile = await compressImage(file, {
        maxSizeMB: 0.3, // 300KB max
        maxWidthOrHeight: 1920,
        quality: 0.8,
      });
      
      // Step 2: Create form data
      const formData = new FormData();
      formData.append('file', compressedFile);
      
      // Step 3: Upload to server
      console.log('[UploadService] ⬆️  Uploading to server...');
      const response = await apiClient.post<UploadPhotoResponse>(
        '/public/upload/photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('[UploadService] ✅ Upload successful:', response.data.data.url);
      return response.data;
    } catch (error: any) {
      console.error('[UploadService] ❌ Upload failed:', error);
      
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      
      throw error;
    }
  },

  /**
   * Upload multiple photos
   * @param files - Array of image files
   * @returns Array of upload responses
   */
  async uploadPhotos(files: File[]): Promise<UploadPhotoResponse[]> {
    console.log(`[UploadService] 🖼️  Uploading ${files.length} photos...`);
    
    const uploads = await Promise.all(
      files.map((file) => this.uploadPhoto(file))
    );
    
    console.log(`[UploadService] ✅ All ${files.length} photos uploaded successfully`);
    return uploads;
  },
};
