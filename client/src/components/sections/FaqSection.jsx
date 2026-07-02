import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, SectionHeading } from '@/components/ui'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'
import { useFaqs } from '@/hooks/useContent'

const FALLBACK_FAQS = [
  { id: '1', question: 'How long does it take to build a website?', answer: 'For a standard corporate website, 3–4 weeks. Complex e-commerce or custom portals take 6–8 weeks. We provide clear phase-wise timelines at project start.' },
  { id: '2', question: 'Do you provide support after launch?', answer: 'Yes. Every project includes 30 days of complimentary support. After that, we offer flexible annual maintenance plans covering security, updates, and SEO audits.' },
  { id: '3', question: 'Will my website be mobile-friendly and SEO optimized?', answer: 'Absolutely. Every layout is fully responsive and we implement on-page SEO best practices from day one.' },
  { id: '4', question: 'What are your payment terms?', answer: '30% deposit to start, 40% on design approval, 30% on final delivery. We also offer monthly retainer models.' },
]

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-black/5 bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-heading
          text-sm sm:text-base font-bold text-brand-blue hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-brand-red shrink-0" />
          {question}
        </span>
        <ChevronDown className={`w-4 h-4 text-brand-blue/40 shrink-0 transition-transform
          duration-300 ${isOpen ? 'rotate-180 text-brand-red' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-5 pt-0 text-sm text-text-muted leading-relaxed
              border-t border-gray-100/50 bg-gray-50/20">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const { data, isLoading } = useFaqs()
  const faqs = data?.data?.length ? data.data : (isLoading ? [] : FALLBACK_FAQS)

  return (
    <section className="py-20 bg-bg-base border-t border-gray-100" aria-labelledby="faq-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: heading */}
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={viewportOnce} variants={fadeUp}
              className="sticky top-28"
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-red">
                Got Questions?
              </span>
              <h2 id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mt-3 mb-4">
                Frequently Asked <span className="text-brand-red">Questions</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                Can&apos;t find the answer? Reach out via our contact form or give us a
                call — our team is happy to help!
              </p>
            </motion.div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-7">
            <motion.div
              variants={staggerContainer} initial="hidden"
              whileInView="visible" viewport={viewportOnce}
              className="space-y-4"
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                  ))
                : faqs.map((faq, idx) => (
                    <motion.div key={faq.id} variants={fadeUp}>
                      <FaqItem
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === idx}
                        onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                      />
                    </motion.div>
                  ))
              }
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  )
}
