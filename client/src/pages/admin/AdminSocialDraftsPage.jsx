import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'
import {
  Share2,
  Copy,
  Check,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Search,
  FolderKanban,
} from 'lucide-react'

export default function AdminSocialDraftsPage() {
  const queryClient = useQueryClient()
  const [copiedId, setCopiedId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form states for manual draft creation
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [draftText, setDraftText] = useState('')

  // Fetch social drafts
  const { data: draftsRes, isLoading } = useQuery({
    queryKey: ['social-drafts'],
    queryFn: () => api.get('/admin/social/drafts').then((r) => r.data.data),
  })

  // Fetch portfolio projects for selection
  const { data: projectsRes } = useQuery({
    queryKey: ['admin-portfolio-projects'],
    queryFn: () => api.get('/projects').then((r) => r.data.data),
  })

  const drafts = draftsRes || []
  const projects = projectsRes || []

  // Mutation to toggle status between DRAFT and POSTED
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/social/drafts/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
    },
  })

  // Mutation to delete a draft
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/social/drafts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
    },
  })

  // Mutation to create a new social draft
  const createMutation = useMutation({
    mutationFn: (newDraft) => api.post('/admin/social/drafts', newDraft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-drafts'] })
      setIsAddModalOpen(false)
      setSelectedProjectId('')
      setDraftText('')
    },
  })

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!selectedProjectId || !draftText.trim()) return
    createMutation.mutate({
      projectId: selectedProjectId,
      text: draftText.trim(),
      status: 'DRAFT',
    })
  }

  // Filter drafts based on search term and status tab
  const filteredDrafts = drafts.filter((draft) => {
    const matchesStatus = statusFilter === 'ALL' || draft.status === statusFilter
    const projectTitle = draft.project?.title?.toLowerCase() || ''
    const projectCategory = draft.project?.category?.toLowerCase() || ''
    const textContent = draft.text?.toLowerCase() || ''
    const matchesSearch =
      projectTitle.includes(searchTerm.toLowerCase()) ||
      projectCategory.includes(searchTerm.toLowerCase()) ||
      textContent.includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <>
      <SEO title="Social Post Drafts" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
              <Share2 className="w-6 h-6 text-brand-blue" />
              Social Post Drafts
            </h1>
            <p className="text-sm text-gray-500">
              Manage pre-formatted social media captions and templates for featured projects.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue/10 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Draft
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="bg-white rounded-2xl border border-gray-155 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 self-start">
            {['ALL', 'DRAFT', 'POSTED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-brand-blue shadow-sm border border-gray-150'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search drafts, categories or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-250 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            />
          </div>
        </div>

        {/* Drafts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-gray-150 rounded w-1/3" />
                <div className="h-24 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-155 p-12 text-center shadow-sm">
            <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-650">No social post drafts found</p>
            <p className="text-xs text-gray-455 mt-1">Try updating your filters or create a new manual draft caption.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between shadow-sm bg-white hover:border-gray-300 ${
                  draft.status === 'POSTED' ? 'opacity-80' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1">
                      <FolderKanban className="w-3.5 h-3.5" />
                      {draft.project?.title || 'Unknown Project'}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        draft.status === 'POSTED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {draft.status}
                    </span>
                  </div>
                  <pre className="text-xs text-gray-650 bg-gray-50/75 p-4 rounded-xl font-mono whitespace-pre-wrap max-h-[160px] overflow-y-auto mb-4 border border-gray-150 leading-relaxed">
                    {draft.text}
                  </pre>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() =>
                        statusMutation.mutate({
                          id: draft.id,
                          status: draft.status === 'POSTED' ? 'DRAFT' : 'POSTED',
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-brand-blue transition-colors cursor-pointer"
                    >
                      {draft.status === 'POSTED' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Mark Draft</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Mark Posted</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this social post draft?')) {
                          deleteMutation.mutate(draft.id)
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(draft.id, draft.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {copiedId === draft.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Draft Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <h3 className="text-base font-bold text-gray-900 font-heading flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-brand-blue" />
                  Create Social Post Draft
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Project Selection */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Select Portfolio Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">-- Choose a Project --</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.title} ({proj.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Caption Text */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Social Post Caption / Text
                  </label>
                  <textarea
                    rows={6}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="🔥 Excited to announce our latest completion: [Project Title]! Check out the clean frontend design we delivered... #webdevelopment #hindustanprojects"
                    required
                    className="w-full text-xs text-gray-700 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-150">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-255 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || !selectedProjectId || !draftText.trim()}
                    className="px-4 py-2 bg-brand-blue hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Save Draft'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
