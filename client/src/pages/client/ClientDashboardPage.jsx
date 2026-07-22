/**
 * ClientDashboardPage.jsx — Client Portal Dashboard Overview
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Star,
  TicketCheck,
  Bell,
  Wallet,
  CalendarClock,
} from 'lucide-react'
import { useClientProjects, useClientSubmitFeedback, useClientDashboardStats } from '@/hooks/useClientPortal'
import { useSiteSettings } from '@/hooks/useContent'

const STATUS_COLORS = {
  PLANNING: 'bg-gray-100 text-gray-700 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-100',
  REVIEW: 'bg-purple-50 text-purple-700 border-purple-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ON_HOLD: 'bg-amber-50 text-amber-700 border-amber-100',
}

const STATUS_LABELS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
}

function StatCardSkeleton() {
  return (
    <div className="bg-white/80 border border-gray-150 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-6 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function ClientDashboardPage() {
  const { data: projects = [], isLoading: projectsLoading } = useClientProjects()
  const { data: statsData, isLoading: statsLoading } = useClientDashboardStats()
  const { data: settingsData } = useSiteSettings()

  const [selectedProjectFeedback, setSelectedProjectFeedback] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [clientRole, setClientRole] = useState('')
  const [clientCompany, setClientCompany] = useState('')

  const submitFeedbackMutation = useClientSubmitFeedback()

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!feedbackText.trim()) return

    try {
      await submitFeedbackMutation.mutateAsync({
        projectId: selectedProjectFeedback.id,
        rating: feedbackRating,
        text: feedbackText,
        role: clientRole,
        companyName: clientCompany,
      })
      setSelectedProjectFeedback(null)
      setFeedbackText('')
      setFeedbackRating(5)
      setClientRole('')
      setClientCompany('')
    } catch (_err) {
      // Handled by feedbackMutation error state
    }
  }

  if (projectsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const s = statsData?.data || {}

  // Format currency
  const formatCurrency = (amount) =>
    amount != null
      ? `₹${amount.toLocaleString('en-IN')}`
      : '—'

  // Format date
  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'

  const stats = [
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: statsLoading ? '…' : s.activeProjects ?? 0,
      icon: FolderKanban,
      color: 'bg-blue-50 text-blue-600',
      accent: 'border-blue-100',
      link: null,
      subtext: null,
    },
    {
      id: 'completed-projects',
      label: 'Completed Projects',
      value: statsLoading ? '…' : s.completedProjects ?? 0,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
      accent: 'border-emerald-100',
      link: null,
      subtext: null,
    },
    {
      id: 'overall-progress',
      label: 'Overall Progress',
      value: statsLoading ? '…' : `${s.overallProgress ?? 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      accent: 'border-purple-100',
      link: null,
      subtext: 'Across all projects',
    },
    {
      id: 'open-tickets',
      label: 'Open Support Tickets',
      value: statsLoading ? '…' : s.openTickets ?? 0,
      icon: TicketCheck,
      color: s.openTickets > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400',
      accent: s.openTickets > 0 ? 'border-amber-100' : 'border-gray-100',
      link: '/client/support',
      subtext: s.unreadReplies > 0 ? `${s.unreadReplies} unread ${s.unreadReplies === 1 ? 'reply' : 'replies'}` : null,
      subIcon: Bell,
      subIconColor: 'text-rose-500',
    },
    {
      id: 'next-payment',
      label: 'Next Payment Due',
      value: statsLoading ? '…' : formatCurrency(s.pendingMilestoneAmount),
      icon: Wallet,
      color: s.pendingMilestoneAmount != null ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400',
      accent: s.pendingMilestoneAmount != null ? 'border-rose-100' : 'border-gray-100',
      link: '/client/billing',
      subtext: s.nextMilestoneTitle ? `Milestone: ${s.nextMilestoneTitle}` : null,
    },
    {
      id: 'payment-due-date',
      label: 'Payment Deadline',
      value: statsLoading ? '…' : formatDate(s.nextMilestoneDue),
      icon: CalendarClock,
      color: s.nextMilestoneDue != null ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400',
      accent: s.nextMilestoneDue != null ? 'border-indigo-100' : 'border-gray-100',
      link: '/client/billing',
      subtext: null,
    },
  ]

  const cfg = settingsData?.data || {}
  const rawPhone = cfg.phone || '+91 99291 20431'
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20Hindustan%20Projects%20Team`

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Dashboard</h2>
        <p className="text-sm text-gray-500">Track and manage your ongoing project deliverables.</p>
      </div>

      {/* Stats Cards — 6 premium cards in 2-row 3-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {statsLoading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => {
              const CardWrapper = stat.link ? Link : 'div'
              const wrapperProps = stat.link ? { to: stat.link } : {}

              return (
                <CardWrapper
                  key={stat.id}
                  {...wrapperProps}
                  className={`bg-white/80 border backdrop-blur-md rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4 group ${stat.accent || 'border-gray-150'} ${stat.link ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-0.5 truncate">{stat.value}</h3>
                    {stat.subtext && (
                      <p className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${stat.subIconColor || 'text-gray-400'}`}>
                        {stat.subIcon && <stat.subIcon className="w-3 h-3" />}
                        {stat.subtext}
                      </p>
                    )}
                  </div>
                  {stat.link && (
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  )}
                </CardWrapper>
              )
            })}
      </div>

      {/* Dynamic WhatsApp Support Banner */}
      <div className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-2xl p-5 md:p-6 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 relative">
          <h4 className="font-heading font-bold text-base md:text-lg">Need Immediate Assistance?</h4>
          <p className="text-xs text-blue-100 max-w-xl">
            Get in touch directly with our support team or your dedicated project lead on WhatsApp for quick updates, feedback, or any technical queries.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-white text-brand-blue hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all relative cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-50" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 font-heading">Your Projects</h3>
        
        {projects.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-12 text-center">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No projects linked to your account yet.</p>
            <p className="text-xs text-gray-400 mt-1">Please contact your account manager if this is an error.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
              const formattedDeadline = new Date(project.deadline).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              return (
                <div key={project.id} className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-gray-250 transition-all duration-200 flex flex-col justify-between group">
                  <div>
                    {/* Title and Status */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-gray-900">{project.projectTitle}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">Project ID: {project.id}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[project.status]}`}>
                        {STATUS_LABELS[project.status]}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>

                    {/* Progress Slider */}
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Milestone Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-blue h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Deadline: {formattedDeadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {project.taskStats.completed} / {project.taskStats.total} Tasks Done
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {project.status === 'COMPLETED' && !project.hasFeedback && (
                        <button
                          onClick={() => setSelectedProjectFeedback(project)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
                          <span>Leave Feedback</span>
                        </button>
                      )}

                      <Link
                        to={`/client/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Testimonial Feedback Modal */}
      {selectedProjectFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-heading font-bold text-gray-800 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                <span>Submit Project Review</span>
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                Share your experience on project: <span className="font-bold text-gray-700">{selectedProjectFeedback.projectTitle}</span>
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="p-5 space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1.5 uppercase">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackRating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-gray-300 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Client Role & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Your Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Director"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindustan Groups"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Feedback text */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Review Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us about the project quality, team communication, and overall execution..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white resize-none"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProjectFeedback(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitFeedbackMutation.isPending}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 cursor-pointer shadow-md disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
