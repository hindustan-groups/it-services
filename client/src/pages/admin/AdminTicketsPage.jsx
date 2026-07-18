/**
 * AdminTicketsPage.jsx — Admin Support Ticketing Panel
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/api'
import { MessageSquare, Send, ArrowLeft, User, Paperclip } from 'lucide-react'

const TICKET_CATEGORIES = {
  TECHNICAL: 'Technical Issue',
  BILLING: 'Billing & Invoices',
  UPDATE: 'Project Progress Update',
  OTHER: 'General Inquiry',
}

const STATUS_BADGES = {
  OPEN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-250',
}

export default function AdminTicketsPage() {
  const qc = useQueryClient()
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Fetch all tickets
  const { data: tickets = [], isLoading: loadingList } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: () => api.get('/admin/tickets').then((res) => res.data),
  })

  // Fetch individual ticket messages
  const { data: ticketDetail, isLoading: loadingDetail } = useQuery({
    queryKey: ['admin-ticket', selectedTicketId],
    queryFn: () => api.get(`/admin/tickets/${selectedTicketId}`).then((res) => res.data),
    enabled: !!selectedTicketId,
  })

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ id, message }) => api.post(`/admin/tickets/${id}/messages`, { message }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-ticket', selectedTicketId] })
      qc.invalidateQueries({ queryKey: ['admin-tickets'] })
      setReplyText('')
    },
  })

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/tickets/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-ticket', selectedTicketId] })
      qc.invalidateQueries({ queryKey: ['admin-tickets'] })
    },
  })

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    try {
      await replyMutation.mutateAsync({
        id: selectedTicketId,
        message: replyText,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await statusMutation.mutateAsync({
        id: selectedTicketId,
        status: newStatus,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'ALL') return true
    return t.status === statusFilter
  })

  if (loadingList) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Support Desk</h2>
        <p className="text-sm text-gray-500">Manage client support inquiries, discussions, and resolution status.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-250 pb-px">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-xs font-bold transition-all relative -mb-px border-b-2 cursor-pointer ${
              statusFilter === status
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {status.replace('_', ' ')}
            {status !== 'ALL' && (
              <span className="ml-1.5 px-1.5 py-0.25 bg-gray-100 text-gray-600 rounded-full text-[9px]">
                {tickets.filter((t) => t.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ticket List Panel */}
        <div className={`lg:col-span-1 bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm ${selectedTicketId ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700">Open Queries</h3>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No matching tickets found.</p>
              </div>
            ) : (
              filteredTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50/50 transition-colors flex flex-col gap-2 ${
                    selectedTicketId === t.id ? 'bg-blue-50/40 border-r-4 border-brand-blue' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {TICKET_CATEGORIES[t.category] || t.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${STATUS_BADGES[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                    <User className="w-3 h-3" />
                    <span>Client: {t.client?.name}</span>
                  </div>
                  {t.clientProject && (
                    <span className="text-[10px] text-brand-blue font-medium">
                      Project: {t.clientProject.projectTitle}
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400 self-end">
                    Last active: {new Date(t.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Ticket Chat Message Panel */}
        <div className={`lg:col-span-2 bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[450px] lg:min-h-[550px] ${selectedTicketId ? 'block' : 'hidden lg:flex justify-center items-center text-center p-12'}`}>
          {selectedTicketId ? (
            <>
              {/* Detail Header */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedTicketId(null)}
                    className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">
                      {loadingDetail ? 'Loading...' : ticketDetail?.subject}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Client Email: {ticketDetail?.client?.email}
                    </p>
                  </div>
                </div>
                
                {/* Status selection and badges */}
                <div className="flex items-center gap-2">
                  <select
                    value={ticketDetail?.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-gray-200 bg-white rounded-lg focus:outline-none"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved / Closed</option>
                  </select>
                  <span className={`px-2 py-1 text-[9px] font-bold rounded border uppercase tracking-wider ${STATUS_BADGES[ticketDetail?.status]}`}>
                    {ticketDetail?.status}
                  </span>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[250px] max-h-[380px] bg-gray-50/30">
                {loadingDetail ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  ticketDetail?.messages?.map((msg) => {
                    const isSelf = msg.senderType === 'ADMIN'
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <span className="text-[9px] text-gray-400 font-semibold mb-1">
                          {msg.senderName}
                        </span>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isSelf
                              ? 'bg-brand-blue text-white rounded-tr-none'
                              : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <div>{msg.message}</div>
                          {msg.fileUrl && (
                            <div className={`mt-2 flex items-center gap-2 p-1.5 rounded-xl text-[10px] ${
                              isSelf
                                ? 'bg-white/10 border border-white/20 text-white'
                                : 'bg-gray-50 border border-gray-150 text-gray-700'
                            }`}>
                              <Paperclip className="w-3 h-3 shrink-0" />
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline truncate max-w-[180px] hover:opacity-85"
                                title={msg.fileName}
                              >
                                {msg.fileName || 'View Attachment'}
                              </a>
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Chat Reply Box */}
              {!loadingDetail ? (
                <form onSubmit={handleSendReply} className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type an official admin reply..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={replyMutation.isPending}
                    className="p-2.5 bg-brand-blue text-white rounded-xl hover:bg-blue-600 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : null}
            </>
          ) : (
            <div className="space-y-3">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto opacity-75" />
              <h4 className="text-sm font-bold text-gray-700">No Query Selected</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Select an open query ticket from the left panel to review client discussion threads, change ticket status, or reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
