/**
 * Admin Dashboard — Overview stats
 */
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, Briefcase, FolderKanban, Users, AlertCircle } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading text-gray-900">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
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
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here's an overview.</p>
        </div>

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50
            border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Could not load stats. Make sure the server is running.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={MessageSquare}
            label="New Leads"
            value={isLoading ? '…' : data?.newLeads}
            color="bg-brand-red"
          />
          <StatCard
            icon={AlertCircle}
            label="Total Leads"
            value={isLoading ? '…' : data?.totalLeads}
            color="bg-orange-500"
          />
          <StatCard
            icon={FolderKanban}
            label="Projects"
            value={isLoading ? '…' : data?.totalProjects}
            color="bg-brand-blue"
          />
          <StatCard
            icon={Briefcase}
            label="Active Services"
            value={isLoading ? '…' : data?.totalServices}
            color="bg-emerald-500"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-gray-800 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'View Leads', href: '/admin/leads' },
              { label: 'Add Service', href: '/admin/services' },
              { label: 'Add Project', href: '/admin/projects' },
              { label: 'Add Team Member', href: '/admin/team' },
            ].map(a => (
              <a
                key={a.href}
                href={a.href}
                className="text-center text-sm font-medium text-brand-blue bg-brand-blue/5
                  hover:bg-brand-blue/10 border border-brand-blue/20 rounded-lg py-2.5
                  transition-colors"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
