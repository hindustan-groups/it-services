import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

function FaqForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? { question: '', answer: '', order: 0, isActive: true },
  })
  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-3">
          <label className="text-xs font-medium text-gray-600 block mb-1">Question *</label>
          <input {...register('question', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Order</label>
          <input type="number" {...register('order', { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Answer *</label>
        <textarea rows={3} {...register('answer', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="fActive" {...register('isActive')} className="rounded" />
        <label htmlFor="fActive" className="text-sm text-gray-600">Show on website</label>
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

export default function AdminFaqPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: () => api.get('/admin/faqs').then(r => r.data),
  })

  const createM = useMutation({
    mutationFn: d => api.post('/admin/faqs', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); setShowForm(false) },
  })
  const updateM = useMutation({
    mutationFn: ({ id, ...d }) => api.patch(`/admin/faqs/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faqs'] }); setEditing(null) },
  })
  const deleteM = useMutation({
    mutationFn: id => api.delete(`/admin/faqs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-faqs'] }),
  })

  return (
    <>
      <SEO title="FAQs" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">FAQs</h1>
            <p className="text-sm text-gray-500 mt-1">Manage frequently asked questions shown on the website.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New FAQ</h3>
            <FaqForm onSave={createM.mutate} onCancel={() => setShowForm(false)} loading={createM.isPending} />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4"><div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" /></div>
          )) : faqs.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No FAQs yet.</p>
          ) : faqs.map(f => (
            <div key={f.id}>
              {editing?.id === f.id ? (
                <div className="p-5">
                  <FaqForm initial={f} onSave={d => updateM.mutate({ id: f.id, ...d })} onCancel={() => setEditing(null)} loading={updateM.isPending} />
                </div>
              ) : (
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 font-mono">#{f.order}</span>
                      <span className="font-medium text-gray-900 text-sm">{f.question}</span>
                      {!f.isActive && <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full">Hidden</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(f)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (window.confirm('Delete?')) deleteM.mutate(f.id) }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
