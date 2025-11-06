import { Metadata } from 'next'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  CheckCircle,
  Car,
  Shield,
  Award
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | FlipCars Auto Body Shop',
  description: 'Get in touch with FlipCars Auto Body Shop in Orlando, FL. Visit us, call, or send a message. We are here to help with all your auto body repair needs.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Get In Touch With Us
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              Have questions about our services? Need a quote? We are here to help! Visit our shop, give us a call, or send us a message.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+13219608661"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call: 321-960-8661
              </a>
              <a
                href="https://wa.me/13219608661"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Address */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visit Our Shop</h3>
              <p className="text-gray-600 mb-4">
                5200 Old Winter Garden Rd<br />
                Suite 110A<br />
                Orlando, FL 32811
              </p>
              <a
                href="https://maps.google.com/?q=5200+Old+Winter+Garden+Rd+Suite+110A+Orlando+FL+32811"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-1"
              >
                Get Directions →
              </a>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">
                Main Line:
              </p>
              <a
                href="tel:+13219608661"
                className="text-xl font-bold text-primary hover:text-primary-dark mb-4 block"
              >
                321-960-8661
              </a>
              <p className="text-sm text-gray-500">
                Available during business hours
              </p>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">
                General Inquiries:
              </p>
              <a
                href="mailto:info@flipcars.us"
                className="text-primary hover:text-primary-dark font-semibold mb-4 block break-all"
              >
                info@flipcars.us
              </a>
              <p className="text-sm text-gray-500">
                We respond within 24 hours
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Business Hours</h3>
              <div className="space-y-1 text-gray-600">
                <p className="flex justify-between">
                  <span className="font-semibold">Mon-Fri:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Saturday:</span>
                  <span>9:00 AM - 12:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Sunday:</span>
                  <span className="text-red-600">Closed</span>
                </p>
              </div>
            </div>
          </div>

          {/* Map and Contact Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold mb-2">Find Us on the Map</h2>
                <p className="text-gray-600 text-sm">
                  Located conveniently in Orlando, FL. Easy access from major highways.
                </p>
              </div>
              <div className="w-full h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.8974897937567!2d-81.4548!3d28.5489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMyJzU2LjAiTiA4McKwMjcnMTcuMyJX!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="FlipCars Auto Body Shop Location"
                ></iframe>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Fill out the form below and we will get back to you as soon as possible.
              </p>
              
              <form className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="(321) 960-8661"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  >
                    <option value="quote">Request a Quote</option>
                    <option value="appointment">Schedule Appointment</option>
                    <option value="insurance">Insurance Question</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                    placeholder="Tell us about your repair needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center -mt-1">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Images */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FlipCars?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to providing the best auto body repair services in Orlando
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop"
                  alt="Professional collision repair"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">15+ Years Experience</h3>
              <p className="text-gray-600">
                Certified technicians with extensive training and expertise in all types of repairs
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop"
                  alt="Quality workmanship"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Lifetime Warranty</h3>
              <p className="text-gray-600">
                All repairs backed by our comprehensive lifetime warranty for your peace of mind
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
                  alt="Insurance approved"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Insurance Approved</h3>
              <p className="text-gray-600">
                Work with all major insurance companies. We handle the paperwork for you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Section */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Your Satisfaction is Our Priority
              </h2>
              <p className="text-base text-gray-600 mb-4">
                We understand that dealing with vehicle damage can be stressful. That is why we make the repair process as smooth and hassle-free as possible.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-0.5">Free Estimates</h4>
                    <p className="text-gray-600 text-sm">Get a detailed quote within 24 hours at no cost</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-0.5">Fast Turnaround</h4>
                    <p className="text-gray-600 text-sm">Most repairs completed in 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-0.5">Free Rental Car</h4>
                    <p className="text-gray-600 text-sm">Complimentary rental vehicle while we work on your car</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/car-mosaic.jpg"
                alt="Satisfied customers"
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-black p-4 rounded-lg shadow-lg">
                <div className="text-3xl font-bold mb-0.5">51</div>
                <div className="font-semibold text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 bg-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Follow Us on Social Media</h2>
          <p className="text-gray-300 mb-6">Stay updated with our latest projects and special offers</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary via-primary-light to-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Get your free estimate today and experience the FlipCars difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/estimate"
              className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Get Free Estimate
            </Link>
            <a
              href="tel:+13219608661"
              className="bg-white hover:bg-gray-100 text-secondary font-bold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call: 321-960-8661
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
