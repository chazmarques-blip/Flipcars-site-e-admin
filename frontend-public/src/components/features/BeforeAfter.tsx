'use client'

import { ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'

const showcaseProjects = [
  {
    id: 1,
    title: 'Bumper Collision Repair',
    beforeImage: 'https://page.gensparksite.com/v1/base64_upload/32aa492604b8f02746812feedd1dc5eb',
    afterImage: 'https://page.gensparksite.com/v1/base64_upload/c1d201872c3153ff0177d3d712daa6ce',
    damage: 'Complete front bumper restoration from collision damage to factory finish',
    services: ['Bumper Repair', 'Paint Matching', 'Structural Fix']
  },
  {
    id: 2,
    title: 'Door Dent & Scratch Removal',
    beforeImage: 'https://page.gensparksite.com/v1/base64_upload/ed9c922f313a7f2c9bedb1b55dd24768',
    afterImage: 'https://page.gensparksite.com/v1/base64_upload/cfa9a7bb6ca080a53393fff8a01f45ff',
    damage: 'Advanced paintless dent repair and precision color matching for seamless results',
    services: ['Dent Removal', 'Scratch Repair', 'Paint Blend']
  },
  {
    id: 3,
    title: 'Quarter Panel Restoration',
    beforeImage: 'https://page.gensparksite.com/v1/base64_upload/8340bdfdbeb057f75f1bdcdf7601e654',
    afterImage: 'https://page.gensparksite.com/v1/base64_upload/40819ff2726a50f540ec8c6b406175f7',
    damage: 'Complete side panel repair with frame alignment and multi-stage paint process',
    services: ['Panel Replacement', 'Frame Alignment', 'Full Refinish']
  },
  {
    id: 4,
    title: 'Hood & Fender Collision Repair',
    beforeImage: 'https://page.gensparksite.com/v1/base64_upload/dd1cabbdc7ebe5724877e8914288a4a1',
    afterImage: 'https://page.gensparksite.com/v1/base64_upload/a556ae0618c3a7d93050923df7a691a2',
    damage: 'Front-end collision restoration with computerized color matching technology',
    services: ['Hood Repair', 'Fender Fix', 'Paint Booth Finish']
  }
]

export default function BeforeAfter() {
  return (
    <section className="py-6 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
            Our Work Speaks for Itself
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Real collision repairs from our Orlando shop - see the quality difference we deliver.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {showcaseProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Before/After Images Side by Side */}
              <div className="flex">
                {/* Before Image (left) */}
                <div className="relative w-1/2 h-48 md:h-56 overflow-hidden">
                  <img
                    src={project.beforeImage}
                    alt={`Before - ${project.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    Before
                  </div>
                </div>

                {/* After Image (right) */}
                <div className="relative w-1/2 h-48 md:h-56 overflow-hidden">
                  <img
                    src={project.afterImage}
                    alt={`After - ${project.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    After
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-secondary mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {project.damage}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button - Hidden until admin gallery is implemented */}
        {/* 
        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 btn-primary group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <p className="mt-3 text-sm text-gray-600">
            Over <strong className="text-secondary">500+ successful repairs</strong> completed
          </p>
        </div>
        */}
      </div>
    </section>
  )
}
