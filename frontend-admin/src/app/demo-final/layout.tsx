import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlipCars Dashboard - Demo Final v2',
  description: 'Pixel-perfect replica of the approved dashboard mockup - Updated Nov 2025',
}

export default function DemoFinalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
