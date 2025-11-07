import { PHOTO_CONFIG } from '@/types/estimate';

/**
 * Compress an image file to reduce size
 * @param file Original image file
 * @param maxDimension Maximum width or height
 * @param quality Compression quality (0-1)
 * @returns Compressed image as base64 string
 */
export async function compressImage(
  file: File,
  maxDimension: number = PHOTO_CONFIG.maxDimension,
  quality: number = PHOTO_CONFIG.compressionQuality
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxDimension) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file type and size
 * @param file Image file to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!PHOTO_CONFIG.acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Please upload ${PHOTO_CONFIG.acceptedFormats.join(', ')}`,
    };
  }
  
  // Check file size
  if (file.size > PHOTO_CONFIG.maxSizeBytes) {
    const maxMB = PHOTO_CONFIG.maxSizeBytes / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxMB}MB limit`,
    };
  }
  
  return { valid: true };
}

/**
 * Handle photo upload from input or camera
 * @param file Image file from input
 * @returns Base64 encoded compressed image
 */
export async function handlePhotoUpload(file: File): Promise<string> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Compress and return
  return await compressImage(file);
}

/**
 * Format photo labels for display
 */
export const PHOTO_LABELS = {
  driverFront: 'Driver Front',
  passengerFront: 'Passenger Front',
  driverRear: 'Driver Rear',
  passengerRear: 'Passenger Rear',
  vinNumber: 'VIN Number',
  odometer: 'Odometer',
  detail1: 'Detail 1',
  detail2: 'Detail 2',
  detail3: 'Detail 3',
  detail4: 'Detail 4',
  detail5: 'Detail 5',
  detail6: 'Detail 6',
} as const;
