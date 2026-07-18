import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Trash2,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Calendar,
  Inbox,
  User,
  FolderKanban,
  Newspaper,
  CheckCircle2,
  Search,
  UserCheck,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

export default function AdminRecycleBinPage() {
  const [activeTab, setActiveTab] = useState('leads')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMsg, setStatusMsg] = useState(null)
  const qc = useQueryClient()

  const showStatus = (type, msg) => {
    setStatusMsg({ type, msg })
    setTimeout(() => setStatusMsg(null), 5000)
  }

  // Fetch deleted items
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-recycle-bin'],
    queryFn: () => api.get('/admin/recycle-bin').then((r) => r.data),
  })

  // Restore item mutation
  const restoreMutation = useMutation({
    mutationFn: (payload) => api.post('/admin/recycle-bin/restore', payload),
    onSuccess: (res, variables) => {
      showStatus('success', 'Item restored successfully!')
      qc.invalidateQueries({ queryKey: ['admin-recycle-bin'] })
      if (variables.type === 'lead') {
        qc.invalidateQueries({ queryKey: ['admin-leads'] })
      } else if (variables.type === 'project') {
        qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
        qc.invalidateQueries({ queryKey: ['admin-stats'] })
      } else if (variables.type === 'blog') {
        qc.invalidateQueries({ queryKey: ['admin-blog'] })
      }
    },
    onError: (err) => {
      showStatus('error', err.response?.data?.message || 'Failed to restore item.')
    },
  })

  // Permanent delete mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: ({ id, type }) => api.delete(`/admin/recycle-bin/permanent/${id}?type=${type}`),
    onSuccess: () => {
      showStatus('success', 'Item permanently deleted.')
      qc.invalidateQueries({ queryKey: ['admin-recycle-bin'] })
    },
    onError: (err) => {
      showStatus('error', err.response?.data?.message || 'Failed to delete item permanently.')
    },
  })

  const handleRestore = (id, type) => {
    restoreMutation.mutate({ type, id })
  }

  const handlePermanentDelete = (id, type, title) => {
    if (
      window.confirm(
        `WARNING: Are you sure you want to PERMANENTLY delete "${title}"? This action CANNOT be undone and will delete all associated attachments/data!`
      )
    ) {
      permanentDeleteMutation.mutate({ id, type })
    }
  }

  const items = data ?? { leads: [], projects: [], blog: [], applications: [] }

  // Filter items based on active tab & search query
  const getFilteredItems = () => {
    const q = searchTerm.toLowerCase().trim()
    if (activeTab === 'leads') {
      return items.leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.serviceInterested?.toLowerCase().includes(q)
      )
    }
    if (activeTab === 'projects') {
      return items.projects.filter(
        (p) =>
          p.projectTitle?.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q) ||
          p.assignedTo?.toLowerCase().includes(q)
      )
    }
    if (activeTab === 'blog') {
      return items.blog.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.authorName?.toLowerCase().includes(q)
      )
    }
    if (activeTab === 'applications') {
      return (items.applications ?? []).filter(
        (app) =>
          app.fullName?.toLowerCase().includes(q) ||
          app.email?.toLowerCase().includes(q) ||
          app.phone?.toLowerCase().includes(q) ||
          app.jobPosting?.title?.toLowerCase().includes(q)
      )
    }
    return []
  }

  const filtered = getFilteredItems()

  return (
    <>
      <SEO title="Recycle Bin | Hindustan Projects" />
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-gray-500" />
              Recycle Bin
            </h1>
            <p className="text-sm text-gray-500">
              View, restore, or permanently delete items you soft-deleted.
            </p>
          </div>
        </div>

        {/* Status Msg */}
        {statusMsg && (
          <div
            className={`flex items-center gap-2 text-xs rounded-xl px-4 py-3 border transition-all ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                : 'bg-red-50 text-red-700 border-red-150'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.msg}</span>
          </div>
        )}

        {/* Tab Controls & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-gray-250 pb-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-150 self-start">
            <button
              onClick={() => {
                setActiveTab('leads')
                setSearchTerm('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'leads'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Contact Leads ({items.leads.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('projects')
                setSearchTerm('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Client Projects ({items.projects.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('blog')
                setSearchTerm('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'blog'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Blog Posts ({items.blog.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('applications')
                setSearchTerm('')
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'applications'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Job Applications ({items.applications?.length ?? 0})
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search deleted ${activeTab}...`}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-2xl">
            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
            <p className="text-xs text-gray-400 mt-2 font-medium">Loading deleted items...</p>
          </div>
        ) : isError ? (
          <div className="p-6 text-center bg-white border border-gray-150 rounded-2xl">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Failed to load recycle bin</p>
            <p className="text-xs text-gray-400 mt-1">Please try refetching the data.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-sm hover:shadow"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl">
            <Inbox className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-400">Recycle Bin is empty</p>
            <p className="text-xs text-gray-300 mt-1">
              {searchTerm ? 'No matches found for your search query.' : `No soft-deleted ${activeTab} found.`}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-150 bg-gray-50/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Item Details</th>
                    <th className="px-5 py-3">Meta Info</th>
                    <th className="px-5 py-3">Deleted Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        {activeTab === 'leads' && (
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-gray-400 mt-0.5">{item.email}</p>
                            {item.phone && <p className="text-gray-400">{item.phone}</p>}
                          </div>
                        )}
                        {activeTab === 'projects' && (
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.projectTitle}</p>
                            <p className="text-gray-400 mt-0.5">Client: {item.clientName}</p>
                          </div>
                        )}
                        {activeTab === 'blog' && (
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                            <p className="text-gray-400 mt-0.5">Slug: {item.slug}</p>
                          </div>
                        )}
                        {activeTab === 'applications' && (
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{item.fullName}</p>
                            <p className="text-gray-400 mt-0.5">{item.email}</p>
                            {item.phone && <p className="text-gray-400">{item.phone}</p>}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {activeTab === 'leads' && (
                          <div>
                            <p className="font-semibold text-gray-700">Service interested:</p>
                            <p className="text-gray-500 mt-0.5">{item.serviceInterested || 'General Inquiry'}</p>
                          </div>
                        )}
                        {activeTab === 'projects' && (
                          <div>
                            <p className="font-semibold text-gray-700">Budget / Assigned:</p>
                            <p className="text-gray-500 mt-0.5">
                              {item.budget ? `Budget: ${item.budget}` : 'No Budget'}
                            </p>
                            {item.assignedTo && <p className="text-gray-400 mt-0.5">To: {item.assignedTo}</p>}
                          </div>
                        )}
                        {activeTab === 'blog' && (
                          <div>
                            <p className="font-semibold text-gray-700">Category / Author:</p>
                            <p className="text-gray-500 mt-0.5">{item.category}</p>
                            <p className="text-gray-400 mt-0.5">By {item.authorName}</p>
                          </div>
                        )}
                        {activeTab === 'applications' && (
                          <div>
                            <p className="font-semibold text-gray-700">Applied Job:</p>
                            <p className="text-gray-500 mt-0.5">{item.jobPosting?.title || 'Unknown Role'}</p>
                            {item.resumeUrl && (
                              <a
                                href={item.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-blue hover:underline font-bold mt-1 inline-block"
                              >
                                View Resume
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {item.deletedAt ? (
                            new Date(item.deletedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          ) : (
                            <span>—</span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestore(item.id, activeTab)}
                            disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-blue/8 hover:bg-brand-blue/15 text-brand-blue text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                            title="Restore Item"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Restore
                          </button>
                          <button
                            onClick={() =>
                              handlePermanentDelete(
                                item.id,
                                activeTab,
                                activeTab === 'leads'
                                  ? item.name
                                  : activeTab === 'projects'
                                    ? item.projectTitle
                                    : activeTab === 'blog'
                                      ? item.title
                                      : item.fullName
                              )
                            }
                            disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete Permanent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
