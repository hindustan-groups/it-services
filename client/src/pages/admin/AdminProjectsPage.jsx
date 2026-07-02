/**
 * Admin Projects — CRUD with image URL field
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const CATEGORIES = ['Web', 'App', 'Marketing', 'Branding', 'Software']

function ProjectForm({ initial, onSave, onCancel, loading }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initial ?? {
      title: '', slug: '', clientName: '', description: '',
      thumbnailUrl: '', technologies: '', category: 'Web', isFeatured: false,
    },
  })

  const onSubmit = (data) => {
    onSave({
      ...data,
      technologies: data.technologies
        ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      isFeatured: Boolean(data.isFeatured),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
          <input {...register('title', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
          <input {...register('slug', { required: true })} placeholder="my-project"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Client Name *</label>
          <input {...register('clientName', { required: true })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
          <select {...register('category')}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Thumbnail URL</label>
          <input {...register('thumbnailUrl')} placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Technologies (comma separated)
          </label>
          <input {...register('technologies')} placeholder="React, Node.js, PostgreSQL"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Description *</label>
        <textarea rows={3} {...register('description', { required: true })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" {...register('isFeatured')} className="rounded" />
        <label htmlFor="isFeatured" className="text-sm text-gray-600">Featured project</label>
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

export default function AdminProjectsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/admin/projects').then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/projects', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); setShowForm(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/admin/projects/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  })

  return (
    <>
      <SEO title="Projects" noIndex />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your portfolio projects.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white
              text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-heading text-base font-semibold text-gray-800 mb-4">New Project</h3>
            <ProjectForm
              onSave={createMutation.mutate}
              onCancel={() => setShowForm(false)}
              loading={createMutation.isPending}
            />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
              </div>
            ))
          ) : projects.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">No projects yet.</p>
          ) : projects.map(p => (
            <div key={p.id}>
              {editing?.id === p.id ? (
                <div className="p-5">
                  <ProjectForm
                    initial={{ ...p, technologies: p.technologies?.join(', ') }}
                    onSave={(data) => updateMutation.mutate({ id: p.id, ...data })}
                    onCancel={() => setEditing(null)}
                    loading={updateMutation.isPending}
                  />
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  {p.thumbnailUrl && (
                    <img src={p.thumbnailUrl} alt={p.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100"
                      loading="lazy" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{p.title}</span>
                      {p.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-medium">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.clientName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditing(p)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue
                        hover:bg-brand-blue/5 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (window.confirm('Delete project?')) deleteMutation.mutate(p.id) }}
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
