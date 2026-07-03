/**
 * ServicesSection — Homepage services grid.
 * Fetches from GET /api/services via TanStack Query.
 * Shows skeleton on load, error state on failure.
 */
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container, SectionHeading, Card, Badge } from '@/components/ui'
import { ServiceCardSkeleton } from '@/components/ui/Skeleton'
import { useServices } from '@/hooks/useServices'
import { getServiceIcon } from '@/utils/serviceIcons'

function ServiceCard({ service }) {
  const Icon = getServiceIcon(service.icon)

  return (
    <Card
      hoverable
      as={Link}
      to={`/services/${service.slug}`}
      className="p-6 flex flex-col group text-left no-underline"
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg bg-brand-blue/8 flex items-center justify-center mb-5
        group-hover:bg-brand-blue/12 transition-colors duration-200"
      >
        <Icon className="w-6 h-6 text-brand-blue" strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-brand-blue mb-2">{service.title}</h3>

      {/* Short description */}
      <p className="text-sm text-text-muted leading-relaxed flex-1 mb-5">
        {service.shortDescription}
      </p>

      {/* Learn More indicator */}
      <span
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red
          group-hover:gap-2.5 transition-all duration-200"
      >
        Learn More
        <ArrowRight className="w-4 h-4" />
      </span>
    </Card>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-text-muted mb-4">Could not load services. Please check your connection.</p>
      <button
        onClick={onRetry}
        className="text-sm font-medium text-brand-blue underline hover:text-brand-blue-dark"
      >
        Try again
      </button>
    </div>
  )
}

const PLACEHOLDER_SERVICES = [
  {
    id: '1',
    title: 'Web Development',
    slug: 'web-development',
    icon: 'Code2',
    shortDescription:
      'Custom, responsive websites built with modern technologies like React, Node.js, and WordPress. Optimised for speed, SEO, and conversions.',
  },
  {
    id: '2',
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    icon: 'Megaphone',
    shortDescription:
      'Result-driven digital marketing campaigns spanning SEO, Google Ads, Meta Ads, and content marketing to drive high-intent leads.',
  },
  {
    id: '3',
    title: 'IT Consulting & Strategy',
    slug: 'it-consulting-strategy',
    icon: 'Lightbulb',
    shortDescription:
      'Strategic IT advisory to align your technology roadmap with business growth. We help you choose the right systems and architecture.',
  },
  {
    id: '4',
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-solutions',
    icon: 'Monitor',
    shortDescription:
      'End-to-end e-commerce store setup, checkout optimisation, inventory management systems, and secure payment gateway integrations.',
  },
  {
    id: '5',
    title: 'Cloud Solutions & DevOps',
    slug: 'cloud-solutions-devops',
    icon: 'Settings',
    shortDescription:
      'Secure cloud hosting setup, AWS/Google Cloud management, server scaling, and continuous deployment workflows for zero downtime.',
  },
  {
    id: '6',
    title: 'Branding & UI/UX Design',
    slug: 'branding-ui-ux-design',
    icon: 'Layers',
    shortDescription:
      'Premium user interface and user experience designs coupled with complete corporate brand identity systems, logos, and guidelines.',
  },
  {
    id: '7',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: 'Smartphone',
    shortDescription:
      'Native and cross-platform mobile apps for iOS and Android built with React Native and Flutter. Secure, high-performing, and published on App Stores.',
  },
]

export default function ServicesSection() {
  const { data, isLoading } = useServices()
  const services = data?.data?.length ? data.data : isLoading ? [] : PLACEHOLDER_SERVICES

  return (
    <section id="services" className="py-20 bg-white" aria-labelledby="services-heading">
      <Container>
        <SectionHeading
          id="services-heading"
          eyebrow="What We Do"
          title="Our IT Services"
          subtitle="End-to-end technology solutions designed to help your business grow, compete, and thrive in the digital world."
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && services.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services
                .slice(0, 6)
                .map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>

        {/* CTA below grid */}
        {!isLoading && services.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold
                text-brand-blue border border-brand-blue/30 px-6 py-2.5 rounded-md
                hover:bg-brand-blue hover:text-white hover:border-brand-blue
                transition-all duration-200"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}
