import { motion } from 'framer-motion'
import { Container, SectionHeading } from '@/components/ui'
import { Search, Compass, Cpu, Rocket } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Discovery & Consultation',
    desc: 'We start by understanding your business goals, target audience, and system requirements. No jargon, just clear roadmap alignment.',
  },
  {
    step: '02',
    icon: Compass,
    title: 'Strategic UI/UX Design',
    desc: 'Our design team creates modern, high-converting prototypes and style guides. We iterate until you are 100% satisfied with the look and feel.',
  },
  {
    step: '03',
    icon: Cpu,
    title: 'Robust Development',
    desc: 'Our developers bring the approved designs to life with clean, secure, and lightning-fast code optimized for all search engines (SEO).',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch & Lifelong Support',
    desc: 'We launch your platform with rigorous quality checks and provide dedicated, ongoing support to ensure zero downtime and continuous growth.',
  },
]

export default function ProcessSection() {
  return (
    <section
      className="py-20 bg-bg-base border-t border-gray-100/50"
      aria-labelledby="process-heading"
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <SectionHeading
            id="process-heading"
            eyebrow="Our Process"
            title="How We Work"
            subtitle="A transparent, step-by-step roadmap from initial concept to a successful, high-performing digital launch."
            className="mb-20"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative"
        >
          {/* Connector dashed line for large screens */}
          <div
            className="absolute top-[32px] left-[15%] right-[15%] h-[2px] hidden lg:block -z-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent 50%, rgba(26,62,140,0.2) 50%)',
              backgroundSize: '16px 2px',
              backgroundRepeat: 'repeat-x',
            }}
            aria-hidden="true"
          />

          {STEPS.map((s) => {
            const Icon = s.icon
            return (
              <motion.div key={s.step} variants={fadeUp} className="relative text-center group">
                {/* Large Ghost Step Number */}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-heading text-6xl font-black text-brand-blue/5 group-hover:text-brand-red-light/10 transition-colors pointer-events-none select-none">
                  {s.step}
                </span>

                {/* Circular Icon Wrapper */}
                <div className="w-16 h-16 rounded-full bg-white border border-black/5 shadow-md flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                  <Icon
                    className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="font-heading text-base font-bold text-brand-blue mb-3 relative z-10">
                  {s.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed px-2">{s.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
