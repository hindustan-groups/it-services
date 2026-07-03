/**
 * AdminCalendarPage — Interactive Month Calendar for Deadlines and Tasks
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState(null) // { day, projects: [], tasks: [] }

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Fetch client projects
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['admin-client-projects'],
    queryFn: () => api.get('/admin/client-projects').then((r) => r.data),
  })

  // Fetch tasks
  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: () => api.get('/admin/tasks').then((r) => r.data),
  })

  // Helper: Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()

  // Helper: Get number of days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Helper: Get number of days in previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Generate calendar days grid
  const calendarCells = []

  // 1. Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const prevDate = new Date(currentYear, currentMonth - 1, day)
    calendarCells.push({ date: prevDate, isCurrentMonth: false })
  }

  // 2. Current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(currentYear, currentMonth, d)
    calendarCells.push({ date: currDate, isCurrentMonth: true })
  }

  // 3. Next month padding cells
  const totalCells = 42 // 6 rows of 7 columns
  const remainingCells = totalCells - calendarCells.length
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(currentYear, currentMonth + 1, d)
    calendarCells.push({ date: nextDate, isCurrentMonth: false })
  }

  // Helper: Match items by date (ignoring time)
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const getEventsForDate = (date) => {
    const dayProjects = projects.filter((p) => p.deadline && isSameDay(new Date(p.deadline), date))
    const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), date))
    return { projects: dayProjects, tasks: dayTasks }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedDayEvents(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedDayEvents(null)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDayEvents(null)
  }

  const handleDayClick = (date, events) => {
    setSelectedDayEvents({
      date,
      projects: events.projects,
      tasks: events.tasks,
    })
  }

  const isToday = (date) => isSameDay(date, new Date())

  return (
    <>
      <SEO title="Work Calendar" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">
              Work Calendar & Deadlines
            </h1>
            <p className="text-sm text-gray-500">
              View upcoming client deadlines and tasks in a monthly calendar layout.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToday}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Today
            </button>
            <div className="flex items-center border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-50 border-r border-gray-150 text-gray-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend / Visual Guide */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-gray-400 uppercase text-[10px] font-bold mr-1">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" />
            <span>Project Deadline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0" />
            <span>Task Due Date</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" />
            <span>Completed Item</span>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
          {/* Calendar Left: Main Grid */}
          <div className="flex-1 p-5 border-r border-gray-100 flex flex-col">
            {/* Month Year Banner */}
            <div className="flex items-center gap-2 mb-5">
              <CalendarIcon className="w-5 h-5 text-brand-blue" />
              <h2 className="text-lg font-bold font-heading text-gray-900">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
            </div>

            {/* Weekdays row */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase text-gray-400 border-b border-gray-150 pb-2 mb-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            {/* Grid days */}
            {loadingProjects || loadingTasks ? (
              <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 bg-gray-50/50">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1 bg-gray-50/40 min-h-[420px]">
                {calendarCells.map((cell, idx) => {
                  const events = getEventsForDate(cell.date)
                  const hasEvents = events.projects.length > 0 || events.tasks.length > 0
                  const isCurrent = isToday(cell.date)
                  const isSelected =
                    selectedDayEvents && isSameDay(selectedDayEvents.date, cell.date)

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(cell.date, events)}
                      className={`bg-white border border-gray-100 p-1.5 flex flex-col justify-between hover:bg-blue-50/30 transition-all cursor-pointer relative group min-h-[70px] ${
                        !cell.isCurrentMonth ? 'opacity-35 bg-gray-50/50' : ''
                      } ${isCurrent ? 'ring-1.5 ring-brand-blue/70 ring-inset' : ''} ${
                        isSelected ? 'bg-brand-blue/5' : ''
                      }`}
                    >
                      {/* Day number */}
                      <span
                        className={`text-xs font-bold leading-none w-5 h-5 rounded-full flex items-center justify-center ${
                          isCurrent
                            ? 'bg-brand-blue text-white font-extrabold'
                            : cell.isCurrentMonth
                              ? 'text-gray-900'
                              : 'text-gray-400'
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>

                      {/* Event indicators (stacked) */}
                      <div className="space-y-0.5 mt-1 overflow-hidden flex-1 flex flex-col justify-end">
                        {events.projects.slice(0, 2).map((p) => (
                          <div
                            key={p.id}
                            className={`text-[9px] px-1 py-0.5 rounded border truncate leading-tight font-bold ${
                              p.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                            title={`Project: ${p.projectTitle}`}
                          >
                            📅 {p.projectTitle}
                          </div>
                        ))}
                        {events.tasks.slice(0, 2).map((t) => (
                          <div
                            key={t.id}
                            className={`text-[9px] px-1 py-0.5 rounded border truncate leading-tight font-semibold ${
                              t.status === 'DONE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-250'
                            }`}
                            title={`Task: ${t.title}`}
                          >
                            ✓ {t.title}
                          </div>
                        ))}
                        {hasEvents && events.projects.length + events.tasks.length > 4 && (
                          <div className="text-[8px] text-gray-400 text-center font-bold">
                            +{events.projects.length + events.tasks.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Calendar Right: Selected Day details panel */}
          <div className="w-full md:w-80 p-5 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-150 flex flex-col">
            <h3 className="font-bold font-heading text-sm text-gray-800 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
              Agenda Details
            </h3>

            {selectedDayEvents ? (
              <div className="flex-1 flex flex-col space-y-4">
                {/* Date Header */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Selected Date</p>
                  <p className="text-base font-extrabold text-gray-900 font-heading leading-tight mt-0.5">
                    {selectedDayEvents.date.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Projects list */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <span>Projects Due</span>
                    <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                      {selectedDayEvents.projects.length}
                    </span>
                  </h4>
                  {selectedDayEvents.projects.length === 0 ? (
                    <p className="text-xs text-gray-400 italic bg-white p-3 rounded-xl border border-gray-200">
                      No projects due today.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDayEvents.projects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs"
                        >
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-red-50 text-red-700 border-red-200'}`}
                          >
                            {p.status}
                          </span>
                          <h5 className="font-bold text-sm text-gray-900 leading-snug mt-1.5">
                            {p.projectTitle}
                          </h5>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">
                            Client: {p.clientName}
                          </p>
                          {p.assignedTo && (
                            <p className="text-[10px] text-gray-400 font-semibold mt-2">
                              👤 {p.assignedTo}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tasks list */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <span>Tasks Due</span>
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                      {selectedDayEvents.tasks.length}
                    </span>
                  </h4>
                  {selectedDayEvents.tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic bg-white p-3 rounded-xl border border-gray-200">
                      No tasks due today.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDayEvents.tasks.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            {t.status === 'DONE' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : t.status === 'BLOCKED' ? (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-blue-500" />
                            )}
                            <span className="text-[10px] font-bold uppercase text-gray-600">
                              {t.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h5 className="font-bold text-xs text-gray-900 leading-snug mt-1.5">
                            {t.title}
                          </h5>
                          {t.assignedTo && (
                            <p className="text-[10px] text-gray-400 font-semibold mt-1">
                              👤 {t.assignedTo}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <CalendarIcon className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-medium">
                  Click on any date to view project deadlines and tasks scheduled.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
