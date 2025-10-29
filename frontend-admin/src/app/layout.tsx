import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ToastProvider } from '@/components/providers/ToastProvider'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FlipCars 2.0 - Admin Dashboard',
    template: '%s | FlipCars 2.0',
  },
  description: 'Comprehensive auto body shop management platform with AI-powered lead qualification, customer relationship management, and claim processing',
  keywords: ['auto body shop', 'CRM', 'lead management', 'claim processing', 'AI qualification', 'customer management'],
  authors: [{ name: 'FlipCars Team' }],
  creator: 'FlipCars',
  publisher: 'FlipCars',
  robots: {
    index: false, // Admin dashboard should not be indexed
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
      </head>
      <body className="antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
