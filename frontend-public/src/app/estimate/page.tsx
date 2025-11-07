'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EstimatePage() {
  const [formStep, setFormStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0B3B5E] border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-[#FF7A1A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Free Estimate Request</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FF7A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Your Free Estimate</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 1 hour during business hours
              </p>
            </div>

            {/* Coming Soon Message */}
            <div className="border-2 border-dashed border-[#FF7A1A] rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Form Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                We're currently setting up our online estimate form. In the meantime, please contact us directly:
              </p>
              
              <div className="space-y-4">
                {/* Phone */}
                <a 
                  href="tel:+13219608661"
                  className="flex items-center justify-center gap-3 p-4 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  <span className="text-xl">📞</span>
                  <span>(321) 960-8661</span>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/13219608661"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <span>WhatsApp Us</span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:info@flipcars.us"
                  className="flex items-center justify-center gap-3 p-4 bg-[#0B3B5E] hover:bg-[#0B3B5E]/90 text-white rounded-lg font-semibold transition-colors"
                >
                  <span className="text-xl">📧</span>
                  <span>info@flipcars.us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Saturday:</span>
                <span>9:00 AM - 12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sunday:</span>
                <span className="text-red-600">Closed</span>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gradient-to-br from-[#0B3B5E] to-[#0B3B5E]/80 rounded-lg shadow-lg p-6 mt-8 text-white">
            <h3 className="text-lg font-bold mb-4">Why Choose FlipCars?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#FF7A1A] text-xl">✓</span>
                <span>Fast response - We reply within 1 hour</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF7A1A] text-xl">✓</span>
                <span>Experienced team - 15+ years in auto body repair</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF7A1A] text-xl">✓</span>
                <span>Insurance approved - We work with all major insurers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF7A1A] text-xl">✓</span>
                <span>Quality guarantee - Lifetime warranty on all repairs</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
