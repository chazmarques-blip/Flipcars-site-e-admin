'use client'

/**
 * Skip to Content link for keyboard navigation accessibility
 * This component provides a hidden link that becomes visible on keyboard focus
 * allowing users to skip repetitive navigation and jump directly to main content
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
