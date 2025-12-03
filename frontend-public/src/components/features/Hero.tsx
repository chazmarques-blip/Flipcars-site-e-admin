'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, CheckCircle, ArrowRight, Zap, Shield, Clock, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import StarRating from '../ui/StarRating'
import { EstimateFormModal } from '@/components/estimate/EstimateFormModal'
import { fbEvent } from '@/components/FacebookPixel'

const heroSlides = [
  {
    id: 0,
    title: "Oil Change Special",
    subtitle: "Professional Service at Unbeatable Price - Free Labor",
    description: "Complete vehicle inspection included • You only pay for oil, filter, and parts • Service time: 30-45 minutes",
    badge: "⭐ FREE LABOR PROMOTION",
    bgImage: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1920&auto=format&fit=crop", // Oil change / mechanic
    isPromo: true,
    promoPrice: "$39.99",
    promoTag: "FREE LABOR",
    terms: "*Terms: $39.99 price applies to vehicles using up to 1 gallon of synthetic oil. For vehicles requiring more than 1 gallon, additional oil will be charged proportionally. Filters not included in price. Free labor applies to oil change service only. Customer is responsible for oil, filter, and any additional parts/services recommended during inspection."
  },
  {
    id: 1,
    title: "Crashed Your Car?",
    subtitle: "We'll Fix It Like New!",
    description: "Insurance approved repairs • Free towing • Free rental car • No upfront payment",
    badge: "Insurance Claims Specialist",
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
    title: "Extended Warranty Specialists",
    subtitle: "We Work With Your Warranty",
    description: "Expert in extended warranty repairs • Direct billing to warranty companies • All major warranties accepted",
    badge: "Warranty Claims Accepted",
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

      {/* Navigation Arrows - Desktop Only: Middle sides */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-3 rounded-full transition-all duration-200 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-3 rounded-full transition-all duration-200 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:text-black" />
      </button>

      <div className="container-custom relative z-10 py-3 md:py-4">
        <div className="max-w-3xl">
          {/* Urgency Badge with animation */}
          <div 
            key={`badge-${currentSlide}`}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-3 py-1.5 rounded-full mb-2 animate-pulse"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{slide.badge}</span>
          </div>

          {/* Title with slide transition */}
          <h1 
            key={`title-${currentSlide}`}
            className="text-xl md:text-2xl lg:text-3xl font-heading font-bold mb-1.5 leading-tight animate-fade-in"
          >
            {slide.title}
            <span className="block text-primary mt-0.5">
              {slide.subtitle}
            </span>
          </h1>
          
          <p 
            key={`desc-${currentSlide}`}
            className="text-xs md:text-sm text-gray-200 mb-2 animate-fade-in max-w-2xl leading-snug"
          >
            <strong className="text-white">{slide.description.split('•')[0]}</strong>
            {slide.description.includes('•') && ' • ' + slide.description.split('•').slice(1).join(' • ')}
          </p>

          {/* Promo Price Tag - Only for Oil Change Slide - CLICKABLE BUTTON */}
          {slide.isPromo && (
            <>
              <button
                onClick={() => {
                  fbEvent.trackCustom('CTAClick', { button: 'Oil Change Price Splash' });
                  setEstimateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 mb-1.5 animate-fade-in bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-yellow-600 px-4 py-2 rounded-full shadow-lg hover:from-yellow-300 hover:to-yellow-400 hover:shadow-xl transition-all duration-200 cursor-pointer group"
              >
                <span className="text-black font-bold text-lg md:text-2xl group-hover:scale-105 transition-transform">
                  Only {slide.promoPrice}
                </span>
                <div className="h-6 w-px bg-black/20"></div>
                <span className="text-black font-bold text-xs md:text-sm px-3 py-1 bg-white rounded-full group-hover:bg-gray-50 transition-colors">
                  {slide.promoTag}
                </span>
              </button>
              
              {/* Terms & Conditions - Compact */}
              {slide.terms && (
                <p className="text-[10px] md:text-xs text-gray-400 italic mb-2 max-w-2xl leading-tight">
                  {slide.terms}
                </p>
              )}
            </>
          )}

          {/* CTAs with Navigation Arrows - Mobile: Arrows beside buttons */}
          <div className="flex items-center gap-2 mb-2">
            {/* Mobile Arrow Left */}
            <button
              onClick={prevSlide}
              className="md:hidden flex-shrink-0 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:text-black" />
            </button>

            {/* Buttons Container - Conditional CTAs based on slide type */}
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              {slide.isPromo ? (
                // PROMO SLIDE: Oil Change CTA - Amarelo/Dourado
                <>
                  <button
                    onClick={() => {
                      fbEvent.trackCustom('CTAClick', { button: 'Oil Change Promo' });
                      setEstimateModalOpen(true);
                    }}
                    className="group bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 border-2 border-yellow-700 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(180,83,9,0.4)] hover:shadow-[0_6px_0_0_rgba(180,83,9,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(180,83,9,0.4)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Book Oil Change Now!</span>
                    <span className="sm:hidden">Book Now!</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <a
                    href="tel:+13219608661"
                    onClick={() => {
                      fbEvent.contact();
                      fbEvent.trackCustom('PhoneClick', { phone: '321-960-8661' });
                    }}
                    className="group bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-white text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call: 321-960-8661</span>
                    <span className="sm:hidden">321-960-8661</span>
                  </a>
                </>
              ) : (
                // REGULAR SLIDES: Insurance/Bodyshop CTAs + Oil Change Promo Button
                <>
                  {/* PRIMARY: Insurance Claim (60-70% of customers) - 3D Effect */}
                  <button
                    onClick={() => {
                      fbEvent.trackCustom('CTAClick', { button: 'Insurance Claim' });
                      setEstimateModalOpen(true);
                    }}
                    className="group bg-gradient-to-b from-primary to-primary-light hover:from-primary-light hover:to-primary text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Start My Insurance Claim</span>
                    <span className="sm:hidden">Insurance Claim</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
              
                  {/* SECONDARY: Call Now (Action Button) - 3D Effect */}
                  <a
                    href="tel:+13219608661"
                    onClick={() => {
                      fbEvent.contact();
                      fbEvent.trackCustom('PhoneClick', { phone: '321-960-8661' });
                    }}
                    className="group bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-white text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call: 321-960-8661</span>
                    <span className="sm:hidden">321-960-8661</span>
                  </a>
                  
                  {/* TERTIARY: Free Estimate (30-40% without insurance) - 3D Effect */}
                  <button
                    onClick={() => {
                      fbEvent.trackCustom('CTAClick', { button: 'Free Estimate' });
                      setEstimateModalOpen(true);
                    }}
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_0_0_rgba(255,255,255,0.15)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,255,255,0.1)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Get Free Estimate</span>
                    <span className="sm:hidden">Free Estimate</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* NEW: Oil Change Promo Button (Yellow/Gold) - 3D Effect */}
                  <button
                    onClick={() => {
                      fbEvent.trackCustom('CTAClick', { button: 'Oil Change Promo (Regular Banner)' });
                      setEstimateModalOpen(true);
                    }}
                    className="group bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 border-2 border-yellow-700 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 shadow-[0_4px_0_0_rgba(180,83,9,0.4)] hover:shadow-[0_6px_0_0_rgba(180,83,9,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(180,83,9,0.4)] flex items-center justify-center gap-1.5 w-full sm:flex-1 whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Book Oil Change Now! Only $39.99 !!</span>
                    <span className="hidden sm:inline lg:hidden">Oil Change $39.99 !!</span>
                    <span className="sm:hidden">$39.99 !!</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Arrow Right */}
            <button
              onClick={nextSlide}
              className="md:hidden flex-shrink-0 bg-black/50 hover:bg-primary/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:text-black" />
            </button>
          </div>

          {/* Trust Indicators - Ultra Compact */}
          <div className="flex flex-wrap items-center gap-2 text-xs border-t border-white/10 pt-1.5">
            <div className="flex items-center gap-1.5">
              <StarRating rating={4.9} size="md" showValue={false} />
              <span className="font-bold text-primary">4.9/5</span>
              <span className="text-gray-400">(51)</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-300">Licensed & Insured</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-300">Lifetime Warranty</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-300">3-5 Days</span>
            </div>
          </div>
        </div>

        {/* Slide Indicators/Dots */}
        <div className="flex justify-center gap-2 mt-3">
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
        initialServiceType='mechanic'
        preSelectOilChange={true}
      />
    </section>
  )
}
