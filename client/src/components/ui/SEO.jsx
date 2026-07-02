/**
 * SEO.jsx — Per-page meta tags using react-helmet-async
 */
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Hindustan Projects'
const DEFAULT_DESC =
  'Hindustan Projects — IT services company in Bhilwara, Rajasthan. Custom web development, digital marketing, IT consulting, and more.'
const BASE_URL = 'https://hindustanprojects.com'

export default function SEO({ title, description, path = '', noIndex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — IT Services, Bhilwara`
  const desc = description || DEFAULT_DESC
  const canonical = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* JSON-LD — Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Hindustan Projects',
          url: BASE_URL,
          description: DEFAULT_DESC,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bhilwara',
            addressRegion: 'Rajasthan',
            addressCountry: 'IN',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'info@hindustanprojects.com',
          },
        })}
      </script>
    </Helmet>
  )
}
