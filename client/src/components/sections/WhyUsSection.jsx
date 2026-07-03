/**
 * WhyUsSection — "Why Choose Hindustan Projects" split section.
 * Left: professional image | Right: key differentiators with icons
 * Used on HomePage between ServicesSection and StatsSection.
 */
import { motion } from 'framer-motion'
import { ShieldCheck, Clock, HeadphonesIcon, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Quality You Can Trust',
    desc: 'Clean code, secure architecture, and rigorous QA — every project is built to last.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    desc: 'We respect your deadlines. Transparent timelines and regular progress updates, always.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    desc: 'Post-launch support is part of the deal. We are reachable — not just at project start.',
  },
  {
    icon: TrendingUp,
    title: 'Results-Focused',
    desc: 'We measure success by your growth — leads, conversions, and business outcomes.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-white overflow-hidden" aria-labelledby="whyus-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* ── Left: image stack ── */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            {/* Main large image */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80&auto=format&fit=crop"
              alt="IT professional consulting with a client on business strategy"
              className="w-full h-[460px] object-cover rounded-2xl
                shadow-[0_16px_48px_0_rgba(26,62,140,0.15)]"
              loading="lazy"
            />

            {/* Small overlay image — bottom right */}
            <div
              className="absolute -bottom-6 -right-6 w-44 h-36 rounded-xl overflow-hidden
              border-4 border-white shadow-[0_8px_24px_0_rgba(26,62,140,0.18)] hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80&auto=format&fit=crop"
                alt="Team strategy session"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating experience badge */}
            <div
              className="absolute -top-5 -left-5 bg-brand-blue text-white rounded-xl
              px-5 py-4 shadow-lg hidden sm:block"
            >
              <p className="font-heading text-3xl font-bold leading-none">5+</p>
              <p className="text-xs text-white/75 mt-1 font-medium">
                Years
                <br />
                Experience
              </p>
            </div>

            {/* Decorative dot grid */}
            <div
              className="absolute -z-10 bottom-8 -left-8 w-32 h-32 opacity-30"
              aria-hidden="true"
              style={{
                backgroundImage: 'radial-gradient(circle, #1A3E8C 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px',
              }}
            />
          </motion.div>

          {/* ── Right: content ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-red">
                Why Choose Us
              </span>
              <h2
                id="whyus-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mt-3 mb-4"
              >
                Your Growth Is Our <span className="text-brand-red">Commitment</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-md">
                We are not just a vendor — we are a long-term technology partner. Here is why
                businesses in Bhilwara and across India choose Hindustan Projects.
              </p>
            </motion.div>

            {/* Reasons list */}
            <div className="space-y-5">
              {REASONS.map((r) => {
                const Icon = r.icon
                return (
                  <motion.div key={r.title} variants={fadeUp} className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-lg bg-brand-blue/8 flex items-center
                      justify-center shrink-0 mt-0.5"
                    >
                      <Icon className="w-5 h-5 text-brand-blue" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-brand-blue mb-1">
                        {r.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed">{r.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div variants={fadeUp} className="mt-9">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red
                  hover:gap-3 transition-all duration-200"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
