import { useEffect, useRef, useState } from 'react'

interface UseLazyLoadOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * Hook for lazy loading elements using Intersection Observer
 * @param options - Intersection Observer options
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useLazyLoad<T extends Element>(
  options: UseLazyLoadOptions = {}
): [React.RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        root: options.root,
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.root, options.rootMargin, options.threshold])

  return [ref, isVisible]
}

/**
 * Hook for detecting when an element is in viewport
 * @param options - Intersection Observer options
 * @returns [ref, isInView] - Ref to attach and in-view state
 */
export function useInView<T extends Element>(
  options: UseLazyLoadOptions = {}
): [React.RefObject<T>, boolean] {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        root: options.root,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0.1,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.root, options.rootMargin, options.threshold])

  return [ref, isInView]
}
