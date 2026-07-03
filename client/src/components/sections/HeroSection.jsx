/**
 * HeroSection — Professional corporate hero, no external images needed.
 * Deep blue gradient background with geometric accents.
 */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'
import professionalHero from '@/assets/professional_hero.png'

// ── Animation variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const wordVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.08 },
  }),
}

const HEADLINE_LINE1 = ['Building', 'Digital', 'Solutions']
const HEADLINE_LINE2 = ['That', 'Drive', 'Business', 'Growth']

const TRUST_POINTS = [
  'Custom websites tailored to your business',
  'Result-driven digital marketing campaigns',
  'Dedicated support — always reachable',
]

export default function HeroSection() {
  const { data: settingsData } = useSiteSettings()
  const cfg = settingsData?.data || {}

  const stats = [
    { value: `${cfg.stat_projects || '50'}+`, label: 'Projects Delivered' },
    { value: `${cfg.stat_clients || '40'}+`, label: 'Happy Clients' },
    { value: `${cfg.stat_experience || '5'}+`, label: 'Years Experience' },
    { value: `${cfg.stat_cities || '3'}+`, label: 'Cities Served' },
  ]

  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden isolate"
      style={{ minHeight: '100vh' }}
      aria-label="Hero"
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #071530 0%, #0d2460 40%, #1A3E8C 100%)',
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        {/* Red glow — right side */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 80% 40%, rgba(227,30,36,0.18) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-48"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(7,21,48,0.6))',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Main content — pushed below fixed navbar (h-16 = 64px) ── */}
      <div className="flex-1 flex items-center pt-28 lg:pt-28 pb-12 lg:pb-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* ── Left: text ── */}
            <div className="lg:col-span-7">
              {/* Eyebrow */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 mb-3
                  rounded-full border border-white/20 bg-white/8
                  text-white/85 text-xs font-semibold tracking-widest uppercase"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  IT Services — Bhilwara, Rajasthan
                </span>
              </motion.div>

              {/* Headline — word by word */}
              <h1 className="font-heading font-bold leading-[1.1] mb-3 text-white">
                {/* Line 1 */}
                <div className="flex flex-wrap gap-x-3 mb-1">
                  {HEADLINE_LINE1.map((word, i) => (
                    <motion.span
                      key={word}
                      custom={i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                {/* Line 2 — "Drive Business Growth" in light red */}
                <div className="flex flex-wrap gap-x-3">
                  {HEADLINE_LINE2.map((word, i) => (
                    <motion.span
                      key={word}
                      custom={HEADLINE_LINE1.length + i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="visible"
                      className={`inline-block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl ${
                        i >= 1 ? 'text-brand-red-light font-extrabold' : 'text-white'
                      }`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </h1>

              {/* Subtext */}
              <motion.p
                variants={fadeUp}
                custom={0.85}
                initial="hidden"
                animate="visible"
                className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 max-w-lg"
              >
                We design custom websites, run result-driven digital marketing, and provide
                strategic IT consulting — helping businesses across India grow online.
              </motion.p>

              {/* Trust points */}
              <motion.ul
                variants={fadeUp}
                custom={0.95}
                initial="hidden"
                animate="visible"
                className="space-y-2 mb-4"
              >
                {TRUST_POINTS.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="w-4 h-4 text-brand-red-light shrink-0" />
                    {pt}
                  </li>
                ))}
              </motion.ul>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                custom={1.1}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-6"
              >
                <Button
                  variant="primary"
                  size="lg"
                  as={Link}
                  to="/contact"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Get a Free Quote
                </Button>
                <Button
                  size="lg"
                  as={Link}
                  to="/portfolio"
                  className="border border-white/30 bg-white/8 text-white
                    hover:bg-white/15 hover:border-white/50 transition-all duration-200
                    rounded-md font-medium inline-flex items-center justify-center"
                >
                  View Our Work
                </Button>
              </motion.div>
            </div>

            {/* ── Right: Visual image container ── */}
            <motion.div
              variants={fadeUp}
              custom={0.6}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex justify-center items-end relative self-end lg:col-span-5 h-full pt-2"
            >
              <div className="relative w-full max-w-lg self-end mt-auto">
                {/* Glowing background aura behind the arch portal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full bg-brand-blue-light/10 blur-3xl -z-10" />

                {/* Person image - rendered as a premium arch portal, 100% sharp and clear */}
                <div className="relative z-10 overflow-hidden rounded-t-full border-t border-x border-white/20 shadow-2xl">
                  <img
                    src={professionalHero}
                    alt="Hindustan Projects Corporate Professional"
                    className="w-full h-auto max-h-[460px] lg:max-h-[485px] object-cover block"
                    style={{ display: 'block', marginBottom: '-1px' }}
                  />
                </div>

                {/* Floating Badge 1: 5+ Years Experience */}
                <div className="absolute z-20 top-12 -right-6 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-xl border border-black/5 transition-transform duration-300 hover:scale-105">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-red-light text-lg font-bold">5+</span>
                    <div>
                      <p className="font-heading text-xs font-bold text-brand-blue">Years of</p>
                      <p className="text-[10px] text-text-muted">Excellence</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2: 50+ Projects Delivered */}
                <div className="absolute z-20 bottom-12 -left-6 bg-brand-red rounded-xl px-4 py-2.5 shadow-xl transition-transform duration-300 hover:scale-105 border border-white/10">
                  <p className="font-heading text-xs font-bold text-white">50+ Projects</p>
                  <p className="text-[10px] text-white/75">Delivered Successfully</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="border-t border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-3.5 px-6 text-center ${
                  i < stats.length - 1 ? 'border-r border-white/10' : ''
                }`}
              >
                <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/70 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 z-20"
        aria-hidden="true"
      >
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-white/30" />
        </motion.div>
      </motion.div>

      {/* Spin animation keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
