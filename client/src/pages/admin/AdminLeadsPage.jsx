/**
 * Admin Leads — Table with status filter + update
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Trash2, ChevronDown } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const STATUS_COLORS = {
  NEW:       'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  CLOSED:    'bg-green-100 text-green-700',
}

export default function AdminLeadsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-leads', statusFilter],
    queryFn: () => api.get(`/admin/leads${statusFilter ? `?status=${statusFilter}` : ''}`).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/leads/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-leads'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/leads/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-leads'] }),
  })

  const leads = data ?? []

  return (
    <>
      <SEO title="Leads" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Contact Leads</h1>
            <p className="text-sm text-gray-500 mt-1">All form submissions from the website.</p>
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200
                rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30
                focus:border-brand-blue cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CLOSED">Closed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4
              text-gray-400 pointer-events-none" />
          </div>
        </div>

        {isError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50
            border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Failed to load leads.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      No leads yet.
                    </td>
                  </tr>
                ) : leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{lead.email}</p>
                      {lead.phone && <p className="text-gray-400 text-xs">{lead.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{lead.serviceInterested || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <p className="truncate">{lead.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={e => updateMutation.mutate({ id: lead.id, status: e.target.value })}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0
                          cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/30
                          ${STATUS_COLORS[lead.status]}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this lead?')) {
                            deleteMutation.mutate(lead.id)
                          }
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
                          hover:bg-red-50 transition-colors"
                        aria-label="Delete lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
