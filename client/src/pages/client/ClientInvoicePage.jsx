/**
 * ClientInvoicePage.jsx — Beautiful, print-friendly digital payment receipt & invoice
 */
import { useParams, Link } from 'react-router-dom'
import { Printer, ArrowLeft, CheckCircle, FileText, Globe, Mail, Phone, MapPin } from 'lucide-react'
import { useClientInvoice } from '@/hooks/useClientPortal'

export default function ClientInvoicePage() {
  const { milestoneId } = useParams()
  const { data: response, isLoading, error } = useClientInvoice(milestoneId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 print:hidden">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !response?.data) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-2xl text-center print:hidden">
        <h4 className="text-red-800 font-bold font-heading">Error Loading Invoice</h4>
        <p className="text-xs text-red-600 mt-2">Could not load the invoice details. Please verify your credentials or contact support.</p>
        <Link to="/client/billing" className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-brand-blue hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Billing</span>
        </Link>
      </div>
    )
  }

  const milestone = response.data
  const project = milestone.clientProject
  const client = project?.client

  const invoiceNumber = `INV-${milestone.id.slice(-6).toUpperCase()}`
  const formattedPaidDate = milestone.paidAt
    ? new Date(milestone.paidAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A'

  const formattedDueDate = milestone.dueDate
    ? new Date(milestone.dueDate).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto my-4 md:my-8 px-4 print:my-0 print:px-0">
      {/* Action Bar (Hidden during print) */}
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm print:hidden">
        <Link
          to="/client/billing"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing</span>
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Actual Invoice Sheet */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-12 shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-black text-brand-blue tracking-tight font-heading">Hi</span>
              <span className="text-3xl font-black text-brand-red tracking-tight font-heading">PRO</span>
            </div>
            <div className="text-[10px] font-bold text-brand-blue tracking-[0.2em] uppercase mt-0.5">
              Hindustan Projects
            </div>
            <div className="text-[8px] text-gray-400 font-medium tracking-wide mt-1">
              Engineering &bull; Construction &bull; Infrastructure
            </div>
          </div>
          
          <div className="text-left sm:text-right text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>www.itservices.hindustanprojects.in</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>+91 99291 20431</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>Bhilwara &ndash; 311001, Rajasthan, India</span>
            </div>
          </div>
        </div>

        {/* Invoice Summary Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-100">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To</h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-gray-900">{client?.name || 'Valued Client'}</p>
              {client?.email && (
                <p className="text-gray-500 flex items-center gap-1.5 text-xs">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{client.email}</span>
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2 font-medium">Project Name:</p>
              <p className="font-semibold text-gray-800 text-xs">{project?.projectTitle || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-3 sm:text-right">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice / Receipt No</p>
              <p className="text-lg font-extrabold text-gray-900 mt-0.5 tracking-tight">{invoiceNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:justify-items-end text-xs">
              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wide">Paid On</p>
                <p className="font-semibold text-gray-800 mt-0.5">{formattedPaidDate}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wide">Due Date</p>
                <p className="font-semibold text-gray-800 mt-0.5">{formattedDueDate}</p>
              </div>
            </div>
            <div className="pt-2 sm:flex sm:justify-end">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-bold shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-50" />
                <span>PAID RECEIPT</span>
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 text-left">Description / Particulars</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-5 text-left align-top">
                  <div className="font-bold text-gray-900 text-sm">{milestone.title}</div>
                  <div className="text-xs text-gray-400 mt-1 max-w-md font-medium">
                    Deliverables Unlocked: {milestone.deliverables || 'Project milestone documentation, files, and deliverables.'}
                  </div>
                </td>
                <td className="py-5 text-right align-top font-bold text-gray-900 text-sm">
                  ₹{milestone.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="border-t-2 border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="text-xs text-gray-400 space-y-1">
            <p className="font-bold text-gray-700">Tax & Billing Information:</p>
            <p>GSTIN / Corporate Tax ID: <span className="font-mono text-gray-800 font-semibold">08AAACH9929P1Z5</span></p>
            <p>Payment Method: Online Direct Transfer / Digital Milestone Gateway</p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue border border-blue-100 rounded-lg text-[10px] font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-brand-blue" />
                <span>Verified Hindustan Projects Digital Receipt</span>
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between font-medium text-gray-500">
              <span>Base Subtotal</span>
              <span>₹{(milestone.amount / 1.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-500">
              <span>CGST (9%)</span>
              <span>₹{((milestone.amount / 1.18) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-500">
              <span>SGST (9%)</span>
              <span>₹{((milestone.amount / 1.18) * 0.09).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-gray-200 pt-3">
              <span className="text-sm font-bold text-gray-900">Total Amount Paid</span>
              <span className="text-lg font-black text-brand-blue">
                ₹{milestone.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center space-y-2">
          <p className="text-xs text-gray-400 font-medium">
            Thank you for partnering with Hindustan Projects. We look forward to working with you again.
          </p>
          <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-300 font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Computer Generated GST Tax Invoice & Receipt</span>
          </div>
        </div>

      </div>
    </div>
  )
}
