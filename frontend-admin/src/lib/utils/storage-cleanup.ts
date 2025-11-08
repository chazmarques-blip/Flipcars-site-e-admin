/**
 * Storage Cleanup Utility
 * Clears old/corrupted localStorage data to prevent hydration errors
 */

const STORAGE_VERSION_KEY = 'flipcars-storage-version';
const CURRENT_VERSION = '2.0';

export function cleanupOldStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    // If version doesn't match or doesn't exist, clear all auth storage
    if (storedVersion !== CURRENT_VERSION) {
      console.log('[StorageCleanup] Detected old storage version, cleaning up...');
      
      // Remove old auth storage
      localStorage.removeItem('auth-storage');
      
      // Remove any other potentially corrupted keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('auth')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        console.log(`[StorageCleanup] Removing key: ${key}`);
        localStorage.removeItem(key);
      });
      
      // Set new version
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      console.log('[StorageCleanup] Storage cleaned and version updated to', CURRENT_VERSION);
    }
  } catch (error) {
    console.error('[StorageCleanup] Error during cleanup:', error);
    // If cleanup fails, try to clear everything as last resort
    try {
      localStorage.clear();
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    } catch (clearError) {
      console.error('[StorageCleanup] Failed to clear storage:', clearError);
    }
  }
}
