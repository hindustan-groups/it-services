/**
 * /about — Premium About page
 */
import { Link } from 'react-router-dom'
import {
  MapPin,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  Users,
  Award,
  Rocket,
  Heart,
  Code2,
  Handshake,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Monitor,
  Smartphone,
  Laptop,
  Bell,
  Cpu,
  Menu,
} from 'lucide-react'
import { Container, Button, SEO } from '@/components/ui'
import { useTeam } from '@/hooks/useTeam'
import { useMilestones, useSiteSettings } from '@/hooks/useContent'

/* ── Static data (company values — not CMS managed) ─────── */
const VALUES = [
  {
    icon: Users,
    title: 'Client-First Always',
    desc: 'Your success is our success. Every decision we make is centered around delivering real value to you.',
  },
  {
    icon: Shield,
    title: 'Transparent & Honest',
    desc: 'Clear communication, honest timelines, and no hidden costs — ever.',
  },
  {
    icon: Code2,
    title: 'Quality Code',
    desc: 'We write clean, maintainable, secure code built to last and scale with your business.',
  },
  {
    icon: Handshake,
    title: 'Long-Term Partners',
    desc: 'We build lasting partnerships, not one-off transactions. We grow together.',
  },
]

// Fallbacks (shown if DB empty)
const FALLBACK_MILESTONES = [
  {
    id: '1',
    year: '2019',
    title: 'Founded',
    desc: 'Hindustan Projects was born in Bhilwara with a mission to bring world-class IT to local businesses.',
  },
  {
    id: '2',
    year: '2020',
    title: 'First 10 Clients',
    desc: 'Delivered web development and digital marketing for 10 businesses across Rajasthan.',
  },
  {
    id: '3',
    year: '2022',
    title: 'Expanded Services',
    desc: 'Launched cloud, DevOps, and mobile app development verticals.',
  },
  {
    id: '4',
    year: '2024',
    title: '40+ Happy Clients',
    desc: 'Crossed 40 happy clients mark, serving businesses pan-India.',
  },
  {
    id: '5',
    year: '2025',
    title: 'Growing Strong',
    desc: 'Expanding our team and services to cover enterprise-level digital transformation.',
  },
]

const FALLBACK_TEAM = [
  {
    id: '1',
    name: 'Rahul Sharma',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 8+ years in web tech and digital strategy.',
  },
  {
    id: '2',
    name: 'Priya Singh',
    role: 'Lead Developer',
    bio: 'Full-stack expert specialising in React, Node.js, and cloud architecture.',
  },
  {
    id: '3',
    name: 'Amit Verma',
    role: 'Digital Marketing Head',
    bio: "Growth hacker behind our clients' SEO and paid campaign results.",
  },
  {
    id: '4',
    name: 'Sneha Joshi',
    role: 'UI/UX Designer',
    bio: 'Crafts beautiful, intuitive interfaces that users love to interact with.',
  },
]

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.12h.05c.53-1 1.84-2.12 3.79-2.12 4.05 0 4.8 2.67 4.8 6.13V24h-4v-8.5c0-2.03-.04-4.63-2.82-4.63-2.83 0-3.26 2.2-3.26 4.48V24h-4V8.5z" />
    </svg>
  )
}

export default function AboutPage() {
  const { data: teamData, isLoading: teamLoading } = useTeam()
  const { data: milestonesData, isLoading: milestonesLoading } = useMilestones()
  const { data: settingsData } = useSiteSettings()

  const team = teamData?.data?.length ? teamData.data : teamLoading ? [] : FALLBACK_TEAM
  const milestones = milestonesData?.data?.length
    ? milestonesData.data
    : milestonesLoading
      ? []
      : FALLBACK_MILESTONES
  const cfg = settingsData?.data || {}

  const stats = [
    { value: `${cfg.stat_projects || '50'}+`, label: 'Projects Delivered', icon: Rocket },
    { value: `${cfg.stat_clients || '40'}+`, label: 'Happy Clients', icon: Heart },
    { value: `${cfg.stat_experience || '5'}+`, label: 'Years Experience', icon: Award },
    { value: `${cfg.stat_cities || '3'}+`, label: 'Cities Served', icon: MapPin },
  ]

  return (
    <>
      <SEO
        title="About Us — IT Company in Bhilwara, Rajasthan"
        description="Hindustan Projects is a technology company based in Bhilwara, Rajasthan founded in 2019. Learn about our story, team, mission and vision."
        path="/about"
        keywords="IT company Bhilwara, technology company Rajasthan, web development company Bhilwara, about Hindustan Projects, IT firm Rajasthan"
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Hindustan Projects',
            url: 'https://hindustanprojects.com/about',
            description:
              'Hindustan Projects is a technology company based in Bhilwara, Rajasthan, helping businesses grow through smart digital solutions.',
          },
        ]}
      />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 lg:pb-24 overflow-hidden bg-[#050e20]">
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
                Hindustan Projects is a technology company based in Bhilwara, Rajasthan — helping
                businesses across India grow faster through smart, affordable, and reliable digital
                solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" as={Link} to="/contact">
                  Work With Us
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  as={Link}
                  to="/portfolio"
                  className="!text-white !border-white/20 hover:!bg-white/10"
                >
                  See Our Work
                </Button>
              </div>
            </div>

            {/* Right: Overlapping 3D Device Mockup Showcase */}
            <div className="relative w-full max-w-md mx-auto lg:max-w-none aspect-[4/3] flex items-center justify-center pt-8 pb-4 lg:py-0">
              {/* Decorative glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-blue/10 to-brand-red/10 rounded-full blur-3xl pointer-events-none" />

              {/* 1. Laptop Base Frame */}
              <div className="relative w-[85%] aspect-[16/10] bg-slate-900 border-[6px] border-slate-950 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 select-none">
                {cfg.about_hero_image ? (
                  <img
                    src={cfg.about_hero_image}
                    alt="Hindustan Projects Corporate Portal"
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  /* Simulated Corporate Dashboard Portal */
                  <div className="w-full h-full bg-[#070b13] flex flex-col text-slate-300 font-sans select-none overflow-hidden">
                    {/* Header */}
                    <div className="h-[12%] bg-slate-950/80 px-3 border-b border-white/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                        <span className="text-[10px] font-black text-white tracking-wider">HINDUSTAN SERVICES</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-1.5 py-0.5 rounded font-bold">V2.4</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Dashboard Workspace */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Sidebar */}
                      <aside className="w-[28%] bg-slate-950/30 border-r border-white/5 p-2 flex flex-col justify-between shrink-0">
                        <div className="space-y-1.5">
                          <div className="text-[6px] text-slate-500 uppercase tracking-widest font-bold px-1 mb-1">Navigation</div>
                          <div className="bg-white/5 text-white px-2 py-1 rounded text-[8px] font-medium flex items-center gap-1.5">
                            <Cpu className="w-2.5 h-2.5 text-brand-red" />
                            <span>System Console</span>
                          </div>
                          <div className="text-slate-400 hover:text-white px-2 py-1 rounded text-[8px] flex items-center gap-1.5 transition-colors cursor-pointer">
                            <Monitor className="w-2.5 h-2.5 text-brand-blue" />
                            <span>Web Portals</span>
                          </div>
                          <div className="text-slate-400 hover:text-white px-2 py-1 rounded text-[8px] flex items-center gap-1.5 transition-colors cursor-pointer">
                            <Smartphone className="w-2.5 h-2.5 text-brand-red" />
                            <span>Mobile Apps</span>
                          </div>
                        </div>
                        <div className="p-1 border border-white/5 bg-slate-950/80 rounded flex items-center gap-1.5 text-[7px] text-slate-500 shrink-0">
                          <MapPin className="w-2.5 h-2.5 text-brand-red shrink-0" />
                          <span className="truncate">Bhilwara, RJ</span>
                        </div>
                      </aside>

                      {/* Main */}
                      <main className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
                        {/* Summary grid */}
                        <div className="grid grid-cols-2 gap-2.5 shrink-0">
                          <div className="bg-slate-950/80 border border-white/5 rounded-lg p-2 shadow-sm space-y-0.5">
                            <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500">Live Projects</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-black text-white">{cfg.stat_projects || '50'}+</span>
                              <span className="text-[6px] text-brand-blue font-bold">Pan-India</span>
                            </div>
                          </div>
                          <div className="bg-slate-950/80 border border-white/5 rounded-lg p-2 shadow-sm space-y-0.5">
                            <span className="text-[6px] font-bold uppercase tracking-wider text-slate-500">Client Rating</span>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-black text-brand-red">5.0 / 5.0</span>
                              <span className="text-[6px] text-emerald-400 font-bold bg-emerald-500/10 px-0.5 rounded">Top Rated</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual graph representation */}
                        <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-lg p-2 shadow-inner flex flex-col justify-between mt-2.5 overflow-hidden">
                          <div className="flex justify-between items-center pb-1 border-b border-white/5 shrink-0">
                            <span className="text-[7px] font-bold text-gray-400">Development Nodes</span>
                            <span className="text-[6px] text-emerald-400 font-mono animate-pulse">● STABLE</span>
                          </div>
                          <div className="flex-1 flex items-end gap-1 px-1.5 py-1 justify-between shrink-0 min-h-[40px]">
                            {[35, 60, 45, 90, 50, 75, 60, 85, 40, 95, 55, 70].map((h, i) => (
                              <div key={i} className="flex-1 bg-brand-blue/35 hover:bg-brand-red rounded-t transition-colors relative group cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950 border border-white/15 px-1 py-0.5 rounded text-[5px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1 z-10 font-bold">Node {i+1}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </main>
                    </div>
                  </div>
                )}
              </div>

              {/* Laptop base keyboard bevel */}
              <div className="absolute bottom-[10%] left-[7.5%] w-[85%] h-[3%] bg-slate-800 rounded-b-lg border-t border-slate-700 shadow-2xl flex justify-center items-start pointer-events-none">
                <div className="w-[12%] h-[40%] bg-slate-900 rounded-b" />
              </div>

              {/* 2. Overlapping iPhone Device Frame (Absolute Offset) */}
              <div className="absolute bottom-[4%] right-[4%] w-[28%] aspect-[9/18.5] bg-slate-900 border-[4.5px] border-slate-950 rounded-[24px] shadow-2xl overflow-hidden ring-1 ring-white/10 z-10 select-none">
                {/* Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[35%] h-[5%] bg-slate-950 rounded-full z-20" />

                {/* iPhone Content */}
                <div className="w-full h-full bg-[#050911] text-slate-300 flex flex-col justify-between overflow-hidden relative pt-4 font-sans select-none">
                  {/* Local App Header */}
                  <header className="px-2 py-1.5 border-b border-white/5 flex items-center justify-between shrink-0">
                    <span className="font-heading font-black text-[7px] text-white tracking-widest uppercase">HP PORTAL</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </header>

                  {/* App Dashboard */}
                  <div className="flex-1 p-2 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-1.5">
                      <div className="bg-slate-950/80 border border-white/5 rounded-md p-1.5 space-y-0.5">
                        <div className="text-[5px] text-slate-500 uppercase tracking-wider">App Development</div>
                        <div className="text-[8px] font-bold text-white leading-tight">Android & iOS App</div>
                        {/* Mini progress bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand-red w-[75%] rounded-full" />
                        </div>
                      </div>
                      
                      <div className="bg-slate-950/80 border border-white/5 rounded-md p-1.5 space-y-0.5">
                        <div className="text-[5px] text-slate-500 uppercase tracking-wider">Status</div>
                        <div className="text-[7px] font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
                          Live Tracking Active
                        </div>
                      </div>
                    </div>

                    {/* Bottom action mockup */}
                    <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-md py-1 px-1.5 text-center text-white text-[7px] font-bold cursor-pointer hover:brightness-110 shrink-0">
                      Track Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-0">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-4 sm:px-6 py-5 sm:py-6 group hover:bg-brand-blue/3 transition-colors duration-200 border-b border-r border-gray-100 [&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:[&:nth-child(4)]:border-r-0"
              >
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
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50/60 to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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
                    <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                      Headquartered in
                    </p>
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
                <p className="text-3xl font-bold text-brand-blue font-heading">
                  50<span className="text-brand-red">+</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">Projects Delivered</p>
              </div>
            </div>

            {/* Right: Story text */}
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">
                Our Story
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-6 leading-tight">
                Built in Bhilwara.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">
                  Serving All of India.
                </span>
              </h2>
              <div className="space-y-4 text-text-muted text-sm leading-relaxed mb-8">
                <p>
                  Hindustan Projects was founded with a clear mission: to make world-class IT
                  services accessible to businesses in Bhilwara and Rajasthan — not just the metros.
                </p>
                <p>
                  We saw a gap — local businesses had the ambition to grow digitally but lacked
                  access to affordable, high-quality technology partners who understood their
                  context. That's exactly the gap we fill.
                </p>
                <p>
                  From custom web development and digital marketing to enterprise software and IT
                  consulting, we've helped over 40 businesses transform their operations and expand
                  their online reach across India.
                </p>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative p-5 rounded-xl border border-brand-red/15 bg-brand-red/4 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red rounded-l-xl" />
                  <div className="w-8 h-8 rounded-lg bg-brand-red/15 flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-brand-red" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-brand-blue mb-1">
                    Our Mission
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Empower businesses with reliable, affordable technology that creates lasting
                    competitive advantage.
                  </p>
                </div>
                <div className="relative p-5 rounded-xl border border-brand-blue/15 bg-brand-blue/4 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-l-xl" />
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/15 flex items-center justify-center mb-3">
                    <Eye className="w-4 h-4 text-brand-blue" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-brand-blue mb-1">
                    Our Vision
                  </h3>
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
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-gray-100">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">
              Our Culture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-3">
              What We Stand For
            </h2>
            <p className="text-text-muted max-w-md mx-auto text-sm">
              These values guide every project, every client interaction, and every line of code we
              write.
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
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50/60 border-t border-gray-100">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">
              Our Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue">
              Milestones That Define Us
            </h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue via-brand-red to-transparent hidden sm:block" />
            <div className="space-y-8">
              {(milestonesLoading ? Array.from({ length: 4 }) : milestones).map((m, i) =>
                milestonesLoading ? (
                  <div key={i} className="flex gap-6">
                    <div className="hidden sm:block w-16 h-16 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 h-20 bg-gray-100 rounded-2xl animate-pulse" />
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-6 group">
                    <div className="hidden sm:flex flex-col items-center shrink-0">
                      <div className="w-16 h-16 rounded-full border-2 border-brand-blue bg-white flex flex-col items-center justify-center shadow-md group-hover:bg-brand-blue transition-colors duration-300">
                        <span className="text-xs font-bold text-brand-blue group-hover:text-white transition-colors leading-none">
                          {m.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 group-hover:border-brand-blue/20 group-hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="sm:hidden text-xs font-bold text-brand-red">
                          {m.year} —
                        </span>
                        <h3 className="font-heading text-base font-bold text-brand-blue">
                          {m.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-gray-100">
        <Container>
          <div className="text-center mb-10 lg:mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3 block">
              The People
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mb-3">
              Meet Our Team
            </h2>
            <p className="text-text-muted max-w-md mx-auto text-sm">
              A passionate group of technologists, marketers, and designers — united by one goal:
              your success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                ))
              : team.map((member, index) => {
                  const initials = member.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                  const getStickyClass = (idx) => {
                    const classes = [
                      'sticky sm:relative top-[80px] sm:top-auto z-10 sm:z-auto shadow-[0_8px_30px_rgba(26,62,140,0.06)] scale-[0.91] sm:scale-100 origin-top transition-all duration-300',
                      'sticky sm:relative top-[96px] sm:top-auto z-20 sm:z-auto shadow-[0_12px_36px_rgba(26,62,140,0.09)] scale-[0.94] sm:scale-100 origin-top transition-all duration-300',
                      'sticky sm:relative top-[112px] sm:top-auto z-30 sm:z-auto shadow-[0_16px_40px_rgba(26,62,140,0.12)] scale-[0.97] sm:scale-100 origin-top transition-all duration-300',
                      'sticky sm:relative top-[128px] sm:top-auto z-40 sm:z-auto shadow-[0_20px_48px_rgba(26,62,140,0.15)] scale-[1] sm:scale-100 origin-top transition-all duration-300',
                    ]
                    return classes[idx] || 'sticky sm:relative top-[128px] sm:top-auto z-40 sm:z-auto shadow-[0_20px_48px_rgba(26,62,140,0.15)] scale-[1] sm:scale-100 origin-top transition-all duration-300'
                  }
                  return (
                    <div
                      key={member.id}
                      className={`group relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 text-center
                        hover:border-brand-blue/20 hover:shadow-[0_12px_30px_rgba(26,62,140,0.12)]
                        hover:-translate-y-1.5 transition-all duration-300 ${getStickyClass(index)}`}
                    >
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
                    </div>
                  )
                })}
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative py-14 sm:py-16 lg:py-20 overflow-hidden">
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
              Let's talk about your goals. We'll suggest the best solutions — no jargon, no
              pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" as={Link} to="/contact">
                Get a Free Consultation
              </Button>
              <Button
                variant="ghost"
                size="lg"
                as={Link}
                to="/services"
                className="!text-white !border-white/25 hover:!bg-white/10"
              >
                Explore Services →
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> No upfront payment
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Reply within 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 50+ happy clients
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
