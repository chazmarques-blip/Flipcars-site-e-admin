import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/GoogleTagManager'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'FlipCars - Expert Auto Body Repair | Orlando, FL',
  description: 'Professional auto body repair and collision services in Orlando, FL. Insurance claims handled. Free estimates. Quality guaranteed.',
  keywords: 'auto body repair, collision repair, car painting, insurance claims, Orlando FL',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </head>
      <body className="font-sans">
        {gtmId && <GoogleTagManagerNoScript gtmId={gtmId} />}
        <Header />
        {/* Spacer for fixed header - matches header height (h-28 = 7rem = 112px) */}
        <div className="h-28"></div>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
