import { useEffect } from 'react'

/**
 * Hook to set page title dynamically
 * Automatically appends " | FlipCars 2.0" to the title
 * 
 * @param title - Page title
 * 
 * @example
 * usePageTitle('Dashboard')
 * // Sets document.title to "Dashboard | FlipCars 2.0"
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} | FlipCars 2.0` : 'FlipCars 2.0 - Admin Dashboard'
    
    return () => {
      document.title = prevTitle
    }
  }, [title])
}
