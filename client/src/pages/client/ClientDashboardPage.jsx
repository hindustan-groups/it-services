/**
 * ClientDashboardPage.jsx — Client Portal Dashboard Overview
 */
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  MessageCircle,
} from 'lucide-react'
import { useClientProjects } from '@/hooks/useClientPortal'
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

export default function ClientDashboardPage() {
  const { data: projects = [], isLoading } = useClientProjects()
  const { data: settingsData } = useSiteSettings()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeProjects = projects.filter((p) => p.status !== 'COMPLETED')
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED')

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects.length,
      icon: FolderKanban,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Completed Projects',
      value: completedProjects.length,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Overall Progress',
      value: projects.length > 0 
        ? `${Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length)}%` 
        : '0%',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/80 border border-gray-150 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${stat.color}`}>
              <stat.icon className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
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
                    
                    <Link
                      to={`/client/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
