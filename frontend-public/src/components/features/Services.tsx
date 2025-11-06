import { Wrench, Paintbrush, Shield, Car } from 'lucide-react'
import Link from 'next/link'

export default function Services() {
  const services = [
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-secondary mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
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
