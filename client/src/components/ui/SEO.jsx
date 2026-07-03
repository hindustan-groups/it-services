/**
 * SEO.jsx — Complete SEO component
 * Handles: title, meta, OG, Twitter Cards, canonical, JSON-LD schemas
 * Supports: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList
 */
import { Helmet } from 'react-helmet-async'

export const SITE = {
  name: 'Hindustan Projects',
  url: 'https://hindustanprojects.com',
  description:
    'Hindustan Projects is a leading IT services company in Bhilwara, Rajasthan offering custom web development, digital marketing, IT consulting, mobile app development, and SEO services.',
  phone: '+91 99999 99999',
  email: 'info@hindustanprojects.com',
  address: {
    street: 'Bhilwara',
    city: 'Bhilwara',
    state: 'Rajasthan',
    postalCode: '311001',
    country: 'IN',
  },
  geo: { lat: 25.3478, lng: 74.6367 },
  logo: 'https://hindustanprojects.com/favicon-32x32.png',
  ogImage: 'https://hindustanprojects.com/og-image.png',
  twitterHandle: '@hindustanprojects',
  founded: '2019',
  keywords:
    'IT services Bhilwara, web development Rajasthan, digital marketing Bhilwara, IT company Rajasthan, custom software development, SEO services India',
}

// ── JSON-LD Schemas ────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE.logo,
    },
    description: SITE.description,
    foundingDate: SITE.founded,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      email: SITE.email,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: [],
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.name,
    image: SITE.ogImage,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    description: SITE.description,
    priceRange: '$$',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, UPI',
    openingHours: 'Mo-Sa 09:00-18:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: `https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}`,
    servedCuisine: null,
    knowsAbout: [
      'Web Development',
      'Digital Marketing',
      'IT Consulting',
      'Mobile App Development',
      'SEO',
      'Branding',
    ],
    areaServed: [
      { '@type': 'City', name: 'Bhilwara' },
      { '@type': 'State', name: 'Rajasthan' },
      { '@type': 'Country', name: 'India' },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function serviceSchema({ title, description, url, serviceType }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
    },
  }
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  }
}

// ── Main SEO Component ─────────────────────────────────────────

export default function SEO({
  title,
  description,
  path = '',
  noIndex = false,
  ogType = 'website',
  ogImage,
  schemas = [],
  keywords,
  breadcrumbs,
}) {
  const fullTitle = title
    ? `${title} | ${SITE.name} — IT Services, Bhilwara`
    : `${SITE.name} — IT Services Company in Bhilwara, Rajasthan`
  const desc = description || SITE.description
  const canonical = `${SITE.url}${path}`
  const image = ogImage || SITE.ogImage

  // Default schemas on every page
  const defaultSchemas = [organizationSchema(), websiteSchema()]

  // Add LocalBusiness on home and contact pages
  if (path === '/' || path === '/contact') {
    defaultSchemas.push(localBusinessSchema())
  }

  // Add breadcrumb if provided
  if (breadcrumbs) {
    defaultSchemas.push(breadcrumbSchema(breadcrumbs))
  }

  const allSchemas = [...defaultSchemas, ...schemas]

  return (
    <Helmet>
      {/* Basic */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords || SITE.keywords} />
      <link rel="canonical" href={canonical} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Geo tags — Local SEO */}
      <meta name="geo.region" content="IN-RJ" />
      <meta name="geo.placename" content="Bhilwara, Rajasthan" />
      <meta name="geo.position" content={`${SITE.geo.lat};${SITE.geo.lng}`} />
      <meta name="ICBM" content={`${SITE.geo.lat}, ${SITE.geo.lng}`} />

      {/* JSON-LD schemas */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
