/**
 * Admin Services — CRUD
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function ServiceForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initial ?? { title: '', slug: '', shortDescription: '', fullDescription: '', icon: 'Globe', order: 0, isActive: true },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
          <input {...register('title', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
          <input {...register('slug', { required: true })}
            placeholder="web-development"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Icon (Lucide name)</label>
          <input {...register('icon')} placeholder="Globe"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Short Description *</label>
        <input {...register('shortDescription', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Full Description *</label>
        <textarea rows={4} {...register('fullDescription', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
        <label htmlFor="isActive" className="text-sm text-gray-600">Active</label>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white
            text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors
            disabled:opacity-60">
          <Check className="w-4 h-4" /> Save
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600
            text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminServicesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/admin/services').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/services', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setShowForm(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/services/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  })

  return (
    <>
      <SEO title="Services" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your IT services listing.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white
              text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New Service</h3>
            <ServiceForm
              onSave={createMutation.mutate}
              onCancel={() => setShowForm(false)}
              loading={createMutation.isPending}
            />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            ))
          ) : services.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No services yet.</p>
          ) : services.map(s => (
            <div key={s.id}>
              {editing?.id === s.id ? (
                <div className="p-5">
                  <ServiceForm
                    initial={s}
                    onSave={(data) => updateMutation.mutate({ id: s.id, ...data })}
                    onCancel={() => setEditing(null)}
                    loading={updateMutation.isPending}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{s.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                        ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{s.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(s)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue
                        hover:bg-brand-blue/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete service?')) deleteMutation.mutate(s.id) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
                        hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
