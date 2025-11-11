'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, CheckCircle, ArrowRight, Zap, Shield, Clock, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import StarRating from '../ui/StarRating'
import { EstimateFormModal } from '@/components/estimate/EstimateFormModal'

const heroSlides = [
  {
    id: 1,
    title: "Crashed Your Car?",
    subtitle: "We'll Fix It Like New!",
    description: "Insurance approved repairs • Free towing • Free rental car • No upfront payment",
    badge: "Free Estimate in 24 Hours",
    bgImage: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920&auto=format&fit=crop" // Damaged car repair
  },
  {
    id: 2,
    title: "Collision Repair Experts",
    subtitle: "20+ Years of Excellence",
    description: "State-of-the-art equipment • Certified technicians • Lifetime warranty on repairs",
    badge: "Same Day Appointments Available",
    bgImage: "/images/frame-machine.jpg" // Frame machine with cars on platforms
  },
  {
    id: 3,
    title: "Insurance Claims Specialists",
    subtitle: "We Handle Everything!",
    description: "Work with all insurance companies • No hassle claims • Direct billing available",
    badge: "100% Insurance Approved",
    bgImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1920&auto=format&fit=crop" // Insurance/documents
  },
  {
    id: 4,
    title: "Paint & Body Services",
    subtitle: "Factory-Quality Finish",
    description: "Computerized color matching • Premium paint systems • Dust-free paint booths",
    badge: "Color Match Guarantee",
    bgImage: "/images/paint-booth.jpg" // Professional paint booth interior
  },
  {
    id: 5,
    title: "Fast Turnaround Time",
    subtitle: "Back on the Road Quickly",
    description: "Most repairs 3-5 days • Priority service available • Free rental while we work",
    badge: "Express Service Available",
    bgImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop" // Sports car/speed
  },
  {
    id: 6,
    title: "51 Happy Customers",
    subtitle: "5-Star Rated Service",
    description: "Top-rated body shop • Verified reviews • Trusted by our community",
    badge: "4.9/5 Rating (51 Google Reviews)",
    bgImage: "/images/car-mosaic.jpg" // Car mosaic showing variety of vehicles serviced
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [estimateModalOpen, setEstimateModalOpen] = useState(false)

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <div 
          key={`bg-${currentSlide}`}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${slide.bgImage})`,
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
      </div>

      {/* Logo Watermark - Integrated with transparency */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-10">
        <img 
          src="/images/flipcars-logo.jpg"
          alt="" 
          className="w-80 h-auto"
        />
      </div>

      {/* Navigation Arrows - Mobile: Top corners, Desktop: Middle */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-20 md:top-1/2 md:-translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-200 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-20 md:top-1/2 md:-translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-200 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-black" />
      </button>

      <div className="container-custom relative z-10 py-4 md:py-6">
        <div className="max-w-3xl">
          {/* Urgency Badge with animation */}
          <div 
            key={`badge-${currentSlide}`}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full mb-3 animate-pulse"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">{slide.badge}</span>
          </div>

          {/* Title with slide transition */}
          <h1 
            key={`title-${currentSlide}`}
            className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 leading-tight animate-fade-in"
          >
            {slide.title}
            <span className="block text-primary mt-1">
              {slide.subtitle}
            </span>
          </h1>
          
          <p 
            key={`desc-${currentSlide}`}
            className="text-sm md:text-base text-gray-200 mb-3 animate-fade-in max-w-2xl"
          >
            <strong className="text-white">{slide.description.split('•')[0]}</strong>
            {slide.description.includes('•') && ' • ' + slide.description.split('•').slice(1).join(' • ')}
          </p>

          {/* CTAs with urgency */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <button
              onClick={() => setEstimateModalOpen(true)}
              className="group bg-primary hover:bg-primary-light text-black font-bold text-sm px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
            >
              Get FREE Estimate Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+13219608661"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-sm px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              321-960-8661
            </a>
          </div>

          {/* Trust Indicators - Compact */}
          <div className="flex flex-wrap items-center gap-3 text-xs border-t border-white/10 pt-2">
            <div className="flex items-center gap-2">
              <StarRating rating={4.9} size="md" showValue={false} />
              <span className="font-bold text-primary">4.9/5</span>
              <span className="text-gray-400">(51)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-gray-300">Licensed & Insured</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-gray-300">Lifetime Warranty</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-gray-300">3-5 Days</span>
            </div>
          </div>
        </div>

        {/* Slide Indicators/Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>

      {/* Estimate Form Modal */}
      <EstimateFormModal 
        isOpen={estimateModalOpen} 
        onClose={() => setEstimateModalOpen(false)} 
      />
    </section>
  )
}
