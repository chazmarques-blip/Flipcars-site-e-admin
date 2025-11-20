import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlipCars Dashboard - Demo Final',
  description: 'Pixel-perfect replica of the approved dashboard mockup',
}

export default function DemoFinalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
