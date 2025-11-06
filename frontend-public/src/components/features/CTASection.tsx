'use client'

import { ArrowRight, Phone, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary via-secondary-light to-secondary-dark text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Restore Your Car to Perfection?
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Get your free, no-obligation estimate today. We&apos;ll handle everything from towing to insurance claims.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/estimate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <span className="text-lg">Request Free Estimate</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="tel:+13219608661"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 border-2 border-white/30"
            >
              <Phone className="w-5 h-5" />
              <span className="text-lg">Call: 321-960-8661</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-semibold text-lg">Fast Service</h3>
              <p className="text-gray-200 text-sm text-center">
                Most repairs completed in 3-5 days
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-semibold text-lg">24/7 Availability</h3>
              <p className="text-gray-200 text-sm text-center">
                Emergency towing services available
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-semibold text-lg">Convenient Location</h3>
              <p className="text-gray-200 text-sm text-center">
                Serving all of Central Florida
              </p>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-gray-200 text-lg mb-4">
              <strong className="text-white">No upfront payment required.</strong> We work directly with your insurance company.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                ✓ Free Estimates
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                ✓ Lifetime Warranty
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                ✓ Rental Cars Available
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-2">
                ✓ Licensed & Insured
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
