/**
 * Admin Dashboard — Overview stats + quick actions (premium polish)
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  MessageSquare, Briefcase, FolderKanban, Users,
  AlertCircle, ArrowRight, Star, HelpCircle, Flag,
  Handshake, SlidersHorizontal, TrendingUp, TrendingDown,
  Activity, Settings, UserCheck,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function StatCard({ icon: Icon, label, value, color, bg, to, trend }) {
  const inner = (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4
      hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200 group`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold font-heading text-gray-900">{value ?? '—'}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.up
              ? <TrendingUp className="w-3 h-3 text-emerald-500" />
              : <TrendingDown className="w-3 h-3 text-red-400" />}
            <span className={`text-[11px] font-medium ${trend.up ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.label}
            </span>
          </div>
        )}
      </div>
      {to && <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-gray-400 shrink-0 self-center transition-colors" />}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

const QUICK_ACTIONS = [
  { label: 'View Leads',      to: '/admin/leads',         icon: MessageSquare,    color: 'text-brand-red',    bg: 'bg-red-50' },
  { label: 'Services',        to: '/admin/services',      icon: Briefcase,        color: 'text-brand-blue',   bg: 'bg-blue-50' },
  { label: 'Projects',        to: '/admin/projects',      icon: FolderKanban,     color: 'text-indigo-600',   bg: 'bg-indigo-50' },
  { label: 'Team',            to: '/admin/team',          icon: Users,            color: 'text-violet-600',   bg: 'bg-violet-50' },
  { label: 'Careers',         to: '/admin/careers',       icon: UserCheck,        color: 'text-emerald-700',  bg: 'bg-emerald-50' },
  { label: 'Testimonials',    to: '/admin/testimonials',  icon: Star,             color: 'text-amber-600',    bg: 'bg-amber-50' },
  { label: 'FAQs',            to: '/admin/faqs',          icon: HelpCircle,       color: 'text-sky-600',      bg: 'bg-sky-50' },
  { label: 'Milestones',      to: '/admin/milestones',    icon: Flag,             color: 'text-emerald-600',  bg: 'bg-emerald-50' },
  { label: 'Partners',        to: '/admin/partners',      icon: Handshake,        color: 'text-orange-600',   bg: 'bg-orange-50' },
  { label: 'Site Settings',   to: '/admin/site-settings', icon: SlidersHorizontal,color: 'text-gray-600',     bg: 'bg-gray-100' },
  { label: 'Account',         to: '/admin/settings',      icon: Settings,         color: 'text-pink-600',     bg: 'bg-pink-50' },
]

const CHECKLIST = [
  { text: 'Update contact info (phone, email, address)', to: '/admin/site-settings' },
  { text: 'Add your social media links', to: '/admin/site-settings' },
  { text: 'Add team members with photos', to: '/admin/team' },
  { text: 'Add real client testimonials', to: '/admin/testimonials' },
  { text: 'Add portfolio projects with thumbnails', to: '/admin/projects' },
  { text: 'Update services with features & tech stack', to: '/admin/services' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  })

  return (
    <>
      <SEO title="Dashboard" noIndex />
      <div className="space-y-6">

        {/* ── Welcome banner ── */}
        <div className="relative rounded-2xl overflow-hidden p-6"
          style={{ background: 'linear-gradient(135deg, #1A3E8C 0%, #0f2660 100%)' }}>
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/15 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs font-medium">All systems operational</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-1" style={{ color: '#fff' }}>
              {getGreeting()} 👋
            </h1>
            <p className="text-white/60 text-sm">
              Here's an overview of your Hindustan Projects website.
            </p>
          </div>
        </div>

        {isError && (
          <div className="flex items-center gap-2.5 text-sm text-amber-700 bg-amber-50
            border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Stats unavailable — backend server may be offline. Content management still works.
          </div>
        )}

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={MessageSquare} label="New Leads"       bg="bg-red-100"     color="text-brand-red"    to="/admin/leads"    value={isLoading ? '…' : data?.newLeads}      trend={{ up: true, label: 'This week' }} />
          <StatCard icon={TrendingUp}    label="Total Leads"     bg="bg-orange-100"  color="text-orange-600"   to="/admin/leads"    value={isLoading ? '…' : data?.totalLeads} />
          <StatCard icon={FolderKanban}  label="Projects"        bg="bg-blue-100"    color="text-brand-blue"   to="/admin/projects" value={isLoading ? '…' : data?.totalProjects} />
          <StatCard icon={Briefcase}     label="Active Services" bg="bg-emerald-100" color="text-emerald-600"  to="/admin/services" value={isLoading ? '…' : data?.totalServices} />
          <StatCard icon={UserCheck}     label="Open Positions"  bg="bg-violet-100"  color="text-violet-600"   to="/admin/careers"  value={isLoading ? '…' : data?.openPositions} />
          <StatCard icon={Users}         label="Applications"    bg="bg-indigo-100"  color="text-indigo-600"   to="/admin/careers"  value={isLoading ? '…' : data?.totalApplications} />
        </div>

        {/* ── Quick actions ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-brand-blue" />
            <h2 className="font-heading text-base font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <Link key={a.to} to={a.to}
                  className="flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl border border-gray-100
                    text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-200 bg-gray-50 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.bg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 leading-tight transition-colors">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Visual Breakdown + Checklist ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Lead Status Breakdown Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-brand-blue" />
                <h2 className="font-heading text-base font-bold text-gray-800">Leads Status Breakdown</h2>
              </div>
              <p className="text-xs text-gray-400 mb-5">Visual summary of website contact form query stages.</p>

              {isLoading ? (
                <div className="space-y-4 py-4">
                  <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Visual segment progress bar */}
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                    {data?.totalLeads > 0 ? (
                      <>
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(data.newLeads / data.totalLeads) * 100}%` }}
                          title={`New: ${data.newLeads}`}
                        />
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${(data.contactedLeads / data.totalLeads) * 100}%` }}
                          title={`Contacted: ${data.contactedLeads}`}
                        />
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(data.closedLeads / data.totalLeads) * 100}%` }}
                          title={`Closed: ${data.closedLeads}`}
                        />
                      </>
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">No leads submitted yet</div>
                    )}
                  </div>

                  {/* Info stats block */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-blue-500 mb-0.5">New</p>
                      <p className="text-xl font-bold text-blue-900">{data?.newLeads ?? 0}</p>
                    </div>
                    <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/50 text-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-amber-600 mb-0.5">Contacted</p>
                      <p className="text-xl font-bold text-amber-900">{data?.contactedLeads ?? 0}</p>
                    </div>
                    <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-emerald-600 mb-0.5">Closed</p>
                      <p className="text-xl font-bold text-emerald-900">{data?.closedLeads ?? 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Setup checklist */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Flag className="w-4 h-4 text-brand-blue" />
              <h2 className="font-heading text-base font-bold text-gray-800">Setup Checklist</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Complete these steps to get your website fully ready.</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-blue to-blue-400 rounded-full" style={{ width: '33%' }} />
            </div>

            <ul className="space-y-1.5">
              {CHECKLIST.map((item, i) => (
                <li key={item.text}>
                  <Link to={item.to}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-5 h-5 rounded-md border-2 border-gray-200 group-hover:border-brand-blue shrink-0 transition-colors flex items-center justify-center">
                      <span className="text-[9px] font-bold text-gray-300 group-hover:text-brand-blue">{i + 1}</span>
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 flex-1 transition-colors">{item.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-blue opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
