/**
 * /about — Premium About page
 */
import { Link } from 'react-router-dom'
import {
  MapPin, Target, Eye, CheckCircle2, ArrowRight,
  Users, Award, Rocket, Heart, Code2, Handshake,
  TrendingUp, Shield, Clock, Star
} from 'lucide-react'
import { Container, Button } from '@/components/ui'
import { useTeam } from '@/hooks/useTeam'
import { useMilestones } from '@/hooks/useContent'

/* ── Static data (company values, stats — not CMS managed) ─────── */
const STATS = [
  { value: '50+', label: 'Projects Delivered', icon: Rocket },
  { value: '40+', label: 'Happy Clients', icon: Heart },
  { value: '5+', label: 'Years Experience', icon: Award },
  { value: '3+', label: 'Cities Served', icon: MapPin },
]

const VALUES = [
  { icon: Users, title: 'Client-First Always', desc: 'Your success is our success. Every decision we make is centered around delivering real value to you.' },
  { icon: Shield, title: 'Transparent & Honest', desc: 'Clear communication, honest timelines, and no hidden costs — ever.' },
  { icon: Code2, title: 'Quality Code', desc: 'We write clean, maintainable, secure code built to last and scale with your business.' },
  { icon: Handshake, title: 'Long-Term Partners', desc: 'We build lasting partnerships, not one-off transactions. We grow together.' },
]

// Fallbacks (shown if DB empty)
const FALLBACK_MILESTONES = [
  { id: '1', year: '2019', title: 'Founded', desc: 'Hindustan Projects was born in Bhilwara with a mission to bring world-class IT to local businesses.' },
  { id: '2', year: '2020', title: 'First 10 Clients', desc: 'Delivered web development and digital marketing for 10 businesses across Rajasthan.' },
  { id: '3', year: '2022', title: 'Expanded Services', desc: 'Launched cloud, DevOps, and mobile app development verticals.' },
  { id: '4', year: '2024', title: '40+ Happy Clients', desc: 'Crossed 40 happy clients mark, serving businesses pan-India.' },
  { id: '5', year: '2025', title: 'Growing Strong', desc: 'Expanding our team and services to cover enterprise-level digital transformation.' },
]

const FALLBACK_TEAM = [
  { id: '1', name: 'Rahul Sharma', role: 'Founder & CEO', bio: 'Visionary leader with 8+ years in web tech and digital strategy.' },
  { id: '2', name: 'Priya Singh', role: 'Lead Developer', bio: 'Full-stack expert specialising in React, Node.js, and cloud architecture.' },
  { id: '3', name: 'Amit Verma', role: 'Digital Marketing Head', bio: "Growth hacker behind our clients' SEO and paid campaign results." },
  { id: '4', name: 'Sneha Joshi', role: 'UI/UX Designer', bio: 'Crafts beautiful, intuitive interfaces that users love to interact with.' },
]

export default function AboutPage() {
  const { data: teamData, isLoading: teamLoading } = useTeam()
  const { data: milestonesData, isLoading: milestonesLoading } = useMilestones()

  const team = teamData?.data?.length ? teamData.data : (teamLoading ? [] : FALLBACK_TEAM)
  const milestones = milestonesData?.data?.length ? milestonesData.data : (milestonesLoading ? [] : FALLBACK_MILESTONES)
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-[#050e20]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-red/15 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                Who We Are
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight mb-5">
                Bhilwara's Premier{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-400">
                  IT Partner
                </span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8">
                Hindustan Projects is a technology company based in Bhilwara, Rajasthan —
                helping businesses across India grow faster through smart, affordable,
                and reliable digital solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" as={Link} to="/contact">
                  Work With Us
                </Button>
                <Button variant="ghost" size="lg" as={Link} to="/portfolio"
                  className="!text-white !border-white/20 hover:!bg-white/10">
                  See Our Work
                </Button>
              </div>
            </div>

            {/* Right: info cards in 2-column grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { icon: MapPin,     label: 'Headquartered', value: 'Bhilwara, Rajasthan' },
                { icon: Clock,      label: 'Founded',        value: '2019' },
                { icon: Users,      label: 'Team Size',      value: '10+ Professionals' },
                { icon: Star,       label: 'Client Rating',  value: '5.0 / 5.0' },
                { icon: TrendingUp, label: 'Growth (YoY)',   value: '200%' },
                { icon: Award,      label: 'Projects Done',  value: '50+' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-white/20 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-red/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-0">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-6 py-6 group hover:bg-brand-blue/3 transition-colors duration-200">
                <div className="w-11 h-11 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/14 transition-colors">
                  <stat.icon className="w-5 h-5 text-brand-blue" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-red font-heading">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Story Section ────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-gray-50/60 to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Image + overlay */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80&auto=format&fit=crop"
                  alt="Hindustan Projects team collaborating"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/60 via-transparent to-transparent" />
                {/* Badge bottom-left */}
                <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Headquartered in</p>
                    <p className="text-xs text-text-muted font-semibold">Bhilwara, Rajasthan</p>
                  </div>
                </div>
                {/* Badge top-right */}
                <div className="absolute top-5 right-5 bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Est. 2019
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl border border-gray-100 shadow-xl p-5 hidden lg:block">
                <p className="text-3xl font-bold text-brand-blue font-heading">50<span className="text-brand-red">+</span></p>
                <p className="text-xs text-text-muted mt-0.5">Projects Delivered</p>
              </div>
            </div>

            {/* Right: Story text */}
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">Our Story</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-6 leading-tight">
                Built in Bhilwara.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Serving All of India.</span>
              </h2>
              <div className="space-y-4 text-text-muted text-sm leading-relaxed mb-8">
                <p>
                  Hindustan Projects was founded with a clear mission: to make world-class
                  IT services accessible to businesses in Bhilwara and Rajasthan — not just
                  the metros.
                </p>
                <p>
                  We saw a gap — local businesses had the ambition to grow digitally but
                  lacked access to affordable, high-quality technology partners who understood
                  their context. That's exactly the gap we fill.
                </p>
                <p>
                  From custom web development and digital marketing to enterprise software and
                  IT consulting, we've helped over 40 businesses transform their operations
                  and expand their online reach across India.
                </p>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative p-5 rounded-xl border border-brand-red/15 bg-brand-red/4 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red rounded-l-xl" />
                  <div className="w-8 h-8 rounded-lg bg-brand-red/15 flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-brand-red" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-brand-blue mb-1">Our Mission</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Empower businesses with reliable, affordable technology that creates lasting competitive advantage.
                  </p>
                </div>
                <div className="relative p-5 rounded-xl border border-brand-blue/15 bg-brand-blue/4 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-l-xl" />
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/15 flex items-center justify-center mb-3">
                    <Eye className="w-4 h-4 text-brand-blue" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-brand-blue mb-1">Our Vision</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Become the most trusted IT partner for growing businesses in Rajasthan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">Our Culture</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-3">What We Stand For</h2>
            <p className="text-text-muted max-w-md mx-auto text-sm">
              These values guide every project, every client interaction, and every line of code we write.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="group p-6 rounded-2xl border border-gray-100 bg-white
                  hover:border-brand-blue/20 hover:shadow-[0_8px_30px_rgba(26,62,140,0.08)]
                  hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <v.icon className="w-6 h-6 text-white" strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-blue mb-2">{v.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Timeline / Milestones ─────────────────────────────────── */}
      <section className="py-20 bg-gray-50/60 border-t border-gray-100">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">Our Journey</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue">
              Milestones That Define Us
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-red to-transparent hidden sm:block" />
            <div className="space-y-8">
              {(milestonesLoading ? Array.from({length: 4}) : milestones).map((m, i) => (
                milestonesLoading ? (
                  <div key={i} className="flex gap-6">
                    <div className="hidden sm:block w-16 h-16 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 h-20 bg-gray-100 rounded-2xl animate-pulse" />
                  </div>
                ) : (
                <div key={m.id} className="flex gap-6 group">
                  <div className="hidden sm:flex flex-col items-center shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-blue bg-white flex flex-col items-center justify-center shadow-md group-hover:bg-brand-blue transition-colors duration-300">
                      <span className="text-xs font-bold text-brand-blue group-hover:text-white transition-colors leading-none">{m.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 group-hover:border-brand-blue/20 group-hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="sm:hidden text-xs font-bold text-brand-red">{m.year} —</span>
                      <h3 className="font-heading text-base font-bold text-brand-blue">{m.title}</h3>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{m.desc}</p>
                  </div>
                </div>
                )
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">The People</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-3">Meet Our Team</h2>
            <p className="text-text-muted max-w-md mx-auto text-sm">
              A passionate group of technologists, marketers, and designers — united by one goal: your success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
                ))
              : team.map((member) => {
                  const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                  return (
                    <div key={member.id}
                      className="group bg-white rounded-2xl border border-gray-100 p-6 text-center
                        hover:border-transparent hover:shadow-[0_12px_40px_rgba(26,62,140,0.10)]
                        hover:-translate-y-1.5 transition-all duration-300"
                    >
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-2 ring-brand-blue/10"
                          loading="lazy" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-blue-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                          {initials}
                        </div>
                      )}
                      <h3 className="font-heading text-base font-bold text-brand-blue mb-0.5">{member.name}</h3>
                      <p className="text-xs font-semibold text-brand-red mb-3">{member.role}</p>
                      {member.bio && <p className="text-xs text-text-muted leading-relaxed">{member.bio}</p>}
                      {member.linkedinUrl && (
                        <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-blue/60
                            hover:text-brand-blue mt-3 transition-colors">
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  )
                })
            }
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-[#1e3a7a] to-[#0a1f5c]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/70 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Let's Build Together
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="text-white">Ready to Grow Your Business</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-400">
                With the Right Tech Partner?
              </span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Let's talk about your goals. We'll suggest the best solutions — no jargon, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" as={Link} to="/contact">
                Get a Free Consultation
              </Button>
              <Button variant="ghost" size="lg" as={Link} to="/services"
                className="!text-white !border-white/25 hover:!bg-white/10">
                Explore Services →
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> No upfront payment</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Reply within 24 hours</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 50+ happy clients</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
