/**
 * ClientBillingPage.jsx — Client Portal Billing & Financial Milestones Page
 */
import { Link } from 'react-router-dom'
import { useClientBilling, useClientPayMilestone } from '@/hooks/useClientPortal'
import { Landmark, Calendar, CheckCircle2, AlertCircle, FileText, TrendingUp, CreditCard } from 'lucide-react'

const MILESTONE_STATUS = {
  PAID: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-250',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  PENDING: {
    badge: 'bg-amber-50 text-amber-700 border-amber-250',
    icon: Calendar,
    iconColor: 'text-amber-500',
  },
  OVERDUE: {
    badge: 'bg-red-50 text-red-700 border-red-250',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
}

export default function ClientBillingPage() {
  const { data: milestones = [], isLoading } = useClientBilling()
  const payMutation = useClientPayMilestone()

  const handlePay = async (id) => {
    if (window.confirm('Simulate milestone payment check? This will immediately mark the milestone as PAID.')) {
      try {
        await payMutation.mutateAsync(id)
      } catch (_err) {
        // Handled by payMutation error state
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Calculate totals
  const totalBudget = milestones.reduce((sum, m) => sum + m.amount, 0)
  const paidAmount = milestones.filter((m) => m.status === 'PAID').reduce((sum, m) => sum + m.amount, 0)
  const pendingAmount = totalBudget - paidAmount
  const paidPct = totalBudget > 0 ? Math.round((paidAmount / totalBudget) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Billing & Payments</h2>
        <p className="text-sm text-gray-500">View project contract value, milestones progress, and invoice receipts.</p>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
            <Landmark className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Project Budget</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
              ₹{totalBudget.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Paid Amount</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
              ₹{paidAmount.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Balance</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-blue" />
            <span>Milestone Funding Progress</span>
          </span>
          <span className="font-bold text-brand-blue">{paidPct}% Funded</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${paidPct}%` }}
          />
        </div>
      </div>

      {/* Milestones Registry Table/Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 font-heading">Contractual Milestones</h3>

        {milestones.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-12 text-center">
            <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-500">No payment milestones registered for your projects.</p>
            <p className="text-xs text-gray-400 mt-1">Please contact billing support if this is incorrect.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {milestones.map((m) => {
              const statusCfg = MILESTONE_STATUS[m.status] || MILESTONE_STATUS.PENDING
              const Icon = statusCfg.icon
              const formattedDate = m.dueDate
                ? new Date(m.dueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'

              return (
                <div
                  key={m.id}
                  className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className={`p-3 rounded-xl bg-gray-50 shrink-0 ${statusCfg.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {m.clientProject?.projectTitle || 'Linked Project'}
                      </h4>
                      <h3 className="text-sm font-bold text-gray-800 truncate">{m.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {formattedDate}</span>
                        </span>
                        {m.paidAt && (
                          <span className="text-emerald-600 font-medium">
                            Paid: {new Date(m.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Render Deliverables Lock/Unlock status */}
                      {m.deliverables && Array.isArray(m.deliverables) && m.deliverables.length > 0 && (
                        <div className="mt-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/80">
                          <p className="text-[10px] font-bold text-gray-550 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            {m.status === 'PAID' ? (
                              <>
                                <span className="text-emerald-500">🔓</span>
                                <span>Unlocked Deliverables</span>
                              </>
                            ) : (
                              <>
                                <span className="text-amber-500">🔒</span>
                                <span>Locked Deliverables (Requires Payment)</span>
                              </>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.deliverables.map((del, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded text-[10px] font-semibold border flex items-center gap-1.5 transition-all ${
                                  m.status === 'PAID'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50'
                                    : 'bg-gray-100 text-gray-400 border-gray-200 select-none opacity-60'
                                }`}
                              >
                                <span>📦</span>
                                <span>{del}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Amount Due</p>
                      <h3 className="text-base font-bold text-gray-850">
                        ₹{m.amount.toLocaleString('en-IN')}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded border uppercase tracking-wider shrink-0 ${statusCfg.badge}`}>
                        {m.status}
                      </span>

                      {m.status === 'PAID' && m.invoiceUrl ? (
                        <Link
                          to={m.invoiceUrl}
                          className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl border border-gray-200 transition-all cursor-pointer shrink-0"
                          title="View Invoice Receipt"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                        </Link>
                      ) : m.status !== 'PAID' ? (
                        <button
                          onClick={() => handlePay(m.id)}
                          disabled={payMutation.isPending}
                          className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-sm disabled:opacity-50 transition-all cursor-pointer shrink-0"
                        >
                          Simulate Pay
                        </button>
                      ) : null}
                    </div>
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
