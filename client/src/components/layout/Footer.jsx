import { Link } from 'react-router-dom'
import { Container } from '@/components/ui'
import { useSiteSettings } from '@/hooks/useContent'
import { useServices } from '@/hooks/useServices'

const QUICK_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services' },
  { label: 'About Us',  href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Careers',   href: '/careers' },
  { label: 'Contact',   href: '/contact' },
]

// Static fallback services list
const FALLBACK_SERVICES = [
  { label: 'Web Development',    href: '/services/web-development' },
  { label: 'Digital Marketing',  href: '/services/digital-marketing' },
  { label: 'IT Consulting',      href: '/services/it-consulting' },
  { label: 'Custom Software',    href: '/services/custom-software-development' },
  { label: 'SEO & Branding',     href: '/services/seo-and-branding' },
]

const SOCIAL_ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.12h.05c.53-1 1.84-2.12 3.79-2.12 4.05 0 4.8 2.67 4.8 6.13V24h-4v-8.5c0-2.03-.04-4.63-2.82-4.63-2.83 0-3.26 2.2-3.26 4.48V24h-4V8.5z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.9 4.9 0 011.77 1.152 4.9 4.9 0 011.153 1.77c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.9 4.9 0 01-1.152 1.77 4.9 4.9 0 01-1.77 1.153c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.9 4.9 0 01-1.77-1.152 4.9 4.9 0 01-1.153-1.77c-.163-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.9 4.9 0 013.788 2.95a4.9 4.9 0 011.77-1.153c.46-.163 1.26-.35 2.43-.403C9.416 2.175 9.796 2.163 12 2.163zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  ),
}

export default function Footer() {
  const year = new Date().getFullYear()
  const { data: settingsData } = useSiteSettings()
  const { data: servicesData }  = useServices()

  const cfg       = settingsData?.data || {}
  const phone     = cfg.phone    || '+91 99999 99999'
  const email     = cfg.email    || 'info@hindustanprojects.com'
  const address   = cfg.address  || 'Bhilwara, Rajasthan 311001, India'

  const socials = [
    { label: 'LinkedIn',  href: cfg.linkedin  || '#', icon: SOCIAL_ICONS.linkedin },
    { label: 'Instagram', href: cfg.instagram || '#', icon: SOCIAL_ICONS.instagram },
    { label: 'Facebook',  href: cfg.facebook  || '#', icon: SOCIAL_ICONS.facebook },
  ]

  const serviceLinks = servicesData?.data?.length
    ? servicesData.data.slice(0, 5).map(s => ({ label: s.title, href: `/services/${s.slug}` }))
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
              Empowering businesses in Bhilwara and beyond with custom web solutions,
              digital marketing, and IT consulting services.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                  className="p-2 rounded-md bg-white/5 border border-white/10
                    hover:border-brand-red-light hover:bg-brand-red hover:text-white
                    hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}
                    className="text-sm text-white/70 hover:text-white hover:translate-x-1.5
                      inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — dynamic from DB */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Our Services
            </h3>
            <ul className="space-y-3" role="list">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <Link to={s.href}
                    className="text-sm text-white/70 hover:text-white hover:translate-x-1.5
                      inline-block transition-all duration-200">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — dynamic from Site Settings */}
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3.5 text-sm text-white/70">
              <p className="flex gap-2.5">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-red-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </p>
              <p className="flex gap-2.5 items-center">
                <svg className="w-4 h-4 shrink-0 text-brand-red-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5s1 2 5 5l.613-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a2 2 0 012-2h-.001z" />
                </svg>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </p>
              <p className="flex gap-2.5 items-center">
                <svg className="w-4 h-4 shrink-0 text-brand-red-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} Hindustan Projects. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
          <p>Bhilwara, Rajasthan, India</p>
        </div>
      </Container>
    </footer>
  )
}
