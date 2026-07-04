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
    <div className="relative mb-5 mx-auto w-24 h-24 flex items-center justify-center z-10">
      {/* Soft backdrop blur glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue via-transparent to-brand-red blur-md opacity-20 group-hover:opacity-55 group-hover:scale-115 transition-all duration-500" />
      
      {/* Gradient Ring Wrapper */}
      <div className="relative w-full h-full p-[3px] rounded-full bg-gradient-to-tr from-brand-blue/20 via-slate-200 to-brand-red/20 group-hover:from-brand-blue group-hover:via-brand-blue-light group-hover:to-brand-red transition-all duration-500 shadow-sm flex items-center justify-center">
        {/* White spacer ring */}
        <div className="w-full h-full p-[2px] rounded-full bg-white flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-brand-blue/5 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <span className="font-heading text-lg font-extrabold bg-gradient-to-tr from-brand-blue to-brand-blue-light bg-clip-text text-transparent">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamCard({ member }) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="relative overflow-hidden p-6 text-center group border border-slate-100 bg-white hover:border-brand-blue/20 hover:shadow-[0_12px_30px_rgba(26,62,140,0.12)] transition-all duration-300 rounded-2xl">
        {/* Subtle background glow inside the card top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-brand-blue/5 to-transparent blur-2xl rounded-full pointer-events-none" />
        
        {/* Glow point behind photo */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-brand-blue/10 to-brand-red/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {member.photoUrl ? (
          <div className="relative mb-5 mx-auto w-24 h-24 flex items-center justify-center z-10">
            {/* Soft backdrop blur glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue via-transparent to-brand-red blur-md opacity-20 group-hover:opacity-55 group-hover:scale-115 transition-all duration-500" />
            
            {/* Gradient Ring Wrapper */}
            <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-brand-blue/20 via-slate-200 to-brand-red/20 group-hover:from-brand-blue group-hover:via-brand-blue-light group-hover:to-brand-red transition-all duration-500 shadow-sm">
              {/* White spacer ring */}
              <div className="p-[2px] rounded-full bg-white">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-22 h-22 rounded-full object-cover shadow-inner group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ) : (
          <Avatar name={member.name} />
        )}

        <div className="relative z-10">
          <h3 className="font-heading text-base font-bold text-brand-blue group-hover:text-brand-blue-light transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-xs text-brand-red font-semibold uppercase tracking-wider mt-1 mb-3">
            {member.role}
          </p>

          {member.bio && (
            <p className="text-xs text-text-muted leading-relaxed mb-5 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 px-1">
              {member.bio}
            </p>
          )}

          {member.linkedinUrl && (
            <div className="flex justify-center">
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-text-muted bg-slate-50 hover:bg-brand-blue/5 hover:text-brand-blue border border-slate-100 hover:border-brand-blue/20 transition-all duration-300"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            </div>
          )}
        </div>
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
    <section id="team" className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white" aria-labelledby="team-heading">
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
