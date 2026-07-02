/**
 * Admin Testimonials — CRUD
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function TestimonialForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? { name: '', role: '', company: '', text: '', rating: 5, order: 0, isActive: true },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Client Name *</label>
          <input {...register('name', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Role *</label>
          <input {...register('role', { required: true })} placeholder="CEO"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Company *</label>
          <input {...register('company', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Rating (1-5)</label>
          <input type="number" min="1" max="5" {...register('rating', { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Avatar URL</label>
          <input {...register('avatarUrl')} placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Review Text *</label>
        <textarea rows={3} {...register('text', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="tActive" {...register('isActive')} className="rounded" />
        <label htmlFor="tActive" className="text-sm text-gray-600">Show on website</label>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white
            text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-60">
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

export default function AdminTestimonialsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/admin/testimonials').then(r => r.data),
  })

  const createM = useMutation({
    mutationFn: (d) => api.post('/admin/testimonials', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setShowForm(false) },
  })

  const updateM = useMutation({
    mutationFn: ({ id, ...d }) => api.patch(`/admin/testimonials/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setEditing(null) },
  })

  const deleteM = useMutation({
    mutationFn: (id) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  return (
    <>
      <SEO title="Testimonials" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-sm text-gray-500 mt-1">Manage client reviews shown on the website.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white
              text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New Testimonial</h3>
            <TestimonialForm onSave={createM.mutate} onCancel={() => setShowForm(false)} loading={createM.isPending} />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4"><div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" /></div>
            ))
          ) : items.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No testimonials yet.</p>
          ) : items.map(t => (
            <div key={t.id}>
              {editing?.id === t.id ? (
                <div className="p-5">
                  <TestimonialForm
                    initial={t}
                    onSave={(d) => updateM.mutate({ id: t.id, ...d })}
                    onCancel={() => setEditing(null)}
                    loading={updateM.isPending}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-gray-900 text-sm">{t.name}</span>
                      <span className="text-xs text-gray-400">{t.role}, {t.company}</span>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      {!t.isActive && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full">Hidden</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate italic">&ldquo;{t.text}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(t)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete?')) deleteM.mutate(t.id) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
