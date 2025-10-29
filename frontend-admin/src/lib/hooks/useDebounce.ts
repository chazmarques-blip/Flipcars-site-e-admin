import { useEffect, useState } from 'react'

/**
 * Hook to debounce a value
 * Useful for search inputs, API calls, etc.
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // This will only run 500ms after user stops typing
 *   searchAPI(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook to throttle a function
 * Useful for scroll events, resize events, etc.
 * 
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Throttled function
 * 
 * @example
 * const throttledScroll = useThrottle(() => {
 *   console.log('Scrolled!')
 * }, 200)
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScroll)
 *   return () => window.removeEventListener('scroll', throttledScroll)
 * }, [throttledScroll])
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 500
): T {
  const [lastRun, setLastRun] = useState(Date.now())

  return ((...args: unknown[]) => {
    const now = Date.now()
    
    if (now - lastRun >= delay) {
      setLastRun(now)
      callback(...args)
    }
  }) as T
}
