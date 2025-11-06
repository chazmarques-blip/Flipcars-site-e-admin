import Hero from '@/components/features/Hero'
import Services from '@/components/features/Services'
import InsuranceCarousel from '@/components/features/InsuranceCarousel'
import WhyChooseUs from '@/components/features/WhyChooseUs'
import BeforeAfter from '@/components/features/BeforeAfter'
import Testimonials from '@/components/features/Testimonials'
import CTASection from '@/components/features/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <InsuranceCarousel />
      <WhyChooseUs />
      <BeforeAfter />
      <Testimonials />
      <CTASection />
    </>
  )
}
