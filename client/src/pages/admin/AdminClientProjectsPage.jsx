/**
 * AdminClientProjectsPage — Management page for Client Projects
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Calendar,
  DollarSign,
  User,
  Tag,
  Clock,
  FolderOpen,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const STATUSES = ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ON_HOLD']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const STATUS_LABELS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
}

const STATUS_COLORS = {
  PLANNING: 'bg-sky-50 text-sky-700 border-sky-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ON_HOLD: 'bg-rose-50 text-rose-700 border-rose-200',
}

const PRIORITY_COLORS = {
  LOW: 'bg-green-50 text-green-700 border-green-200',
  MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
}

const inputCls =
  'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

function ProjectForm({ initial, onSave, onCancel, loading }) {
  // Format dates for input type="date"
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  }

  const { register, handleSubmit } = useForm({
    defaultValues: initial
      ? {
          ...initial,
          startDate: formatDateForInput(initial.startDate),
          deadline: formatDateForInput(initial.deadline),
          tags: initial.tags ? initial.tags.join(', ') : '',
        }
      : {
          clientName: '',
          projectTitle: '',
          description: '',
          startDate: formatDateForInput(new Date()),
          deadline: '',
          assignedTo: '',
          budget: '',
          tags: '',
          notes: '',
          status: 'PLANNING',
          priority: 'MEDIUM',
          progress: 0,
        },
  })

  const onSubmit = (data) => {
    onSave({
      ...data,
      progress: parseInt(data.progress || 0),
      tags: data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Project details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Project Title *
            </label>
            <input
              {...register('projectTitle', { required: true })}
              className={inputCls}
              placeholder="e.g. E-Commerce Development"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Client Name *
            </label>
            <input
              {...register('clientName', { required: true })}
              className={inputCls}
              placeholder="e.g. Ramesh Textiles, Bhilwara"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Assigned To (Team Member)
            </label>
            <input
              {...register('assignedTo')}
              className={inputCls}
              placeholder="e.g. Mohmmad Dilshan"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Budget</label>
            <input {...register('budget')} className={inputCls} placeholder="e.g. ₹50,000" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Start Date *</label>
            <input
              type="date"
              {...register('startDate', { required: true })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Deadline *</label>
            <input type="date" {...register('deadline', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Status</label>
            <select {...register('status')} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">Priority</label>
            <select {...register('priority')} className={inputCls}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Progress ({`0-100`})%
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                {...register('progress')}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1.5">
              Tags (comma separated)
            </label>
            <input {...register('tags')} className={inputCls} placeholder="Web, React, SEO" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
          Project Description
        </label>
        <textarea
          rows={2.5}
          {...register('description')}
          className={`${inputCls} resize-none`}
          placeholder="Short description about project..."
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <label className="text-xs font-semibold text-gray-600 block mb-1.5">Internal Notes</label>
        <textarea
          rows={2.5}
          {...register('notes')}
          className={`${inputCls} resize-none`}
          placeholder="Internal details, payment steps, links..."
        />
      </div>

      <div className="flex gap-2.5 pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all disabled:opacity-60"
        >
          <Check className="w-4 h-4" /> Save Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminClientProjectsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const qc = useQueryClient()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-client-projects'],
    queryFn: () => api.get('/admin/client-projects').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/client-projects', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/client-projects/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/client-projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const getDeadlineText = (deadlineStr, status) => {
    if (status === 'COMPLETED') {
      return { text: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    }
    const deadline = new Date(deadlineStr)
    const now = new Date()
    const diffTime = deadline - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return {
        text: `OVERDUE (${Math.abs(diffDays)}d)`,
        color: 'text-red-600 bg-red-50 border-red-200 font-bold',
      }
    }
    if (diffDays === 0) {
      return {
        text: 'Due Today',
        color: 'text-amber-600 bg-amber-50 border-amber-200 font-semibold',
      }
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', color: 'text-amber-600 bg-amber-50 border-amber-200' }
    }
    return { text: `${diffDays} days left`, color: 'text-gray-500 bg-gray-50 border-gray-200' }
  }

  const handleDelete = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this client project? This will also cascade delete all linked tasks!'
      )
    ) {
      deleteMutation.mutate(id)
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Quick statistics
  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status !== 'COMPLETED').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
    overdue: projects.filter((p) => {
      if (p.status === 'COMPLETED') return false
      return new Date(p.deadline) < new Date()
    }).length,
  }

  return (
    <>
      <SEO title="Client Projects Tracker" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Client Projects Tracker
            </h1>
            <p className="text-sm text-gray-500">
              Track and manage client projects, milestones, budgets and deadlines.
            </p>
          </div>
          {!showForm && !editing && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue/10 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Total Projects
            </p>
            <p className="text-2xl font-bold font-heading text-gray-900 mt-1">
              {isLoading ? '…' : stats.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active</p>
            <p className="text-2xl font-bold font-heading text-blue-600 mt-1">
              {isLoading ? '…' : stats.active}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold font-heading text-emerald-600 mt-1">
              {isLoading ? '…' : stats.completed}
            </p>
          </div>
          <div
            className={`bg-white p-4 rounded-2xl border border-gray-150 shadow-sm ${stats.overdue > 0 ? 'border-red-200 bg-red-50/20' : ''}`}
          >
            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Overdue</p>
            <p
              className={`text-2xl font-bold font-heading mt-1 ${stats.overdue > 0 ? 'text-red-600' : 'text-gray-900'}`}
            >
              {isLoading ? '…' : stats.overdue}
            </p>
          </div>
        </div>

        {/* Form Slide-over/Panel */}
        {(showForm || editing) && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold font-heading text-gray-800">
                {showForm ? 'Add New Client Project' : `Edit: ${editing?.projectTitle}`}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditing(null)
                }}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {showForm ? (
              <ProjectForm
                onSave={(data) => createMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                loading={createMutation.isPending}
              />
            ) : (
              <ProjectForm
                initial={editing}
                onSave={(data) => updateMutation.mutate({ id: editing.id, ...data })}
                onCancel={() => setEditing(null)}
                loading={updateMutation.isPending}
              />
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, client, assigned or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex overflow-x-auto gap-1 bg-gray-100 p-1 rounded-xl border border-gray-150 shrink-0">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-gray-150 h-52 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-14 bg-white border border-gray-150 rounded-2xl">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm font-medium">
              No projects found matching the criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => {
              const deadlineStatus = getDeadlineText(p.deadline, p.status)
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-gray-100/80 hover:-translate-y-0.5 transition-all duration-200 relative group"
                >
                  <div>
                    {/* Status & Priority tags */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_COLORS[p.status]}`}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PRIORITY_COLORS[p.priority]}`}
                      >
                        {p.priority}
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className="font-bold font-heading text-gray-900 group-hover:text-brand-blue transition-colors text-base line-clamp-1">
                      {p.projectTitle}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mb-3 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                      {p.clientName}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-[11px] text-gray-500 font-semibold mb-1">
                        <span>Progress</span>
                        <span className="text-gray-800">{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-blue transition-all duration-300"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Timeline & Budget Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 py-3 mb-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-300 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase leading-none mb-0.5">
                            Start Date
                          </p>
                          <p className="font-semibold text-gray-700 leading-none">
                            {new Date(p.startDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-4 h-4 text-gray-300 shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase leading-none mb-0.5">
                            Deadline
                          </p>
                          <p className="font-semibold text-gray-700 leading-none">
                            {new Date(p.deadline).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Team & Budget footer details */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium truncate max-w-[120px]">
                          {p.assignedTo || 'Unassigned'}
                        </span>
                      </div>
                      {p.budget && (
                        <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                          <DollarSign className="w-3.5 h-3.5 text-gray-400 -mr-1" />
                          <span>{p.budget}</span>
                        </div>
                      )}
                    </div>

                    {/* Description (collapsible/truncatable) */}
                    {p.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 mb-3.5">
                        {p.description}
                      </p>
                    )}

                    {/* Internal Notes */}
                    {p.notes && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/50 mb-3.5 font-medium">
                        <span className="font-bold block mb-0.5 text-amber-900">Notes:</span>
                        <span className="line-clamp-2">{p.notes}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-gray-200"
                          >
                            <Tag className="w-2.5 h-2.5 text-gray-400" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Deadline countdown tag & Edit/Delete actions */}
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${deadlineStatus.color}`}
                    >
                      {deadlineStatus.text}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditing(p)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="text-gray-400 hover:text-brand-blue p-1.5 hover:bg-gray-50 rounded-lg transition-all"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-50 rounded-lg transition-all"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
