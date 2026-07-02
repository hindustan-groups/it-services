/**
 * Admin Dashboard — Overview stats + quick actions
 */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  MessageSquare, Briefcase, FolderKanban, Users,
  AlertCircle, ArrowRight, Star, HelpCircle, Flag,
  Handshake, SlidersHorizontal, TrendingUp,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function StatCard({ icon: Icon, label, value, color, to }) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4
      hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold font-heading text-gray-900">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
      {to && <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

const QUICK_ACTIONS = [
  { label: 'View Leads',       to: '/admin/leads',         icon: MessageSquare,    color: 'text-red-600 bg-red-50 border-red-100' },
  { label: 'Manage Services',  to: '/admin/services',      icon: Briefcase,         color: 'text-brand-blue bg-brand-blue/5 border-brand-blue/15' },
  { label: 'Add Project',      to: '/admin/projects',      icon: FolderKanban,     color: 'text-brand-blue bg-brand-blue/5 border-brand-blue/15' },
  { label: 'Manage Team',      to: '/admin/team',          icon: Users,            color: 'text-brand-blue bg-brand-blue/5 border-brand-blue/15' },
  { label: 'Testimonials',     to: '/admin/testimonials',  icon: Star,             color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
  { label: 'FAQs',             to: '/admin/faqs',          icon: HelpCircle,       color: 'text-violet-600 bg-violet-50 border-violet-100' },
  { label: 'Milestones',       to: '/admin/milestones',    icon: Flag,             color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { label: 'Partners',         to: '/admin/partners',      icon: Handshake,        color: 'text-orange-600 bg-orange-50 border-orange-100' },
  { label: 'Site Settings',    to: '/admin/site-settings', icon: SlidersHorizontal,color: 'text-gray-700 bg-gray-50 border-gray-200' },
]

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  })

  return (
    <>
      <SEO title="Dashboard" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Here's an overview of your website content.
          </p>
        </div>

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50
            border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Could not load stats. Make sure the backend server is running.
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={MessageSquare} label="New Leads"       color="bg-brand-red"    to="/admin/leads"    value={isLoading ? '…' : data?.newLeads} />
          <StatCard icon={TrendingUp}    label="Total Leads"     color="bg-orange-500"   to="/admin/leads"    value={isLoading ? '…' : data?.totalLeads} />
          <StatCard icon={FolderKanban}  label="Projects"        color="bg-brand-blue"   to="/admin/projects" value={isLoading ? '…' : data?.totalProjects} />
          <StatCard icon={Briefcase}     label="Active Services" color="bg-emerald-500"  to="/admin/services" value={isLoading ? '…' : data?.totalServices} />
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-gray-800 mb-4">
            Manage Content
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {QUICK_ACTIONS.map(a => {
              const Icon = a.icon
              return (
                <Link key={a.to} to={a.to}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border
                    text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm
                    ${a.color}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold leading-tight">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Getting started checklist */}
        <div className="bg-brand-blue/3 border border-brand-blue/15 rounded-xl p-5">
          <h2 className="font-heading text-base font-semibold text-brand-blue mb-3">
            Setup Checklist
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              { text: 'Update contact info (phone, email, address)', to: '/admin/site-settings' },
              { text: 'Add your social media links', to: '/admin/site-settings' },
              { text: 'Add your team members with photos', to: '/admin/team' },
              { text: 'Add real client testimonials', to: '/admin/testimonials' },
              { text: 'Add portfolio projects with thumbnails', to: '/admin/projects' },
              { text: 'Update services with features & tech stack', to: '/admin/services' },
            ].map(item => (
              <li key={item.text}>
                <Link to={item.to}
                  className="flex items-center gap-2 hover:text-brand-blue transition-colors group">
                  <span className="w-4 h-4 rounded border-2 border-gray-300 group-hover:border-brand-blue shrink-0 transition-colors" />
                  {item.text}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
