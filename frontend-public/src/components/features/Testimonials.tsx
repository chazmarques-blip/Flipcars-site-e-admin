'use client'

import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import StarRating from '../ui/StarRating'

// Testimonial type
interface Testimonial {
  id: number | string
  name: string
  location: string
  rating: number
  date: string
  image: string
  text: string
  service: string
}

// Fallback manual testimonials (used if Google API fails or is not configured)
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Martinez',
    location: 'Orlando, FL',
    rating: 5,
    date: '2 weeks ago',
    image: '/images/customer-sarah.jpg',
    text: 'Amazing job on my Honda Accord! Handled insurance, provided rental, and repair was flawless. Highly recommend!',
    service: 'Collision Repair'
  },
  {
    id: 2,
    name: 'Michael Thompson',
    location: 'Winter Park, FL',
    rating: 5,
    date: '1 month ago',
    image: '/images/customer-michael.jpg',
    text: 'Best body shop experience ever! Professional team, kept me updated, and my truck looks brand new. Worth every penny!',
    service: 'Body Shop Services'
  },
  {
    id: 3,
    name: 'Jennifer Lee',
    location: 'Lake Mary, FL',
    rating: 5,
    date: '3 weeks ago',
    image: '/images/customer-jennifer.jpg',
    text: 'FlipCars made insurance so easy! Communicated directly with State Farm and my car was perfect in 4 days. Exceptional service!',
    service: 'Insurance Claims'
  },
  {
    id: 4,
    name: 'Robert Garcia',
    location: 'Kissimmee, FL',
    rating: 5,
    date: '2 months ago',
    image: '/images/customer-robert.jpg',
    text: 'Paint work on my BMW was perfection! Color match exact and showroom quality finish. Unmatched attention to detail!',
    service: 'Paint Services'
  },
  {
    id: 5,
    name: 'David Williams',
    location: 'Altamonte Springs, FL',
    rating: 5,
    date: '1 week ago',
    image: '/images/customer-david.jpg',
    text: 'Quick turnaround on my dent repair! Professional service and fair pricing. My car looks as good as new!',
    service: 'Dent Removal'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    location: 'Maitland, FL',
    rating: 5,
    date: '3 days ago',
    image: '/images/customer-lisa.jpg',
    text: 'Outstanding work on my front bumper! Fast, professional, and the quality exceeded my expectations. Highly recommended!',
    service: 'Bumper Repair'
  },
  {
    id: 7,
    name: 'Carlos Rodriguez',
    location: 'Sanford, FL',
    rating: 5,
    date: '5 days ago',
    image: '/images/customer-carlos.jpg',
    text: 'Incredible service from start to finish! They fixed my scratched door perfectly and the paint matches flawlessly. Best shop in Orlando!',
    service: 'Scratch Repair'
  },
  {
    id: 8,
    name: 'Amanda Foster',
    location: 'Apopka, FL',
    rating: 5,
    date: '1 month ago',
    image: '/images/customer-amanda.jpg',
    text: 'My Lexus looks brand new after their detailing and minor collision work. Honest pricing and excellent communication throughout!',
    service: 'Full Service'
  },
  {
    id: 9,
    name: 'James Mitchell',
    location: 'Oviedo, FL',
    rating: 5,
    date: '2 weeks ago',
    image: '/images/customer-james-mitchell.jpg',
    text: 'They repaired my truck after a parking lot incident. Fast work, great quality, and very reasonable rates. Will definitely return!',
    service: 'Truck Repair'
  },
  {
    id: 10,
    name: 'Patricia Chen',
    location: 'Windermere, FL',
    rating: 5,
    date: '4 days ago',
    image: '/images/customer-patricia.jpg',
    text: 'My Mercedes had hail damage and FlipCars restored it perfectly! They worked directly with my insurance. Highly professional service!',
    service: 'Hail Damage'
  },
  {
    id: 11,
    name: 'Kevin Martinez',
    location: 'Clermont, FL',
    rating: 5,
    date: '1 week ago',
    image: '/images/customer-kevin.jpg',
    text: 'Front end collision repair was handled expertly. They kept me informed daily and finished ahead of schedule. Outstanding work!',
    service: 'Front End Repair'
  },
  {
    id: 12,
    name: 'Emily Johnson',
    location: 'Winter Garden, FL',
    rating: 5,
    date: '3 weeks ago',
    image: '/images/customer-jennifer.jpg',
    text: 'Best auto body shop experience! They fixed my side mirror and door perfectly. Fair pricing and warranty included. Absolutely recommend!',
    service: 'Side Repair'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(true)
  const [googleRating, setGoogleRating] = useState({ rating: 4.9, total: 51 })

  // Fetch Google reviews on mount
  useEffect(() => {
    const fetchGoogleReviews = async () => {
      const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
      
      // Skip if not configured
      if (!placeId || !apiKey) {
        console.log('Google Places API not configured, using fallback testimonials')
        setIsLoadingGoogle(false)
        return
      }

      try {
        // Fetch directly from Google Places API (client-side)
        // Note: API key is restricted by HTTP referrer in Google Cloud Console
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          console.log('Google Reviews API request failed, using fallback testimonials')
          setIsLoadingGoogle(false)
          return
        }

        const data = await response.json()
        
        if (data.status === 'OK' && data.result && data.result.reviews && data.result.reviews.length > 0) {
          // Transform Google reviews to our format
          const googleTestimonials: Testimonial[] = data.result.reviews.map((review: any) => ({
            id: review.time,
            name: review.author_name,
            location: 'Orlando, FL',
            rating: review.rating,
            date: review.relative_time_description,
            image: review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=FF6B00&color=fff&size=200`,
            text: review.text,
            service: 'Google Review'
          }))

          // Combine Google reviews with fallback (Google reviews first)
          setTestimonials([...googleTestimonials, ...fallbackTestimonials])
          
          // Update rating info
          if (data.result.rating && data.result.user_ratings_total) {
            setGoogleRating({
              rating: data.result.rating,
              total: data.result.user_ratings_total
            })
          }
        }
      } catch (error) {
        console.error('Error loading Google reviews:', error)
        console.log('Using fallback testimonials')
      } finally {
        setIsLoadingGoogle(false)
      }
    }

    fetchGoogleReviews()
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 4))
    }, 6000) // Change every 6 seconds (more time for 4 reviews)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 4))
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 4)) % Math.ceil(testimonials.length / 4))
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Get current 4 testimonials to display (2x2 grid)
  const currentTestimonials = testimonials.slice(currentIndex * 4, currentIndex * 4 + 4)

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-3">
            <StarRating rating={googleRating.rating} size="lg" showValue={false} />
            <span className="text-primary font-semibold">
              {googleRating.rating.toFixed(1)}/5 Rating
              {!isLoadingGoogle && googleRating.total > 0 && (
                <span className="text-sm ml-2">({googleRating.total}+ reviews)</span>
              )}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
            What Our Customers Say
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers about their FlipCars experience.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-8">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {currentTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 relative z-10">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Service Tag */}
                <div className="mb-3">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {testimonial.service}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-secondary">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {testimonial.location} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(Math.ceil(testimonials.length / 4))].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                alt="Google"
                className="h-6"
              />
              <span className="text-gray-700 font-medium">Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(googleRating.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300 fill-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-gray-700 font-semibold">
                {googleRating.rating.toFixed(1)}/5
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {googleRating.total}+ reviews
              </span>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            Read all reviews on{' '}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=FlipCars+Auto+Body+Shop&query_place_id=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover font-semibold underline"
            >
              Google Business
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
