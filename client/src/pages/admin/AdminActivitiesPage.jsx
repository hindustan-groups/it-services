/**
 * AdminActivitiesPage — View logs of who made what updates and when
 */
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { History, Search, ShieldAlert, User } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const ACTION_COLORS = {
  CREATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE: 'bg-blue-50 text-blue-700 border-blue-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
}

const ENTITY_LABELS = {
  ClientProject: 'Client Project',
  WorkTask: 'Task',
  QuickNote: 'Sticky Note',
}

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [entityFilter, setEntityFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: () => api.get('/admin/activities').then((r) => r.data),
  })

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.details?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEntity = entityFilter === 'ALL' || act.entity === entityFilter
    const matchesAction = actionFilter === 'ALL' || act.action === actionFilter

    return matchesSearch && matchesEntity && matchesAction
  })

  return (
    <>
      <SEO title="Activity Log" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <History className="w-6 h-6 text-brand-blue" />
            System Activity Log
          </h1>
          <p className="text-sm text-gray-500">
            Track which administrator performed what create, update, or delete operations.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by details or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>
          <div>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">Filter by Entity: All</option>
              <option value="ClientProject">Client Projects Only</option>
              <option value="WorkTask">Tasks Only</option>
              <option value="QuickNote">Sticky Notes Only</option>
            </select>
          </div>
          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">Filter by Action: All</option>
              <option value="CREATE">Create Actions</option>
              <option value="UPDATE">Update Actions</option>
              <option value="DELETE">Delete Actions</option>
            </select>
          </div>
        </div>

        {/* Timeline Content */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-4 items-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-150 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-150 rounded w-1/3" />
                  <div className="h-3 bg-gray-150 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-14 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm font-medium">
              No activity logs recorded matching criteria.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            {/* Center line for vertical timeline */}
            <div className="absolute left-[37px] top-6 bottom-6 w-0.5 bg-gray-100" />

            <div className="space-y-6 relative">
              {filteredActivities.map((act) => (
                <div key={act.id} className="flex gap-4 items-start group">
                  {/* Timeline avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm relative z-10">
                    {act.adminEmail[0].toUpperCase()}
                  </div>

                  {/* Log Details Box */}
                  <div className="flex-1 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl p-3.5 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Admin name */}
                        <span className="font-bold text-xs text-gray-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {act.adminEmail}
                        </span>

                        {/* Entity type */}
                        <span className="text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.2 rounded uppercase">
                          {ENTITY_LABELS[act.entity] || act.entity}
                        </span>
                      </div>

                      {/* Created date/time */}
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {new Date(act.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Details content row */}
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">
                        {act.details}
                      </p>

                      {/* Action tag badge */}
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                          ACTION_COLORS[act.action] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {act.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
