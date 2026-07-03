/**
 * 404 Not Found page
 */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Container, Button, SEO } from '@/components/ui'

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" noIndex />
      <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto text-center"
          >
            {/* 404 number */}
            <div className="relative mb-6">
              <p className="font-heading text-[8rem] sm:text-[10rem] font-black text-brand-blue/8 leading-none select-none">
                404
              </p>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-brand-blue/8 flex items-center justify-center">
                  <Search className="w-9 h-9 text-brand-blue/40" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-blue mb-3">
              Page Not Found
            </h1>
            <p className="text-text-muted text-base leading-relaxed mb-8">
              The page you're looking for doesn't exist or has been moved. Let's get you back on
              track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                as={Link}
                to="/"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Go to Homepage
              </Button>
              <Button variant="outline" size="lg" as={Link} to="/contact">
                Contact Us
              </Button>
            </div>

            {/* Quick links */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">
                Quick Links
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Services', href: '/services' },
                  { label: 'Portfolio', href: '/portfolio' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                ].map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="text-sm text-brand-blue hover:text-brand-red font-medium
                      transition-colors duration-150 px-3 py-1.5 rounded-lg
                      hover:bg-brand-red/5"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>
    </>
  )
}
