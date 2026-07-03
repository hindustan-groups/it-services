import { motion } from 'framer-motion'
import { Container, SectionHeading, Card } from '@/components/ui'
import { ServiceCardSkeleton } from '@/components/ui/Skeleton'
import { useTeam } from '@/hooks/useTeam'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.12h.05c.53-1 1.84-2.12 3.79-2.12 4.05 0 4.8 2.67 4.8 6.13V24h-4v-8.5c0-2.03-.04-4.63-2.82-4.63-2.83 0-3.26 2.2-3.26 4.48V24h-4V8.5z" />
    </svg>
  )
}

/** Initials avatar when no photo available */
function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
      <span className="font-heading text-xl font-bold text-brand-blue">{initials}</span>
    </div>
  )
}

function TeamCard({ member }) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="p-6 text-center group">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-brand-blue/10"
            loading="lazy"
          />
        ) : (
          <Avatar name={member.name} />
        )}

        <h3 className="font-heading text-base font-semibold text-brand-blue">{member.name}</h3>
        <p className="text-xs text-brand-red font-medium mt-0.5 mb-3">{member.role}</p>

        {member.bio && (
          <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
        )}

        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted
              hover:text-brand-blue transition-colors duration-150"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        )}
      </Card>
    </motion.div>
  )
}

/** Fallback placeholder cards when DB is not yet connected */
const PLACEHOLDER_TEAM = [
  {
    id: '1',
    name: 'Mohammad Dilshan',
    role: 'Founder & CEO',
    bio: 'Tech entrepreneur dedicated to empowering local & global businesses with premium digital solutions.',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop',
    linkedinUrl: '#',
  },
  {
    id: '2',
    name: 'Rohan Verma',
    role: 'Lead Software Architect',
    bio: '6+ years in full-stack engineering. Expert in React, Node.js, and cloud architectures (AWS/GCP).',
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop',
    linkedinUrl: '#',
  },
  {
    id: '3',
    name: 'Priya Mehta',
    role: 'Head of UI/UX & Design',
    bio: 'Crafts intuitive, conversion-focused user interfaces and modern corporate brand guidelines.',
    photoUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80&auto=format&fit=crop',
    linkedinUrl: '#',
  },
  {
    id: '4',
    name: 'Karan Singhal',
    role: 'Head of Digital Growth & SEO',
    bio: 'Specialist in search engine optimization and high-ROI multi-channel paid marketing campaigns.',
    photoUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&auto=format&fit=crop',
    linkedinUrl: '#',
  },
]

export default function TeamSection() {
  const { data, isLoading } = useTeam()
  const members = data?.data?.length ? data.data : isLoading ? [] : PLACEHOLDER_TEAM

  return (
    <section id="team" className="py-20 bg-white" aria-labelledby="team-heading">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <SectionHeading
            id="team-heading"
            eyebrow="Our People"
            title="Meet the Team"
            subtitle="The talented individuals behind Hindustan Projects — dedicated to delivering excellence for every client."
            className="mb-14"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : members.map((m) => <TeamCard key={m.id} member={m} />)}
        </motion.div>
      </Container>
    </section>
  )
}
