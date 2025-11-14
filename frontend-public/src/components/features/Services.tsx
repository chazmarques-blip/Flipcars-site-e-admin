import { Wrench, Paintbrush, Shield, Car, FileText } from 'lucide-react'
import Link from 'next/link'

export default function Services() {
  const services = [
    {
      icon: FileText,
      title: 'Extended Warranty Repairs',
      description: 'Specialized in processing extended warranty claims. We work directly with all major warranty companies to get your vehicle repaired quickly and hassle-free.',
      link: '/services#extended-warranty'
    },
    {
      icon: Wrench,
      title: 'Collision Repair',
      description: 'Advanced collision repair using state-of-the-art equipment and certified techniques to restore your vehicle to factory specifications.',
      link: '/services#collision-repair'
    },
    {
      icon: Paintbrush,
      title: 'Paint Services',
      description: 'Professional automotive painting with computerized color matching, premium finishes, and lifetime warranty on all paint work.',
      link: '/services#paint-services'
    },
    {
      icon: Shield,
      title: 'Insurance Claims',
      description: 'Streamlined insurance claim process - we handle all paperwork and work directly with your insurance company for hassle-free repairs.',
      link: '/services#insurance-claims'
    },
    {
      icon: Car,
      title: 'Body Shop Services',
      description: 'Comprehensive body shop services including dent removal, frame straightening, panel replacement, and complete vehicle restoration.',
      link: '/services#body-shop'
    },
  ]

  return (
    <section className="py-5 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group bg-white p-3 lg:p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 lg:mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base lg:text-lg font-heading font-semibold text-secondary mb-2">
                  {service.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 flex-grow">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="text-primary font-semibold hover:text-primary-hover inline-flex items-center space-x-2 group"
                >
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
