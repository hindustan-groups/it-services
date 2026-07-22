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
  Download,
  Eye,
  FileCheck,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'
import AttachmentSection from '@/components/ui/AttachmentSection'
import AdminBillingSection from '@/components/admin/AdminBillingSection'

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

function ProjectForm({ initial, onSave, onCancel, loading, onAttachmentChange }) {
  const { data: clients = [] } = useQuery({
    queryKey: ['admin-clients-list-for-dropdown'],
    queryFn: () => api.get('/admin/clients').then((r) => r.data),
  })

  const { data: assignableTeam = [] } = useQuery({
    queryKey: ['admin-assignable-team-dropdown'],
    queryFn: () => api.get('/admin/users/list-assignable').then((r) => r.data),
  })

  // Format dates for input type="date"
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  }

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: initial
      ? {
          ...initial,
          startDate: formatDateForInput(initial.startDate),
          deadline: formatDateForInput(initial.deadline),
          tags: initial.tags ? initial.tags.join(', ') : '',
          clientId: initial.clientId || '',
          assignedTo: initial.assignedTo || '',
          assignedToEmail: initial.assignedToEmail || '',
        }
      : {
          clientName: '',
          projectTitle: '',
          description: '',
          startDate: formatDateForInput(new Date()),
          deadline: '',
          assignedTo: '',
          assignedToEmail: '',
          budget: '',
          tags: '',
          notes: '',
          status: 'PLANNING',
          priority: 'MEDIUM',
          progress: 0,
          clientId: '',
        },
  })

  const watchedProgress = watch('progress') || 0

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

  const onFormError = (errors) => {
    const errorFields = Object.keys(errors).join(', ')
    alert(`Please fill in all required fields: ${errorFields}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">
      {/* Section 1: Core Client & Project Identification */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
        <p className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
          <span>📋</span> 1. Core Identification & Client Account
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Project Title *
            </label>
            <input
              {...register('projectTitle', { required: true })}
              className={inputCls}
              placeholder="e.g. E-Commerce Website & Mobile App"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Client Business / Name *
            </label>
            <input
              {...register('clientName', { required: true })}
              className={inputCls}
              placeholder="e.g. Ramesh Textiles Pvt Ltd"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Link Client Portal Account (Optional)
            </label>
            <select
              {...register('clientId')}
              className={inputCls}
              onChange={(e) => {
                const selectedId = e.target.value
                setValue('clientId', selectedId)
                if (selectedId) {
                  const matchedClient = clients.find((c) => c.id === selectedId)
                  if (matchedClient && !watch('clientName')) {
                    setValue('clientName', matchedClient.name)
                  }
                }
              }}
            >
              <option value="">-- No Client Portal Account linked --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Assigned To (Team Lead / Staff)
            </label>
            <select
              className={inputCls}
              value={
                watch('assignedTo') && watch('assignedToEmail')
                  ? `${watch('assignedTo')}||${watch('assignedToEmail')}`
                  : watch('assignedTo') || ''
              }
              onChange={(e) => {
                const selectedVal = e.target.value
                // selectedVal is in format "Name||email"
                const parts = selectedVal.split('||')
                const nameVal = parts[0] || ''
                const emailVal = parts[1] || ''
                setValue('assignedTo', nameVal)
                setValue('assignedToEmail', emailVal)
              }}
            >
              <option value="">-- Unassigned --</option>
              {assignableTeam.map((m) => {
                const displayName = m.name || m.email.split('@')[0].toUpperCase()
                const roleLabel = m.role === 'SUPER_ADMIN' ? 'Super Admin' : m.role === 'ADMIN' ? 'Admin' : 'Staff'
                const optValue = `${displayName}||${m.email}`
                return (
                  <option key={m.id} value={optValue}>
                    👤 {displayName} ({m.email}) — [{roleLabel}]
                  </option>
                )
              })}
            </select>
            <input type="hidden" {...register('assignedToEmail')} />
          </div>
        </div>
      </div>

      {/* Section 2: Budget & Schedule */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
          <span>💵</span> 2. Financial Budget & Project Schedule
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Budget (₹)</label>
            <input {...register('budget')} className={inputCls} placeholder="e.g. ₹75,000" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Start Date *</label>
            <input
              type="date"
              {...register('startDate', { required: true })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Deadline *</label>
            <input type="date" {...register('deadline', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Priority Level</label>
            <select {...register('priority')} className={inputCls}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Status, Completion Progress & Tagging */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
        <p className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-2">
          <span>📈</span> 3. Lifecycle Status & Completion Progress
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Lifecycle Status</label>
            <select {...register('status')} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Tags (Comma Separated)
            </label>
            <input {...register('tags')} className={inputCls} placeholder="Web, React, E-Commerce, SEO" />
          </div>
          <div className="sm:col-span-2 bg-white p-4.5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-800 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span>🎯</span> Completion Progress Tracker
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 25, 50, 75, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setValue('progress', preset)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      Number(watchedProgress) === preset
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-blue to-indigo-600 text-white font-mono font-bold text-[11px] ml-1 shadow-sm">
                  {watchedProgress}%
                </span>
              </div>
            </div>

            {/* Live Visual Gradient Progress Fill Bar */}
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-150 border border-gray-200/80 shadow-inner">
                <div
                  style={{ width: `${watchedProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-brand-blue via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                {...register('progress')}
                className="w-full h-3 opacity-0 cursor-pointer absolute top-1 left-0 z-10"
                title="Slide to change project completion progress"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Brief Description & Confidential Notes */}
      <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
          <span>📝</span> 4. Project Brief & Confidential Internal Notes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Client Visible Project Brief
            </label>
            <textarea
              rows={3}
              {...register('description')}
              className={`${inputCls} resize-none`}
              placeholder="Overview of project deliverables, features, tech stack..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Confidential Internal Admin Notes
            </label>
            <textarea
              rows={3}
              {...register('notes')}
              className={`${inputCls} resize-none bg-amber-50/30 border-amber-200/60 focus:bg-white`}
              placeholder="Internal credentials, payment agreements, team notes..."
            />
          </div>
        </div>
      </div>

      {/* Section 5: Attachment File Vault (If Editing Existing Project) */}
      {initial && (
        <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
            <span>📎</span> 5. Project Vault File Attachments & Assets
          </p>
          <AttachmentSection
            attachments={initial.attachments}
            clientProjectId={initial.id}
            onUploadSuccess={onAttachmentChange}
          />
        </div>
      )}

      {/* Form Submit & Cancel Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-blue/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Save & Publish Project'}</span>
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
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [portalLinkFilter, setPortalLinkFilter] = useState('ALL')
  const qc = useQueryClient()

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    portalLinkFilter !== 'ALL'

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
    setPriorityFilter('ALL')
    setPortalLinkFilter('ALL')
  }

  const handleExportCSV = () => {
    if (!projects.length) return
    const headers = ['Project Title', 'Client Name', 'Status', 'Priority', 'Progress (%)', 'Budget', 'Start Date', 'Deadline', 'Assigned To']
    const rows = projects.map((p) => [
      p.projectTitle,
      p.clientName,
      p.status,
      p.priority,
      `${p.progress}%`,
      p.budget || '',
      new Date(p.startDate).toLocaleDateString(),
      new Date(p.deadline).toLocaleDateString(),
      p.assignedTo || '',
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `projects_summary_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    if (!projects.length) return

    const totalBudget = projects.reduce((acc, p) => {
      const num = parseFloat(String(p.budget || '').replace(/[^0-9.]/g, ''))
      return acc + (isNaN(num) ? 0 : num)
    }, 0)

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Pop-up blocker is enabled. Please allow pop-ups to export PDF.')
      return
    }

    const rowsHtml = projects.map(p => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; font-weight: bold; color: #111827;">${p.projectTitle}</td>
        <td style="padding: 12px; color: #4B5563;">${p.clientName}</td>
        <td style="padding: 12px;"><span style="padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; border: 1px solid #ccc; text-transform: uppercase;">${p.status}</span></td>
        <td style="padding: 12px; font-weight: 500; color: #111827;">${p.budget || '—'}</td>
        <td style="padding: 12px; color: #4B5563;">${p.progress}%</td>
        <td style="padding: 12px; color: #4B5563;">${new Date(p.deadline).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Client Projects Report — Hindustan Projects</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1F2937; margin: 0; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1A3E8C; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 700; color: #1A3E8C; margin: 0; text-transform: uppercase; }
            .meta { font-size: 11px; color: #6B7280; text-align: right; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; background: #F9FAFB; }
            .stat-label { font-size: 10px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; }
            .stat-value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; margin-top: 20px; }
            th { background: #F3F4F6; color: #374151; font-weight: 600; padding: 12px; text-transform: uppercase; font-size: 10px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">Hindustan Projects</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #4B5563; font-weight: 500;">Client Projects Status & Budget Report</p>
            </div>
            <div class="meta">
              <p style="margin: 0; font-weight: bold; color: #111827;">Report Date: ${new Date().toLocaleDateString('en-IN')}</p>
              <p style="margin: 4px 0 0 0;">Generated by Hindustan Admin Portal</p>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Projects</div>
              <div class="stat-value">${projects.length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Active Projects</div>
              <div class="stat-value" style="color: #2563EB;">${projects.filter(p => p.status !== 'COMPLETED').length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Completed</div>
              <div class="stat-value" style="color: #10B981;">${projects.filter(p => p.status === 'COMPLETED').length}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Estimated Budget Value</div>
              <div class="stat-value" style="color: #111827;">₹${totalBudget.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="padding: 12px;">Project Name</th>
                <th style="padding: 12px;">Client</th>
                <th style="padding: 12px;">Status</th>
                <th style="padding: 12px;">Budget</th>
                <th style="padding: 12px;">Progress</th>
                <th style="padding: 12px;">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #9CA3AF; border-top: 1px dashed #E5E7EB; padding-top: 20px;">
            Hindustan Projects website backup and monitoring database report. Confidential.
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const [quickViewProject, setQuickViewProject] = useState(null)

  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-client-projects'],
    queryFn: () => api.get('/admin/client-projects').then((r) => r.data),
  })

  const { data: adminProfile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => api.get('/admin/me').then((res) => res.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/client-projects', data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setShowForm(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      alert('✅ Project created! Client & assigned staff have been notified via email.')
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message || 'Failed to create client project.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/client-projects/${id}`, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin-client-projects'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setEditing(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      alert('✅ Project updated successfully! Notifications sent to client & assigned staff.')
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message || 'Failed to update client project.')
    },
  })

  const handleAttachmentChange = async () => {
    const updated = await refetch()
    // refetch returns { data: [...projects] } since queryFn returns r.data (the array)
    const list = Array.isArray(updated.data) ? updated.data : []
    const found = list.find((p) => p.id === editing?.id)
    if (found) {
      setEditing(found)
    }
  }

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
    const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter
    const matchesPortalLink =
      portalLinkFilter === 'ALL' ||
      (portalLinkFilter === 'LINKED' && p.client) ||
      (portalLinkFilter === 'UNLINKED' && !p.client)

    return matchesSearch && matchesStatus && matchesPriority && matchesPortalLink
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
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {projects.length > 0 && (
              <div className="relative group">
                <button
                  className="inline-flex items-center gap-2 bg-gray-150 border border-gray-250 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-200 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Report
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-10 py-1">
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                  >
                    Export to CSV (Spreadsheet)
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
                  >
                    Print / Save as PDF Report
                  </button>
                </div>
              </div>
            )}
            {!showForm && !editing && (
              <button
                onClick={() => {
                  setShowForm(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-brand-blue/10 hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            )}
          </div>
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
              <div className="space-y-6">
                <ProjectForm
                  initial={editing}
                  onSave={(data) => updateMutation.mutate({ id: editing.id, ...data })}
                  onCancel={() => setEditing(null)}
                  loading={updateMutation.isPending}
                  onAttachmentChange={handleAttachmentChange}
                />
                
                <hr className="border-gray-150" />
                
                <AdminBillingSection
                  projectId={editing.id}
                  currentRole={adminProfile?.role}
                />
              </div>
            )}
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
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

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 font-medium"
            >
              <option value="ALL">Priority: All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Portal Link Select */}
            <select
              value={portalLinkFilter}
              onChange={(e) => setPortalLinkFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 font-medium"
            >
              <option value="ALL">Portal Link: All</option>
              <option value="LINKED">Linked Only</option>
              <option value="UNLINKED">Unlinked Only</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-bold text-brand-blue hover:text-blue-700 bg-blue-50 border border-blue-100 rounded-xl transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}

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
                      <select
                        value={p.status}
                        onChange={(e) => updateMutation.mutate({ id: p.id, status: e.target.value })}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border cursor-pointer focus:outline-none ${STATUS_COLORS[p.status]}`}
                        title="Click to quick update project status"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
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
                    <p className="text-xs text-gray-400 font-semibold mb-3 flex items-center gap-1 flex-wrap">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                      {p.clientName}
                      {p.client ? (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-bold ml-1" title={`Linked to client portal account: ${p.client.email}`}>
                          Portal Linked
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold ml-1" title="Client account not linked. Edit project to link a Client so they can view it in their Portal.">
                          ⚠️ Portal Unlinked
                        </span>
                      )}
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

                  {/* Deadline countdown tag & File Count & Edit/Delete actions */}
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${deadlineStatus.color}`}
                      >
                        {deadlineStatus.text}
                      </span>
                      {p.attachments && p.attachments.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-brand-blue border border-blue-100 flex items-center gap-1" title="Files in Project Vault">
                          📎 {p.attachments.length} Files
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {p.client && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Resend portal login credentials to ${p.client.email}?`)) {
                              try {
                                await api.post(`/admin/clients/${p.client.id}/resend-welcome`)
                                alert(`Welcome email sent to ${p.client.email}!`)
                              } catch (err) {
                                alert(err.response?.data?.message || 'Failed to send credentials.')
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-emerald-600 p-1.5 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Resend Portal Welcome Credentials Email"
                        >
                          ✉️
                        </button>
                      )}
                      <button
                        onClick={() => setQuickViewProject(p)}
                        className="text-gray-400 hover:text-brand-blue p-1.5 hover:bg-gray-50 rounded-lg transition-all"
                        title="360° Quick View Project Intelligence"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

      {/* 360° Project Intelligence Quick View Drawer Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-2xl">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-heading text-gray-900">
                      {quickViewProject.projectTitle}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_COLORS[quickViewProject.status]}`}>
                      {STATUS_LABELS[quickViewProject.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    Client: <strong>{quickViewProject.clientName}</strong>
                    {quickViewProject.client && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.2 rounded font-bold">
                        Portal Account Linked
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickViewProject(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Budget</p>
                <p className="text-xl font-black text-gray-900 mt-1">{quickViewProject.budget || '₹ Custom'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Current Progress</p>
                <p className="text-xl font-black text-brand-blue mt-1">{quickViewProject.progress}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Assigned Lead</p>
                <p className="text-base font-bold text-gray-800 mt-1 truncate">{quickViewProject.assignedTo || 'Unassigned'}</p>
              </div>
            </div>

            {quickViewProject.description && (
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-1">
                <p className="text-xs font-bold text-gray-700">Project Overview:</p>
                <p className="text-xs text-gray-600 leading-relaxed">{quickViewProject.description}</p>
              </div>
            )}

            {/* File Vault Assets */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand-blue" />
                Project Vault Files ({quickViewProject.attachments?.length || 0})
              </h4>
              {(!quickViewProject.attachments || quickViewProject.attachments.length === 0) ? (
                <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                  No files uploaded in project vault yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickViewProject.attachments.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">{item.fileName}</p>
                        <p className="text-[10px] text-gray-400">{item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'Secure File'}</p>
                      </div>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg ml-2">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditing(quickViewProject)
                  setQuickViewProject(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Full Project & Milestones
              </button>
              <button
                onClick={() => setQuickViewProject(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
