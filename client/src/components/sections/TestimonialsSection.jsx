import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, SectionHeading, Card } from '@/components/ui'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { fadeUp, viewportOnce } from '@/utils/motion'
import { useTestimonials } from '@/hooks/useTestimonials'

// Fallback while loading or if DB empty
const PLACEHOLDER = [
  {
    id: '1',
    name: 'Aditya Sharma',
    role: 'Managing Director',
    company: 'Bhilwara Textiles Ltd.',
    text: 'Hindustan Projects completely modernized our operations with their custom ERP and corporate portal. Their local availability combined with world-class engineering standard was exactly what we needed.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Meera Johar',
    role: 'Founder & CEO',
    company: 'Jaipur Crafts E-Store',
    text: 'Dilshan and his team built our custom e-commerce platform and optimized our checkout flow. Within 3 months of launch, our conversion rates jumped by 42%.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Rajesh Singhal',
    role: 'Owner',
    company: 'Singhal Marbles & Granites',
    text: 'We tried multiple marketing agencies but got zero leads. Hindustan Projects designed a targeted SEO and Google Ads strategy. Today we get 15+ high-quality inquiries every week.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { data, isLoading } = useTestimonials()
  const testimonials = data?.data?.length ? data.data : isLoading ? [] : PLACEHOLDER

  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-slide transition effect
  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5500) // Transition every 5.5s
    return () => clearInterval(timer)
  }, [testimonials.length, currentIndex]) // Reset timer when index changes manually

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const t = testimonials[currentIndex]
  const initials = t
    ? t.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <section
      className="py-20 bg-white relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background Graphic elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Success Stories"
            title="What Our Clients Say"
            subtitle="Hear from the business owners who trust us with their growth and digital transformation."
            className="mb-0 mx-auto"
          />
        </motion.div>

        {/* Spotlight Slider Card container */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
          {isLoading ? (
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-12 animate-pulse h-72 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : t ? (
            <div className="relative">
              {/* Actual testimonial card */}
              <Card className="bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 sm:p-14 shadow-lg shadow-gray-100/40 relative overflow-hidden">
                {/* Large watermark quote icon */}
                <Quote
                  className="absolute right-8 top-8 w-24 h-24 text-brand-blue/4 pointer-events-none"
                  strokeWidth={1}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-6 text-amber-500">
                      {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Quote text */}
                    <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 leading-relaxed max-w-2xl italic mb-8">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    {/* Client info profile */}
                    <div className="flex flex-col sm:flex-row items-center gap-3.5 border-t border-gray-200/60 pt-6 w-full max-w-md justify-center">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-md"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full bg-brand-blue flex items-center
                          justify-center font-heading text-sm font-bold text-white shrink-0 border-2 border-white shadow-md"
                        >
                          {initials}
                        </div>
                      )}
                      <div className="text-center sm:text-left">
                        <h4 className="font-heading text-base font-bold text-brand-blue leading-none mb-1">
                          {t.name}
                        </h4>
                        <p className="text-xs text-text-muted">
                          {t.role},{' '}
                          <span className="font-semibold text-brand-red">{t.company}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Card>

              {/* Side Navigation Chevrons */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-all shadow-md active:scale-95 cursor-pointer z-10 hover:bg-gray-50"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-all shadow-md active:scale-95 cursor-pointer z-10 hover:bg-gray-50"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          ) : null}

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-brand-blue' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
