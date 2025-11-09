import imageCompression from 'browser-image-compression';

export interface CompressImageOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

/**
 * Compress and resize an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.3, // 300KB max
    maxWidthOrHeight: 1920, // Max 1920px
    useWebWorker: true,
    quality: 0.8, // 80% quality
    ...options,
  };

  try {
    console.log(`[ImageCompress] 📸 Original file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const compressedFile = await imageCompression(file, defaultOptions);
    
    console.log(`[ImageCompress] ✅ Compressed: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);
    console.log(`[ImageCompress] 📉 Reduction: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
    
    return compressedFile;
  } catch (error) {
    console.error('[ImageCompress] ❌ Compression failed:', error);
    throw error;
  }
}

/**
 * Compress multiple images
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  options: CompressImageOptions = {}
): Promise<File[]> {
  console.log(`[ImageCompress] 🖼️  Compressing ${files.length} images...`);
  
  const compressedFiles = await Promise.all(
    files.map((file) => compressImage(file, options))
  );
  
  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
  
  console.log(`[ImageCompress] ✅ Total compression: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`[ImageCompress] 📦 Total size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)}MB`);
  
  return compressedFiles;
}
