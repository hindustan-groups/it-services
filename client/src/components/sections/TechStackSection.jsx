import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, SectionHeading } from '@/components/ui'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const CATEGORIES = [
  'All',
  'Web & Frontend',
  'Backend & API',
  'Mobile Apps',
  'Cloud & Database',
  'CMS & E-commerce',
]

const TECHNOLOGIES = [
  // Web / Frontend
  {
    name: 'React.js',
    cat: 'Web & Frontend',
    color: 'hover:border-cyan-400/30 hover:text-cyan-400',
  },
  { name: 'Next.js', cat: 'Web & Frontend', color: 'hover:border-white/30 hover:text-white' },
  {
    name: 'Tailwind CSS',
    cat: 'Web & Frontend',
    color: 'hover:border-sky-400/30 hover:text-sky-400',
  },
  {
    name: 'JavaScript',
    cat: 'Web & Frontend',
    color: 'hover:border-amber-400/30 hover:text-amber-400',
  },
  {
    name: 'HTML5 & CSS3',
    cat: 'Web & Frontend',
    color: 'hover:border-orange-500/30 hover:text-orange-500',
  },

  // Backend / API
  {
    name: 'Node.js',
    cat: 'Backend & API',
    color: 'hover:border-green-500/30 hover:text-green-500',
  },
  {
    name: 'Express.js',
    cat: 'Backend & API',
    color: 'hover:border-gray-300/30 hover:text-gray-300',
  },
  {
    name: 'Python & Django',
    cat: 'Backend & API',
    color: 'hover:border-blue-500/30 hover:text-blue-500',
  },
  {
    name: 'PHP & Laravel',
    cat: 'Backend & API',
    color: 'hover:border-red-500/30 hover:text-red-500',
  },

  // Mobile Apps
  {
    name: 'React Native',
    cat: 'Mobile Apps',
    color: 'hover:border-cyan-400/30 hover:text-cyan-400',
  },
  { name: 'Flutter', cat: 'Mobile Apps', color: 'hover:border-blue-400/30 hover:text-blue-400' },
  {
    name: 'Swift (iOS)',
    cat: 'Mobile Apps',
    color: 'hover:border-orange-500/30 hover:text-orange-500',
  },
  {
    name: 'Kotlin (Android)',
    cat: 'Mobile Apps',
    color: 'hover:border-violet-500/30 hover:text-violet-500',
  },

  // Cloud & Database
  {
    name: 'MongoDB',
    cat: 'Cloud & Database',
    color: 'hover:border-green-600/30 hover:text-green-500',
  },
  {
    name: 'PostgreSQL',
    cat: 'Cloud & Database',
    color: 'hover:border-blue-600/30 hover:text-blue-500',
  },
  {
    name: 'AWS Cloud',
    cat: 'Cloud & Database',
    color: 'hover:border-amber-500/30 hover:text-amber-500',
  },
  {
    name: 'Firebase',
    cat: 'Cloud & Database',
    color: 'hover:border-yellow-500/30 hover:text-yellow-500',
  },
  {
    name: 'DigitalOcean',
    cat: 'Cloud & Database',
    color: 'hover:border-blue-400/30 hover:text-blue-400',
  },

  // CMS & E-commerce
  {
    name: 'WordPress',
    cat: 'CMS & E-commerce',
    color: 'hover:border-sky-500/30 hover:text-sky-500',
  },
  {
    name: 'Shopify Development',
    cat: 'CMS & E-commerce',
    color: 'hover:border-green-500/30 hover:text-green-500',
  },
  {
    name: 'WooCommerce',
    cat: 'CMS & E-commerce',
    color: 'hover:border-purple-500/30 hover:text-purple-500',
  },
]

export default function TechStackSection() {
  const [activeCat, setActiveCat] = useState('All')

  const filtered =
    activeCat === 'All' ? TECHNOLOGIES : TECHNOLOGIES.filter((t) => t.cat === activeCat)

  return (
    <section
      className="py-20 bg-brand-blue-dark text-white relative overflow-hidden"
      aria-labelledby="tech-heading"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue-light/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/5 blur-[120px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <SectionHeading
            id="tech-heading"
            eyebrow="Our Technology Stack"
            title="Technologies We Trust"
            subtitle="We build high-performance applications using industry-leading, secure, and modern frameworks."
            className="mb-14 text-center"
            light
          />
        </motion.div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`relative px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 border cursor-pointer overflow-hidden active:scale-95 ${
                activeCat === cat
                  ? 'border-brand-red text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {activeCat === cat && (
                <motion.span
                  layoutId="activeTechTab"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-brand-red -z-10"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Grid of technologies */}
        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={t.name}
                className={`bg-white/5 border border-white/8 rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all duration-300 ${t.color}`}
              >
                <span className="font-heading text-sm font-semibold tracking-wide">{t.name}</span>
                <span className="text-[10px] text-white/40 mt-1 uppercase tracking-wider font-medium">
                  {t.cat}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
