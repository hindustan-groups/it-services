import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ProcessSection from '@/components/sections/ProcessSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import StatsSection from '@/components/sections/StatsSection'
import TechStackSection from '@/components/sections/TechStackSection'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamSection from '@/components/sections/TeamSection'
import FaqSection from '@/components/sections/FaqSection'
import { Container, Button, SEO } from '@/components/ui'
import { usePartners } from '@/hooks/useContent'

const FALLBACK_PARTNERS = [
  { id: '1', name: 'Bhilwara Textiles' },
  { id: '2', name: 'Jaipur Crafts' },
  { id: '3', name: 'Singhal Marbles' },
  { id: '4', name: 'Rajasthan Polytech' },
  { id: '5', name: 'RetailHub' },
]

/**
 * HomePage — assembles all homepage sections.
 */
export default function HomePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('Web Development')
  const [submitted, setSubmitted] = useState(false)
  const { data: partnersData } = usePartners()
  const partners = partnersData?.data?.length ? partnersData.data : FALLBACK_PARTNERS

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SEO path="/" />
      <HeroSection />

      {/* ── Partner Logos Banner ── */}
      <section className="py-12 bg-white border-b border-gray-100" aria-label="Our Partners">
        <Container>
          <p className="text-center text-[10px] md:text-xs font-bold text-text-muted tracking-widest uppercase mb-8">
            Trusted By Forward-Thinking Brands & Businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16 opacity-30 hover:opacity-50 transition-opacity duration-300 pointer-events-none select-none">
            {partners.map(p => (
              <span key={p.id} className="font-heading text-sm md:text-base font-black tracking-wider text-brand-blue uppercase">
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <ServicesSection />
      <ProcessSection />
      <WhyUsSection />
      <StatsSection />
      <TechStackSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <TeamSection />
      <FaqSection />

      {/* Contact CTA Banner */}
      <section
        id="contact"
        className="py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #071530 0%, #0d2460 100%)',
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=60&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />

        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-red-light mb-3 block">
                Start Your Project Today
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to Grow Your Business Digitally?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                Get a free consultation with our team. We will understand your goals and
                recommend the right technology solution — no jargon, no pressure.
              </p>
            </div>

            {/* Right: Glassmorphic Contact Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 lg:p-7 max-w-md lg:ml-auto w-full">
              <div className="space-y-4">
                {submitted ? (
                  <div className="text-center py-5 space-y-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg">
                      ✓
                    </div>
                    <h3 className="font-heading text-base font-bold text-white">Inquiry Received!</h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Thank you! Mohammad Dilshan and our technical advisors will get back to you within 2 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h3 className="font-heading text-sm font-bold text-white mb-1 uppercase tracking-wider text-center">
                      Request a Free Quote
                    </h3>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="e.g. Aditya Sharma" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1">Your Email</label>
                      <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="e.g. aditya@textiles.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1">Service Needed</label>
                      <select 
                        value={service} 
                        onChange={(e) => setService(e.target.value)} 
                        className="w-full bg-[#0d2460] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-red transition-all cursor-pointer"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing & SEO</option>
                        <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full mt-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-medium py-2 rounded-lg text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      Send Message
                    </button>
                  </form>
                )}
                
                <div className="border-t border-white/10 my-4" />
                
                <div className="space-y-3.5">
                  <a
                    href="tel:+919999999999"
                    className="text-white/80 hover:text-white text-sm flex items-center gap-3 transition-colors duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red-light/20 flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-200">
                      <Phone className="w-3.5 h-3.5 text-brand-red-light group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium">+91 99999 99999</span>
                  </a>
                  
                  <a
                    href="mailto:info@hindustanprojects.com"
                    className="text-white/80 hover:text-white text-sm flex items-center gap-3 transition-colors duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red-light/20 flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-200">
                      <Mail className="w-3.5 h-3.5 text-brand-red-light group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium">info@hindustanprojects.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
