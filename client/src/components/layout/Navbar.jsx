import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, Button } from '@/components/ui'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

// ── Letter-by-letter animation component ──────────────────────
function AnimatedLogo({ isTransparent }) {
  const word1 = 'Hindustan'
  const word2 = 'Projects'

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055 } },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <motion.span
      className="font-heading text-xl font-bold tracking-tight flex items-baseline gap-[3px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Hindustan Projects"
    >
      {/* "Hindustan" — red or light red */}
      {word1.split('').map((char, i) => (
        <motion.span
          key={`h-${i}`}
          variants={letterVariants}
          className={`inline-block transition-colors duration-350 ${
            isTransparent ? 'text-brand-red-light' : 'text-brand-red'
          }`}
        >
          {char}
        </motion.span>
      ))}
      {/* space */}
      <span className="inline-block w-1" aria-hidden="true" />
      {/* "Projects" — blue or white */}
      {word2.split('').map((char, i) => (
        <motion.span
          key={`p-${i}`}
          variants={letterVariants}
          className={`inline-block transition-colors duration-350 ${
            isTransparent ? 'text-white' : 'text-brand-blue'
          }`}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isHomepage = location.pathname === '/'
  const isTransparent = isHomepage && !isScrolled && !menuOpen

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-350 ${
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-bg-base border-b border-black/5 shadow-[0_2px_12px_0_rgba(26,26,26,0.08)]'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center shrink-0 focus-visible:outline-none">
            <AnimatedLogo isTransparent={isTransparent} />
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 group/navlink inline-block
                    ${isTransparent
                      ? isActive(link.href)
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : isActive(link.href)
                        ? 'text-brand-blue bg-brand-blue/5'
                        : 'text-text-dark hover:text-brand-blue hover:bg-brand-blue/5'
                    }`}
                >
                  {link.label}
                  {/* Animated underline indicator */}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full origin-left
                      transition-transform duration-250 ease-out
                      ${isTransparent ? 'bg-white' : 'bg-brand-red'}
                      ${isActive(link.href)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover/navlink:scale-x-100'
                      }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:block">
            <Button variant="primary" size="sm" as={Link} to="/contact">
              Get a Quote
            </Button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`md:hidden p-2 rounded-md transition-all duration-150 active:scale-95 focus-visible:outline-none
              focus-visible:ring-2 ${
                isTransparent
                  ? 'text-white hover:bg-white/10 focus-visible:ring-white'
                  : 'text-brand-blue hover:bg-brand-blue/5 focus-visible:ring-brand-blue'
              }`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all duration-200"
              style={menuOpen ? { transform: 'translateY(8px) rotate(45deg)' } : {}} />
            <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all duration-200"
              style={menuOpen ? { opacity: 0 } : {}} />
            <span className="block w-5 h-0.5 bg-current transition-all duration-200"
              style={menuOpen ? { transform: 'translateY(-8px) rotate(-45deg)' } : {}} />
          </button>
        </nav>
      </Container>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 border-t border-gray-100/50 bg-bg-base' : 'max-h-0'
        }`}
      >
        <Container>
          <ul className="py-3 space-y-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive(link.href)
                      ? 'text-brand-blue bg-brand-blue/5'
                      : 'text-text-dark hover:text-brand-blue hover:bg-brand-blue/5'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 pb-1">
              <Button variant="primary" size="sm" fullWidth as={Link} to="/contact"
                onClick={() => setMenuOpen(false)}>
                Get a Quote
              </Button>
            </li>
          </ul>
        </Container>
      </div>
    </header>
  )
}
