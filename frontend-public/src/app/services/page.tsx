import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Wrench, 
  Paintbrush, 
  Shield, 
  Car, 
  CheckCircle, 
  Phone,
  ArrowRight,
  Clock,
  Award,
  ThumbsUp,
  FileText
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Services | FlipCars Auto Body Shop',
  description: 'Professional auto body repair services in Orlando, FL. Collision repair, paint services, insurance claims, and complete body shop services.',
}

export default function ServicesPage() {
  const services = [
    {
      id: 'extended-warranty',
      icon: Shield,
      title: 'Extended Warranty Repairs',
      subtitle: 'Expert Extended Warranty Claims Processing',
      description: 'We specialize in helping customers utilize their extended warranty coverage for vehicle repairs. Our experienced team works directly with all major extended warranty companies including CARCHEX, CarShield, Endurance, and Protect My Car. We handle all documentation, authorization, and billing to ensure your repairs are covered and completed efficiently.',
      features: [
        'Direct billing to warranty companies',
        'Work with all major warranty providers',
        'Pre-authorization assistance',
        'Complete documentation handling',
        'Fast claim processing (24-48 hours)',
        'No upfront payment required (in most cases)'
      ],
      process: [
        'Contact us with your warranty information',
        'We verify coverage with your warranty company',
        'Pre-authorization request submitted',
        'Approved repairs scheduled immediately',
        'Direct billing to warranty provider',
        'You pay only your deductible (if applicable)'
      ],
      benefits: [
        'Experienced with all major warranty companies',
        'Expedited authorization process',
        'Clear communication throughout repair',
        'Quality repairs covered by warranty'
      ]
    },
    {
      id: 'collision-repair',
      icon: Wrench,
      title: 'Collision Repair',
      subtitle: 'Expert Collision Restoration',
      description: 'Our certified technicians use advanced collision repair techniques and state-of-the-art equipment to restore your vehicle to its pre-accident condition. We specialize in both minor and major collision damage, ensuring structural integrity and safety.',
      features: [
        'Frame straightening and alignment',
        'Structural damage repair',
        'Unibody repair and restoration',
        'Bumper repair and replacement',
        'Hood, fender, and door repairs',
        'Complete vehicle restoration'
      ],
      process: [
        'Comprehensive damage assessment and estimate',
        'Detailed disassembly and inspection',
        'Structural repairs using factory specifications',
        'Quality control and safety inspection',
        'Final detailing and delivery'
      ],
      benefits: [
        'Certified technicians with 15+ years experience',
        'OEM and aftermarket parts available',
        'Lifetime warranty on repairs',
        'Insurance claim assistance included'
      ]
    },
    {
      id: 'paint-services',
      icon: Paintbrush,
      title: 'Paint Services',
      subtitle: 'Professional Automotive Painting',
      description: 'We provide premium automotive painting services using computerized color matching technology and high-quality paint systems. Our climate-controlled paint booth ensures a flawless, factory-quality finish every time.',
      features: [
        'Computerized color matching',
        'Premium paint systems (PPG, Sherwin-Williams)',
        'Climate-controlled paint booth',
        'Multi-stage paint application',
        'Clear coat protection',
        'Custom paint jobs available'
      ],
      process: [
        'Color match analysis using spectrophotometer',
        'Surface preparation and priming',
        'Base coat application',
        'Clear coat finishing',
        'Color sanding and buffing',
        'Final inspection and detailing'
      ],
      benefits: [
        'Perfect color match guaranteed',
        'Lifetime paint warranty',
        'UV and rust protection included',
        'Environmentally friendly paint systems'
      ]
    },
    {
      id: 'insurance-claims',
      icon: Shield,
      title: 'Insurance Claims',
      subtitle: 'Hassle-Free Claims Processing',
      description: 'We work directly with all major insurance companies to streamline your claim process. Our experienced team handles all paperwork and negotiations, ensuring you get the repairs you deserve without the stress.',
      features: [
        'Direct billing to insurance',
        'All paperwork handled for you',
        'Work with all major insurers',
        'Free claim estimates',
        'Rental car coordination',
        'Supplemental claim assistance'
      ],
      process: [
        'Initial damage assessment and documentation',
        'Insurance claim filing and submission',
        'Adjuster coordination and inspection',
        'Approval and repair authorization',
        'Progress updates throughout repairs',
        'Final sign-off with insurance'
      ],
      benefits: [
        'Zero out-of-pocket expenses (in most cases)',
        'Direct insurance communication',
        'Faster claim approval process',
        'Expert negotiation on your behalf'
      ]
    },
    {
      id: 'body-shop',
      icon: Car,
      title: 'Body Shop Services',
      subtitle: 'Complete Auto Body Solutions',
      description: 'Our comprehensive body shop services cover everything from minor dents to major body damage. We use advanced techniques and quality materials to restore your vehicle\'s appearance and structural integrity.',
      features: [
        'Paintless dent removal (PDR)',
        'Traditional dent repair',
        'Frame straightening',
        'Panel replacement',
        'Scratch and scuff removal',
        'Rust repair and prevention'
      ],
      process: [
        'Detailed vehicle inspection',
        'Damage assessment and estimate',
        'Repair method selection',
        'Professional repair execution',
        'Quality assurance inspection',
        'Final detailing and delivery'
      ],
      benefits: [
        'Same-day minor repairs available',
        'Mobile dent repair services',
        'Warranty on all body work',
        'Complimentary car wash with service'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Auto Body Services in Orlando
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Expert collision repair, premium paint services, insurance claims assistance, and complete body shop solutions. Your vehicle deserves the best care.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+13219608661"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call: 321-960-8661
              </a>
              <Link
                href="/estimate"
                className="bg-white text-secondary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Free Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-bold text-secondary mb-1">15+ Years Experience</h3>
              <p className="text-sm text-gray-600">Certified technicians you can trust</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-bold text-secondary mb-1">Fast Turnaround</h3>
              <p className="text-sm text-gray-600">Most repairs completed within 3-5 days</p>
            </div>
            <div className="flex flex-col items-center">
              <ThumbsUp className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-bold text-secondary mb-1">Lifetime Warranty</h3>
              <p className="text-sm text-gray-600">All repairs backed by our guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24"
                >
                  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                    index % 2 === 0 ? '' : ''
                  }`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-10">
                      {/* Left Column - Info */}
                      <div>
                        <div className="inline-flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Icon className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-secondary">
                              {service.title}
                            </h2>
                            <p className="text-primary font-semibold">
                              {service.subtitle}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-secondary mb-3">
                            What We Offer
                          </h3>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href="/estimate"
                          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Get Free Quote
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>

                      {/* Right Column - Process & Benefits */}
                      <div className="space-y-6">
                        {/* Our Process */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Our Process
                          </h3>
                          <ol className="space-y-3">
                            {service.process.map((step, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-700 pt-0.5">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Benefits */}
                        <div className="bg-primary/5 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            Why Choose Us
                          </h3>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <ThumbsUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-secondary to-secondary/90 text-white py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Restore Your Vehicle?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get your free estimate today and experience the FlipCars difference. Professional service, quality repairs, lifetime warranty.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+13219608661"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now: 321-960-8661
            </a>
            <Link
              href="/estimate"
              className="bg-white text-secondary hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Request Free Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
