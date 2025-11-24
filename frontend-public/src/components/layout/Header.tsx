'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Menu, X, MessageCircle } from 'lucide-react'
import { EstimateFormModal } from '@/components/estimate/EstimateFormModal'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [estimateModalOpen, setEstimateModalOpen] = useState(false)

  // TODO: Connect to admin API to check if gallery has photos
  // For now, set to false. Will be dynamic when admin panel is implemented.
  // This should fetch from: /api/gallery/count or check gallery items in database
  const hasGalleryPhotos = false // Will be: const { data } = useGalleryCount()

  // Build navigation array dynamically
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    // Gallery link only shows when there are photos in the admin gallery
    ...(hasGalleryPhotos ? [{ name: 'Gallery', href: '/gallery' }] : []),
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-primary/20 shadow-lg z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-28 py-3">
          {/* Logo - More prominent */}
          <Link href="/" className="flex items-center transform hover:scale-105 transition-transform duration-200">
            <img 
              src="/images/flipcars-logo.jpg" 
              alt="FlipCars - Guaranteed Quality" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-primary transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+13219608661"
              className="flex items-center space-x-2 text-white hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-semibold">321-960-8661</span>
            </a>
            <button 
              onClick={() => setEstimateModalOpen(true)}
              className="bg-primary hover:bg-primary-light text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start My Insurance Claim
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 bg-black">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="tel:+13219608661"
                className="flex items-center space-x-2 text-white hover:text-primary py-2"
              >
                <Phone className="w-5 h-5" />
                <span className="font-semibold">321-960-8661</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEstimateModalOpen(true);
                }}
                className="bg-primary hover:bg-primary-light text-black font-bold px-6 py-3 rounded-lg text-center transition-all duration-200"
              >
                Start My Insurance Claim
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/13219608661"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Estimate Form Modal */}
      <EstimateFormModal 
        isOpen={estimateModalOpen} 
        onClose={() => setEstimateModalOpen(false)} 
      />
    </header>
  )
}
