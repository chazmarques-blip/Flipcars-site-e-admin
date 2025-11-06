/**
 * Gallery Configuration
 * 
 * This module handles gallery-related configuration and checks.
 * When admin panel is implemented, these functions will connect to the database/API.
 */

/**
 * Check if gallery has photos (for navigation display)
 * 
 * TODO: When admin panel is ready, this should:
 * 1. Fetch from API endpoint: GET /api/gallery/count
 * 2. Or query database directly for gallery items count
 * 3. Return true if count > 0, false otherwise
 * 
 * For now, returns false to hide Gallery link until admin adds photos.
 */
export async function hasGalleryPhotos(): Promise<boolean> {
  // When implementing admin panel, replace with actual API call:
  // const response = await fetch('/api/gallery/count')
  // const { count } = await response.json()
  // return count > 0
  
  return false
}

/**
 * Get gallery photos count
 * 
 * TODO: Implement when admin panel is ready
 */
export async function getGalleryPhotosCount(): Promise<number> {
  // When implementing admin panel, replace with actual API call:
  // const response = await fetch('/api/gallery/count')
  // const { count } = await response.json()
  // return count
  
  return 0
}

/**
 * Client-side hook to check gallery status
 * 
 * Usage in components:
 * const hasPhotos = useHasGalleryPhotos()
 * 
 * TODO: Implement React hook when needed
 */
export function useHasGalleryPhotos() {
  // For now, return false
  // When admin is ready, this will be a real hook with state management
  return false
}
