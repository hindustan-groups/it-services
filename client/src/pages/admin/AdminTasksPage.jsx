/**
 * AdminTasksPage — Kanban Board for Task Management
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
  User,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Kanban,
  List,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'
import AttachmentSection from '@/components/ui/AttachmentSection'

const COLUMNS = [
  {
    id: 'TODO',
    label: 'To Do',
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    bg: 'bg-blue-50/30 border-blue-150',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  {
    id: 'BLOCKED',
    label: 'Blocked',
    bg: 'bg-amber-50/30 border-amber-150',
    text: 'text-amber-700',
    dot: 'bg-amber-500 animate-pulse',
  },
  {
    id: 'DONE',
    label: 'Completed',
    bg: 'bg-emerald-50/20 border-emerald-150',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
]

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

const PRIORITY_COLORS = {
  LOW: 'bg-green-50 text-green-700 border-green-200',
  MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200 font-bold',
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

function TaskForm({ initial, projects, teamMembers = [], onSave, onCancel, loading, onAttachmentChange }) {
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
          dueDate: formatDateForInput(initial.dueDate),
          tags: initial.tags ? initial.tags.join(', ') : '',
        }
      : {
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '',
          assignedTo: '',
          clientProjectId: '',
          tags: '',
        },
  })

  const onSubmit = (data) => {
    onSave({
      ...data,
      clientProjectId: data.clientProjectId || null,
      tags: data.tags
        ? data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Task Title *</label>
          <input
            {...register('title', { required: true })}
            className={inputCls}
            placeholder="e.g. Integrate Payment Gateway"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Client Project</label>
          <select {...register('clientProjectId')} className={inputCls}>
            <option value="">None (General Task)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectTitle} ({p.clientName})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Due Date</label>
          <input type="date" {...register('dueDate')} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Assigned To</label>
          <select {...register('assignedTo')} className={inputCls}>
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.email}>
                {m.email} ({m.role})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
          <select {...register('status')} className={inputCls}>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DONE">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Priority</label>
          <select {...register('priority')} className={inputCls}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Est. Hours</label>
          <input
            type="number"
            step="0.5"
            min="0"
            {...register('estimatedHours')}
            className={inputCls}
            placeholder="e.g. 8"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Logged Hours</label>
          <input
            type="number"
            step="0.5"
            min="0"
            {...register('loggedHours')}
            className={inputCls}
            placeholder="e.g. 3.5"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-gray-600 block mb-1">
            Tags (comma separated)
          </label>
          <input {...register('tags')} className={inputCls} placeholder="API, Design, Bug" />
        </div>
      </div>

      <div className="border-t border-gray-150 pt-3">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
        <textarea
          rows={3}
          {...register('description')}
          className={`${inputCls} resize-none`}
          placeholder="Describe the task instructions..."
        />
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-150">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-md transition-all"
        >
          <Check className="w-4 h-4" /> Save Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
      {initial && (
        <div className="border-t border-gray-150 pt-4 mt-4">
          <AttachmentSection
            attachments={initial.attachments || []}
            taskId={initial.id}
            onUploadSuccess={onAttachmentChange}
          />
        </div>
      )}
    </form>
  )
}

export default function AdminTasksPage() {
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list'
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [projectFilter, setProjectFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [assignmentFilter, setAssignmentFilter] = useState('ALL')

  // Quick Add State
  const [quickTitle, setQuickTitle] = useState('')
  const [quickProject, setQuickProject] = useState('')
  const [quickDate, setQuickDate] = useState('')

  const qc = useQueryClient()

  const { data: tasks = [], isLoading: loadingTasks, refetch } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: () => api.get('/admin/tasks').then((r) => r.data),
  })

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['admin-client-projects'],
    queryFn: () => api.get('/admin/client-projects').then((r) => r.data),
  })

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  })

  const { data: adminProfile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => api.get('/admin/me').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/tasks', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tasks'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setQuickTitle('')
      setQuickDate('')
      setShowForm(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/tasks/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tasks'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tasks'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })

  const handleAttachmentChange = async () => {
    const updated = await refetch()
    const found = updated.data?.find((t) => t.id === editing?.id)
    if (found) {
      setEditing(found)
    }
  }

  const handleQuickAddSubmit = (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) return
    createMutation.mutate({
      title: quickTitle,
      clientProjectId: quickProject || null,
      dueDate: quickDate || null,
      status: 'TODO',
      priority: 'MEDIUM',
    })
  }

  const handleMoveTask = (id, newStatus) => {
    updateMutation.mutate({ id, status: newStatus })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id)
    }
  }

  // Drag and Drop helpers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetStatus) => {
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      handleMoveTask(taskId, targetStatus)
    }
  }

  const getProjectName = (projId) => {
    const p = projects.find((p) => p.id === projId)
    return p ? p.projectTitle : null
  }

  const getClientName = (projId) => {
    const p = projects.find((p) => p.id === projId)
    return p ? p.clientName : null
  }

  const isOverdue = (dueDateStr, status) => {
    if (status === 'DONE' || !dueDateStr) return false
    return new Date(dueDateStr) < new Date().setHours(0, 0, 0, 0)
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProject = projectFilter === 'ALL' || t.clientProjectId === projectFilter
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter

    let matchesAssignment = true
    if (assignmentFilter === 'ME') {
      matchesAssignment = adminProfile && t.assignedTo?.toLowerCase() === adminProfile.email?.toLowerCase()
    } else if (assignmentFilter === 'UNASSIGNED') {
      matchesAssignment = !t.assignedTo
    }

    return matchesSearch && matchesProject && matchesPriority && matchesAssignment
  })

  return (
    <>
      <SEO title="Task Board" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Internal Tasks Board</h1>
            <p className="text-sm text-gray-500">
              Coordinate task status, drag cards to update progress, and filter by project.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex bg-gray-150 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                title="Kanban Board"
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {!showForm && !editing && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue/10 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Bar */}
        {!showForm && !editing && (
          <form
            onSubmit={handleQuickAddSubmit}
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-end md:items-center"
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Quick add task title..."
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
              />
            </div>
            <div className="w-full md:w-56">
              <select
                value={quickProject}
                onChange={(e) => setQuickProject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
              >
                <option value="">General / No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectTitle}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-44">
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !quickTitle.trim()}
              className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all shrink-0 w-full md:w-auto h-[38px] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Quick Add
            </button>
          </form>
        )}

        {/* Edit / Add Modal */}
        {(showForm || editing) && (
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold font-heading text-gray-800">
                {showForm ? 'Create New Task' : `Edit Task: ${editing?.title}`}
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
              <TaskForm
                projects={projects}
                teamMembers={teamMembers}
                onSave={(data) => createMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                loading={createMutation.isPending}
              />
            ) : (
              <TaskForm
                initial={editing}
                projects={projects}
                teamMembers={teamMembers}
                onSave={(data) => updateMutation.mutate({ id: editing.id, ...data })}
                onCancel={() => setEditing(null)}
                loading={updateMutation.isPending}
                onAttachmentChange={handleAttachmentChange}
              />
            )}
          </div>
        )}

        {/* Global Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>
          <div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">Filter by Project: All</option>
              <option value="">General Tasks Only</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectTitle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">Filter by Priority: All</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">Filter by Assignee: All</option>
              <option value="ME">Assigned to Me</option>
              <option value="UNASSIGNED">Unassigned Tasks</option>
            </select>
          </div>
        </div>

        {/* Tasks Content Display */}
        {loadingTasks || loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-gray-55 border border-gray-150 h-96 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {COLUMNS.map((col) => {
              const columnTasks = filteredTasks.filter((t) => t.status === col.id)
              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`rounded-2xl border p-4 min-h-[500px] flex flex-col gap-3 ${col.bg}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span
                        className={`font-bold font-heading text-sm uppercase tracking-wider ${col.text}`}
                      >
                        {col.label}
                      </span>
                    </div>
                    <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
                    {columnTasks.map((t) => (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing group relative ${
                          isOverdue(t.dueDate, t.status) ? 'border-red-300 bg-red-50/10' : ''
                        }`}
                      >
                        {/* Task Priority & Project */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[t.priority]}`}
                          >
                            {t.priority}
                          </span>
                          {isOverdue(t.dueDate, t.status) && (
                            <span className="flex items-center gap-0.5 text-[9px] text-red-600 font-bold bg-red-100/50 border border-red-200 px-1.5 py-0.5 rounded">
                              <AlertCircle className="w-2.5 h-2.5" /> OVERDUE
                            </span>
                          )}
                        </div>

                        {/* Task Title */}
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-blue transition-colors leading-snug mb-1">
                          {t.title}
                        </h4>

                        {/* Project Link indicator */}
                        {t.clientProjectId && (
                          <p className="text-[10px] text-brand-blue font-bold truncate mb-2">
                            📁 {getProjectName(t.clientProjectId)}
                          </p>
                        )}

                        {/* Task Description */}
                        {t.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100 mb-3">
                            {t.description}
                          </p>
                        )}

                        {/* Metadata: Due Date & Assignee & Creator */}
                        <div className="space-y-1.5 border-t border-gray-100 pt-2.5 text-[11px]">
                          <div className="flex items-center justify-between text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span
                                className={
                                  isOverdue(t.dueDate, t.status) ? 'text-red-500 font-bold' : ''
                                }
                              >
                                {t.dueDate
                                  ? new Date(t.dueDate).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                    })
                                  : 'No deadline'}
                              </span>
                            </div>
                            {(t.estimatedHours || t.loggedHours > 0) && (
                              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                ⏱️ {t.loggedHours || 0} / {t.estimatedHours || '—'} hrs
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-1 text-[10px]">
                            <span className="text-gray-700 font-semibold truncate max-w-[120px]" title={`Assigned To: ${t.assigneeName}`}>
                              👤 {t.assigneeName || t.assignedTo || 'Unassigned'}
                            </span>
                            {t.creatorName && (
                              <span className="text-gray-400 font-medium truncate max-w-[110px]" title={`Assigned By: ${t.creatorName}`}>
                                ✍️ By {t.creatorName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {t.tags && t.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {t.tags.map((tg) => (
                              <span
                                key={tg}
                                className="text-[8px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded border border-gray-150"
                              >
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Hover Quick Actions */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white/95 rounded-lg border border-gray-150 p-0.5 shadow-sm">
                          <button
                            onClick={() => {
                              setEditing(t)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="p-1 hover:text-brand-blue text-gray-400 hover:bg-gray-50 rounded"
                            title="Edit Task"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {adminProfile?.role !== 'STAFF' && (
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="p-1 hover:text-red-500 text-gray-400 hover:bg-gray-50 rounded"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Quick Move controls for mobile / accessibility */}
                        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100 md:hidden">
                          <span className="text-[10px] text-gray-400">Quick Move:</span>
                          <div className="flex gap-1">
                            {col.id !== 'TODO' && (
                              <button
                                onClick={() => {
                                  const idx = COLUMNS.findIndex((c) => c.id === col.id)
                                  handleMoveTask(t.id, COLUMNS[idx - 1].id)
                                }}
                                className="p-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-500"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id !== 'DONE' && (
                              <button
                                onClick={() => {
                                  const idx = COLUMNS.findIndex((c) => c.id === col.id)
                                  handleMoveTask(t.id, COLUMNS[idx + 1].id)
                                }}
                                className="p-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-gray-500"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                        Drag tasks here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-150">
                    <th className="px-5 py-3.5">Task Title</th>
                    <th className="px-5 py-3.5">Client Project</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Due Date</th>
                    <th className="px-5 py-3.5">Assigned To</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-sm text-gray-700">
                  {filteredTasks.map((t) => (
                    <tr
                      key={t.id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        isOverdue(t.dueDate, t.status) ? 'bg-red-50/5' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${COLUMNS.find((c) => c.id === t.status)?.dot}`}
                          />
                          <div>
                            <p className="font-bold text-gray-900 leading-snug">{t.title}</p>
                            {t.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {t.clientProjectId ? (
                          <div>
                            <p className="font-semibold text-gray-800">
                              {getProjectName(t.clientProjectId)}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {getClientName(t.clientProjectId)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">General task</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleMoveTask(t.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none font-semibold text-gray-700"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="BLOCKED">Blocked</option>
                          <option value="DONE">Completed</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${PRIORITY_COLORS[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {t.dueDate ? (
                          <span
                            className={`flex items-center gap-1.5 text-xs font-semibold ${isOverdue(t.dueDate, t.status) ? 'text-red-600' : 'text-gray-700'}`}
                          >
                            {isOverdue(t.dueDate, t.status) && (
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            )}
                            {new Date(t.dueDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {t.assignedTo || <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditing(t)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="p-1.5 hover:text-brand-blue text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {adminProfile?.role !== 'STAFF' && (
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="p-1.5 hover:text-red-500 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-gray-400 italic">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
