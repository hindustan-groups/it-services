import { Link } from 'react-router-dom'
import { Container } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'
import { useServices } from '@/hooks/useServices'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

// Static fallback services list
const FALLBACK_SERVICES = [
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Digital Marketing', href: '/services/digital-marketing' },
  { label: 'IT Consulting', href: '/services/it-consulting' },
  { label: 'Custom Software', href: '/services/custom-software-development' },
  { label: 'SEO & Branding', href: '/services/seo-and-branding' },
]

const SOCIAL_ICONS = {
  linkedin: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
}

export default function Footer() {
  const year = new Date().getFullYear()
  const { data: settingsData } = useSiteSettings()
  const { data: servicesData } = useServices()

  const cfg = settingsData?.data || {}
  const phone = cfg.phone || '+91 99999 99999'
  const email = cfg.email || 'info@hindustanprojects.com'
  const address = cfg.address || 'Bhilwara, Rajasthan 311001, India'

  const socials = [
    { label: 'LinkedIn', href: cfg.linkedin || '#', icon: SOCIAL_ICONS.linkedin },
    { label: 'Instagram', href: cfg.instagram || '#', icon: SOCIAL_ICONS.instagram },
    { label: 'Facebook', href: cfg.facebook || '#', icon: SOCIAL_ICONS.facebook },
  ]

  const serviceLinks = servicesData?.data?.length
    ? servicesData.data.slice(0, 5).map((s) => ({ label: s.title, href: `/services/${s.slug}` }))
    : FALLBACK_SERVICES

  return (
    <footer className="bg-[#050e20] text-white border-t border-white/5" role="contentinfo">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-heading text-xl font-bold tracking-wide">
                <span className="text-brand-red-light">Hindustan </span>
                <span className="text-white">Projects</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Empowering businesses in Bhilwara and beyond with custom web solutions, digital
              marketing, and IT consulting services.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                  className="p-2 rounded-md bg-white/5 border border-white/10
                    hover:border-brand-red-light hover:bg-brand-red hover:text-white
                    hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white hover:translate-x-1.5
                      inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — dynamic from DB */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
              Our Services
            </h3>
            <ul className="space-y-3" role="list">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.href}
                    className="text-sm text-white/70 hover:text-white hover:translate-x-1.5
                      inline-block transition-all duration-200"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — dynamic from Site Settings */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3.5 text-sm text-white/70">
              <p className="flex gap-2.5">
                <svg
                  className="w-4 h-4 mt-0.5 shrink-0 text-brand-red-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{address}</span>
              </p>
              <p className="flex gap-2.5 items-center">
                <svg
                  className="w-4 h-4 shrink-0 text-brand-red-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5s1 2 5 5l.613-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a2 2 0 012-2h-.001z"
                  />
                </svg>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </p>
              <p className="flex gap-2.5 items-center">
                <svg
                  className="w-4 h-4 shrink-0 text-brand-red-light"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {year} Hindustan Projects. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
          <p>Bhilwara, Rajasthan, India</p>
        </div>
      </Container>
    </footer>
  )
}
