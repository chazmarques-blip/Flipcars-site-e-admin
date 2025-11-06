'use client'

import { Award, Shield, Clock, Users, CheckCircle, Star } from 'lucide-react'

const benefits = [
  {
    icon: Award,
    title: '20+ Years Experience',
    description: 'Two decades of excellence in auto body repair and collision services in Orlando.',
    color: 'text-primary'
  },
  {
    icon: Shield,
    title: 'Insurance Experts',
    description: 'We work directly with all major insurance carriers to streamline your claim process.',
    color: 'text-blue-600'
  },
  {
    icon: CheckCircle,
    title: 'Lifetime Warranty',
    description: 'Our workmanship is backed by a lifetime warranty for your complete peace of mind.',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Most repairs completed in 3-5 days. We provide rental cars while you wait.',
    color: 'text-orange-600'
  },
  {
    icon: Star,
    title: '4.9/5 Star Rating',
    description: '51 verified Google reviews from satisfied customers across Central Florida.',
    color: 'text-yellow-600'
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Dedicated customer service team available to answer your questions every step.',
    color: 'text-purple-600'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-6 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
            Why Choose FlipCars?
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            We&apos;re not just another body shop. We&apos;re your trusted partner in restoring your vehicle to perfection.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-primary/10 transition-colors duration-300">
                    <Icon className={`w-5 h-5 ${benefit.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-secondary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-5 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 text-sm font-medium">Licensed & Insured</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 text-sm font-medium">Certified Technicians</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 text-sm font-medium">OEM Parts Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
