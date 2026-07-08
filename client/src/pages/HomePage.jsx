import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ShowcaseSection from '@/components/sections/ShowcaseSection'
import ProcessSection from '@/components/sections/ProcessSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import StatsSection from '@/components/sections/StatsSection'
import TechStackSection from '@/components/sections/TechStackSection'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TeamSection from '@/components/sections/TeamSection'
import FaqSection from '@/components/sections/FaqSection'
import { Container, Button, SEO } from '@/components/ui'
import { SITE, localBusinessSchema } from '@/components/ui/SEO'
import { usePartners, useSiteSettings } from '@/hooks/useContent'
import { api } from '@/utils/api'

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
  const [submitting, setSubmitting] = useState(false)
  const { data: partnersData } = usePartners()
  const { data: settingsData } = useSiteSettings()
  const partners = partnersData?.data?.length ? partnersData.data : FALLBACK_PARTNERS
  const cfg = settingsData?.data || {}
  const phone = cfg.phone || '+91 99999 99999'
  const contactEmail = cfg.email || 'info@hindustanprojects.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    setSubmitting(true)
    try {
      await api.post('/contact', {
        name,
        email,
        serviceInterested: service,
        message: `Quick quote request from homepage for: ${service}`,
        recaptchaToken: 'dev-token',
        _hp: '',
      })
    } catch {
      /* silent — UX first */
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <>
      <SEO
        path="/"
        schemas={[localBusinessSchema()]}
        keywords="IT company Bhilwara, web development Bhilwara, digital marketing Rajasthan, IT services Bhilwara, custom software Rajasthan"
      />
      <HeroSection />

      {/* ── Partner Logos Banner ── */}
      <section className="py-12 bg-white border-b border-gray-100" aria-label="Our Partners">
        <Container>
          <p className="text-center text-[10px] md:text-xs font-bold text-text-muted tracking-widest uppercase mb-8">
            Trusted By Forward-Thinking Brands & Businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16 pointer-events-none select-none">
            {partners.map((p) => (
              <span
                key={p.id}
                className="font-heading text-sm md:text-base font-black tracking-wider text-gray-500 uppercase"
              >
                {p.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <ServicesSection />
      <ShowcaseSection />
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
        className="py-20 relative overflow-hidden border-t border-white/5"
        style={{
          background: 'linear-gradient(135deg, #020712 0%, #08173d 100%)',
        }}
      >
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
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
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-red-light bg-brand-red/10 border border-brand-red-light/20 px-3 py-1 rounded-full w-fit block">
                Start Your Project Today
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold !text-white leading-tight">
                Ready to Grow Your Business Digitally?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
                Get a free consultation with our team. We will understand your goals and recommend
                the right technology solution — no jargon, no pressure.
              </p>
            </div>

            {/* Right: Glassmorphic Contact Card */}
            <div className="bg-slate-900/80 border border-white/15 backdrop-blur-lg rounded-2xl p-6 lg:p-7 max-w-md lg:ml-auto w-full shadow-2xl">
              <div className="space-y-4">
                {submitted ? (
                  <div className="text-center py-5 space-y-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 font-bold text-lg">
                      ✓
                    </div>
                    <h3 className="font-heading text-base font-bold text-white">
                      Inquiry Received!
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Thank you! Mohammad Dilshan and our technical advisors will get back to you
                      within 2 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h3 className="font-heading text-sm font-bold text-white mb-2 uppercase tracking-wider text-center">
                      Request a Free Quote
                    </h3>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aditya Sharma"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-red-light focus:ring-1 focus:ring-brand-red-light/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aditya@textiles.com"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-red-light focus:ring-1 focus:ring-brand-red-light/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Service Needed
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-red-light transition-all cursor-pointer"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing & SEO</option>
                        <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-60"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}

                <div className="border-t border-white/10 my-4" />

                <div className="space-y-3.5">
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="text-slate-300 hover:text-white text-sm flex items-center gap-3 transition-colors duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red-light/20 flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-200">
                      <Phone className="w-3.5 h-3.5 text-brand-red-light group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-semibold">{phone}</span>
                  </a>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-slate-300 hover:text-white text-sm flex items-center gap-3 transition-colors duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 border border-brand-red-light/20 flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-200">
                      <Mail className="w-3.5 h-3.5 text-brand-red-light group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-semibold">{contactEmail}</span>
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
