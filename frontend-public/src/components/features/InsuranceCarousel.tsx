'use client'

import { useEffect, useState } from 'react'

const insuranceCompanies = [
  {
    name: 'American Family Insurance',
    logo: '/images/insurance-american-family.png'
  },
  {
    name: 'Progressive',
    logo: '/images/insurance-progressive.png'
  },
  {
    name: 'Safeco Insurance',
    logo: '/images/insurance-safeco.png'
  },
  {
    name: 'Kemper',
    logo: '/images/insurance-kemper.png'
  },
  {
    name: 'Nationwide',
    logo: '/images/insurance-nationwide.png'
  },
  {
    name: 'Allstate',
    logo: '/images/insurance-allstate.png'
  },
  {
    name: 'USAA',
    logo: '/images/insurance-usaa.png'
  },
  {
    name: 'State Farm',
    logo: '/images/insurance-statefarm.png'
  }
]

export default function InsuranceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % insuranceCompanies.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-6 bg-black border-y border-primary/20">
      <div className="container-custom">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
            We Work with{' '}
            <span className="text-primary">All Insurance Companies</span>
          </h2>
          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            Approved and recommended by major US insurance carriers
          </p>
        </div>

        {/* Desktop View - All logos visible with scroll animation */}
        <div className="hidden md:block overflow-hidden relative">
          <div className="flex items-center justify-center gap-6 animate-scroll py-3">
            {/* First set of logos */}
            {insuranceCompanies.map((company, index) => (
              <img
                key={`first-${index}`}
                src={company.logo}
                alt={company.name}
                className="flex-shrink-0 h-12 w-auto object-contain transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-70"
                style={{
                  filter: 'grayscale(100%) brightness(1.5) contrast(1.2)',
                }}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {insuranceCompanies.map((company, index) => (
              <img
                key={`second-${index}`}
                src={company.logo}
                alt={company.name}
                className="flex-shrink-0 h-12 w-auto object-contain transition-all duration-300 hover:scale-110 hover:opacity-100 opacity-70"
                style={{
                  filter: 'grayscale(100%) brightness(1.5) contrast(1.2)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile View - Carousel with dots */}
        <div className="md:hidden">
          <div className="relative h-20 flex items-center justify-center mb-4">
            {insuranceCompanies.map((company, index) => (
              <img
                key={index}
                src={company.logo}
                alt={company.name}
                className={`absolute h-14 w-auto object-contain transition-all duration-500 ${
                  index === currentIndex
                    ? 'opacity-70 scale-100 z-10'
                    : 'opacity-0 scale-75 z-0'
                }`}
                style={{
                  filter: 'grayscale(100%) brightness(1.5) contrast(1.2)',
                }}
              />
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2">
            {insuranceCompanies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to insurance ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-primary font-semibold text-sm">
              Certified and Approved by All Major Insurance Companies
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
