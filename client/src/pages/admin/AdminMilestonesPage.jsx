import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function MilestoneForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? { year: '', title: '', desc: '', order: 0 },
  })
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Year *</label>
          <input {...register('year', { required: true })} placeholder="2024"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
          <input {...register('title', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Description *</label>
        <textarea rows={2} {...register('desc', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-60">
          <Check className="w-4 h-4" /> Save
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminMilestonesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-milestones'],
    queryFn: () => api.get('/admin/milestones').then(r => r.data),
  })
  const createM = useMutation({
    mutationFn: d => api.post('/admin/milestones', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-milestones'] }); setShowForm(false) },
  })
  const updateM = useMutation({
    mutationFn: ({ id, ...d }) => api.patch(`/admin/milestones/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-milestones'] }); setEditing(null) },
  })
  const deleteM = useMutation({
    mutationFn: id => api.delete(`/admin/milestones/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-milestones'] }),
  })

  return (
    <>
      <SEO title="Milestones" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Milestones</h1>
            <p className="text-sm text-gray-500 mt-1">Company journey timeline shown on the About page.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New Milestone</h3>
            <MilestoneForm onSave={createM.mutate} onCancel={() => setShowForm(false)} loading={createM.isPending} />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4"><div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" /></div>
          )) : items.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No milestones yet.</p>
          ) : items.map(m => (
            <div key={m.id}>
              {editing?.id === m.id ? (
                <div className="p-5">
                  <MilestoneForm initial={m} onSave={d => updateM.mutate({ id: m.id, ...d })} onCancel={() => setEditing(null)} loading={updateM.isPending} />
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-blue flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">{m.year}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{m.title}</p>
                    <p className="text-xs text-gray-500 truncate">{m.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (window.confirm('Delete?')) deleteM.mutate(m.id) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
