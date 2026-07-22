/**
 * AdminBillingSection.jsx — Billing Milestones manager component inside Client Project Details
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { Landmark, Plus, Trash2, CheckCircle2, Calendar, FileText, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const STATUS_BADGES = {
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  OVERDUE: 'bg-red-50 text-red-700 border-red-200',
}

const inputCls =
  'w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20'

export default function AdminBillingSection({ projectId, currentRole }) {
  const qc = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)

  // Fetch milestones
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['admin-project-billing', projectId],
    queryFn: () => api.get(`/admin/client-projects/${projectId}/billing`).then((res) => res.data),
  })

  // Create milestone mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post(`/admin/client-projects/${projectId}/billing`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-project-billing', projectId] })
      setShowAddForm(false)
      reset()
    },
  })

  // Update milestone status (mark as paid)
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/billing/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-project-billing', projectId] })
    },
  })

  // Delete milestone
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/billing/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-project-billing', projectId] })
    },
  })

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      dueDate: '',
      status: 'PENDING',
      deliverablesText: '',
    },
  })

  const onCreateSubmit = async (data) => {
    try {
      const parsedDeliverables = data.deliverablesText
        ? data.deliverablesText.split(',').map((d) => d.trim()).filter(Boolean)
        : []

      await createMutation.mutateAsync({
        title: data.title,
        amount: data.amount,
        dueDate: data.dueDate,
        status: data.status,
        deliverables: parsedDeliverables,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleTogglePaid = async (item) => {
    const nextStatus = item.status === 'PAID' ? 'PENDING' : 'PAID'
    try {
      await updateMutation.mutateAsync({ id: item.id, status: nextStatus })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this billing milestone?')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-4 text-xs text-gray-400">Loading billing milestones...</div>
  }

  // Calculate stats
  const totalBudget = milestones.reduce((sum, m) => sum + m.amount, 0)
  const paidAmount = milestones.filter((m) => m.status === 'PAID').reduce((sum, m) => sum + m.amount, 0)

  return (
    <div className="space-y-6">
      {/* Financial totals snapshot */}
      <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-wrap justify-between gap-4 items-center">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-brand-blue" />
          <div>
            <h4 className="text-xs font-bold text-gray-700">Financial Milestone Summary</h4>
            <p className="text-[10px] text-gray-400">Track paid receipts vs outstanding contract balance.</p>
          </div>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <span className="text-[9px] font-semibold text-gray-400 uppercase">Paid / Funded</span>
            <p className="text-xs font-bold text-emerald-600">₹{paidAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="border-l border-gray-200 pl-6">
            <span className="text-[9px] font-semibold text-gray-400 uppercase">Contract Total</span>
            <p className="text-xs font-bold text-gray-800">₹{totalBudget.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Header and Add Trigger */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Milestones</h4>
        {currentRole !== 'STAFF' && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* New Milestone Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit(onCreateSubmit)}
          className="p-4 border border-dashed border-gray-250 bg-gray-50/40 rounded-2xl space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">Milestone Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Design Approval Milestone"
                {...register('title')}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">Amount (INR)</label>
              <input
                type="number"
                required
                placeholder="e.g. 50000"
                {...register('amount')}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">Due Date</label>
              <input type="date" {...register('dueDate')} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 block mb-1">
              Deliverables (comma-separated list, e.g. Figma wireframe link, UI/UX designs)
            </label>
            <input
              type="text"
              placeholder="e.g. Figma Link, Database Schema, API endpoints draft"
              {...register('deliverablesText')}
              className={inputCls}
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-[10px] font-bold bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-all cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.length === 0 ? (
          <div className="p-6 border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
            No milestones registered.
          </div>
        ) : (
          milestones.map((item) => {
            const formattedDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-150 rounded-xl bg-white gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">{item.title}</h5>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {formattedDate}</span>
                      </span>
                      {item.paidAt && (
                        <span className="text-emerald-600">
                          Paid: {new Date(item.paidAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {item.deliverables && Array.isArray(item.deliverables) && item.deliverables.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.deliverables.map((del, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-semibold border border-gray-150 flex items-center gap-1">
                            <span>📦</span>
                            <span>{del}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-800">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider shrink-0 ${STATUS_BADGES[item.status]}`}>
                      {item.status}
                    </span>

                    {currentRole !== 'STAFF' && (
                      <button
                        onClick={() => handleTogglePaid(item)}
                        className={`px-2 py-1 border rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                          item.status === 'PAID'
                            ? 'text-amber-600 border-amber-200 hover:bg-amber-50'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {item.status === 'PAID' ? 'Mark Pending' : 'Mark Paid'}
                      </button>
                    )}

                    {currentRole === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
