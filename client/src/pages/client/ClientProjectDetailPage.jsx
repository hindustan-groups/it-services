/**
 * ClientProjectDetailPage.jsx — Detailed project status and task checklist
 */
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  HelpCircle,
  FileText,
  AlertTriangle,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  File,
  Download,
} from 'lucide-react'
import { useClientProject } from '@/hooks/useClientPortal'

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

const TASK_STATUS_COLORS = {
  TODO: 'bg-gray-100 text-gray-500 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-100',
  DONE: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  BLOCKED: 'bg-red-50 text-red-600 border-red-100',
}

const TASK_STATUS_LABELS = {
  TODO: 'Pending',
  IN_PROGRESS: 'In Progress',
  DONE: 'Completed',
  BLOCKED: 'On Hold / Blocked',
}

export default function ClientProjectDetailPage() {
  const { id } = useParams()
  const { data: project, isLoading, isError } = useClientProject(id)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 font-heading">Failed to load project</h3>
        <p className="text-sm text-gray-500 mt-1">This project does not exist or you do not have permission to view it.</p>
        <Link to="/client/dashboard" className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-blue hover:bg-brand-blue-hover transition-colors">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const tasks = project.tasks || []
  const completedTasks = tasks.filter((t) => t.status === 'DONE')


  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/client/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading">{project.projectTitle}</h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">Project Reference ID: {project.id}</p>
          </div>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${STATUS_COLORS[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          {project.description || 'No description provided for this project.'}
        </p>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2.5 max-w-xl">
          <div className="flex justify-between text-sm font-bold text-gray-700">
            <span>Overall Milestone Completion</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-150 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-blue h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Grid Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(project.startDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Launch</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDate(project.deadline)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliverable Tasks</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {completedTasks.length} / {tasks.length} Completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks / Deliverables Checklist */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 font-heading">Project Checklist & Deliverables</h3>

        {tasks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-10 text-center shadow-sm">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Checklist not configured yet.</p>
            <p className="text-xs text-gray-400 mt-1">Our team is setting up your project roadmap.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-150">
              {tasks.map((task) => {
                const isDone = task.status === 'DONE'

                return (
                  <div key={task.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5.5 h-5.5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold leading-snug ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-2xl">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider self-start sm:self-center shrink-0 ${TASK_STATUS_COLORS[task.status]}`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Shared Files & Documents */}
      {project.attachments && project.attachments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Shared Files & Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.attachments.map((item) => {
              const mime = item.fileType.toLowerCase()
              let iconColor = 'text-gray-500 bg-gray-50'
              if (mime.startsWith('image/')) iconColor = 'text-blue-500 bg-blue-50'
              else if (mime === 'application/pdf') iconColor = 'text-red-500 bg-red-50'
              else if (mime.includes('word') || mime.includes('msword')) iconColor = 'text-indigo-500 bg-indigo-50'
              else if (mime.includes('excel') || mime.includes('spreadsheet') || mime.includes('sheet')) iconColor = 'text-emerald-500 bg-emerald-50'
              else if (mime.includes('zip') || mime.includes('compressed')) iconColor = 'text-purple-500 bg-purple-50'

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-2xl bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-xl ${iconColor} shrink-0`}>
                      {mime.startsWith('image/') ? (
                        <FileImage className="w-4 h-4" />
                      ) : mime === 'application/pdf' ? (
                        <FileText className="w-4 h-4" />
                      ) : mime.includes('excel') || mime.includes('sheet') ? (
                        <FileSpreadsheet className="w-4 h-4" />
                      ) : mime.includes('zip') ? (
                        <FileArchive className="w-4 h-4" />
                      ) : (
                        <File className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.fileSize ? `${(item.fileSize / (1024 * 1024)).toFixed(2)} MB` : ''}
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all ml-4 shrink-0 cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
