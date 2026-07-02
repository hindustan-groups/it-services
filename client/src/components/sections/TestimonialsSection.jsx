import { motion } from 'framer-motion'
import { Container, SectionHeading, Card } from '@/components/ui'
import { Star } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'
import { useTestimonials } from '@/hooks/useTestimonials'

// Fallback while loading or if DB empty
const PLACEHOLDER = [
  {
    id: '1', name: 'Aditya Sharma', role: 'Managing Director', company: 'Bhilwara Textiles Ltd.',
    text: 'Hindustan Projects completely modernized our operations with their custom ERP and corporate portal. Their local availability combined with world-class engineering standard was exactly what we needed.',
    rating: 5,
  },
  {
    id: '2', name: 'Meera Johar', role: 'Founder & CEO', company: 'Jaipur Crafts E-Store',
    text: 'Dilshan and his team built our custom e-commerce platform and optimized our checkout flow. Within 3 months of launch, our conversion rates jumped by 42%.',
    rating: 5,
  },
  {
    id: '3', name: 'Rajesh Singhal', role: 'Owner', company: 'Singhal Marbles & Granites',
    text: 'We tried multiple marketing agencies but got zero leads. Hindustan Projects designed a targeted SEO and Google Ads strategy. Today we get 15+ high-quality inquiries every week.',
    rating: 5,
  },
]

function TestimonialCard({ t }) {
  const initials = t.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <motion.div variants={fadeUp}>
      <Card className="p-7 h-full flex flex-col justify-between border border-black/5 shadow-sm
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div>
          {/* Stars */}
          <div className="flex gap-1 mb-4 text-amber-500">
            {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-sm text-text-muted leading-relaxed italic mb-6">
            &ldquo;{t.text}&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-3.5 border-t border-gray-100 pt-5 mt-auto">
          {t.avatarUrl ? (
            <img src={t.avatarUrl} alt={t.name}
              className="w-10 h-10 rounded-full object-cover shrink-0" loading="lazy" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-blue/8 flex items-center
              justify-center font-heading text-xs font-bold text-brand-blue shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h4 className="font-heading text-sm font-bold text-brand-blue">{t.name}</h4>
            <p className="text-[11px] text-text-muted">
              {t.role}, <span className="font-semibold text-brand-red">{t.company}</span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const { data, isLoading } = useTestimonials()
  const testimonials = data?.data?.length ? data.data : (isLoading ? [] : PLACEHOLDER)

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
      <Container>
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Success Stories"
            title="What Our Clients Say"
            subtitle="Don't just take our word for it. Hear from the business owners who trust us with their growth."
            className="mb-14"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              ))
            : testimonials.map(t => <TestimonialCard key={t.id} t={t} />)
          }
        </motion.div>
      </Container>
    </section>
  )
}
