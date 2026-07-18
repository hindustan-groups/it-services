/**
 * ClientTicketsPage.jsx — Client Portal Support Ticket Desk
 */
import { useState } from 'react'
import {
  useClientTickets,
  useClientTicket,
  useClientCreateTicket,
  useClientReplyTicket,
  useClientProjects,
} from '@/hooks/useClientPortal'
import { MessageSquare, AlertCircle, Plus, Send, X, ArrowLeft, Clock, Paperclip, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'

const TICKET_CATEGORIES = [
  { value: 'TECHNICAL', label: 'Technical Issue' },
  { value: 'BILLING', label: 'Billing & Invoices' },
  { value: 'UPDATE', label: 'Project Progress Update' },
  { value: 'OTHER', label: 'General Inquiry' },
]

const STATUS_BADGES = {
  OPEN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

export default function ClientTicketsPage() {
  const { data: tickets = [], isLoading: loadingList } = useClientTickets()
  const { data: projects = [] } = useClientProjects()
  const createMutation = useClientCreateTicket()
  const replyMutation = useClientReplyTicket()

  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyFile, setReplyFile] = useState(null)
  const [createFile, setCreateFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch individual ticket messages
  const { data: ticketDetail, isLoading: loadingDetail } = useClientTicket(selectedTicketId)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      subject: '',
      category: 'TECHNICAL',
      clientProjectId: '',
      description: '',
    },
  })

  const uploadFileToServer = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/client/tickets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  }

  const onCreateSubmit = async (data) => {
    try {
      setIsUploading(true)
      let fileUrl = null
      let fileName = null

      if (createFile) {
        const uploadResult = await uploadFileToServer(createFile)
        fileUrl = uploadResult.fileUrl
        fileName = uploadResult.fileName
      }

      await createMutation.mutateAsync({
        ...data,
        clientProjectId: data.clientProjectId || null,
        fileUrl,
        fileName,
      })
      setShowCreateModal(false)
      setCreateFile(null)
      reset()
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() && !replyFile) return

    try {
      setIsUploading(true)
      let fileUrl = null
      let fileName = null

      if (replyFile) {
        const uploadResult = await uploadFileToServer(replyFile)
        fileUrl = uploadResult.fileUrl
        fileName = uploadResult.fileName
      }

      await replyMutation.mutateAsync({
        ticketId: selectedTicketId,
        message: replyText,
        fileUrl,
        fileName,
      })
      setReplyText('')
      setReplyFile(null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Support Tickets</h2>
          <p className="text-sm text-gray-500">Raise inquiries and discuss project updates directly with our team.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ticket List Panel */}
        <div className={`lg:col-span-1 bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm ${selectedTicketId ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700">Ticket Registry</h3>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No active support tickets found.</p>
              </div>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50/50 transition-colors flex flex-col gap-2 ${
                    selectedTicketId === t.id ? 'bg-blue-50/40 border-r-4 border-brand-blue' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {TICKET_CATEGORIES.find((cat) => cat.value === t.category)?.label || t.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${STATUS_BADGES[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{t.subject}</h4>
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
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 shrink-0">
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
                      Ticket ID: {selectedTicketId}
                    </p>
                  </div>
                </div>
                {!loadingDetail && (
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider ${STATUS_BADGES[ticketDetail?.status]}`}>
                    {ticketDetail?.status}
                  </span>
                )}
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[250px] max-h-[380px] bg-gray-50/30">
                {loadingDetail ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  ticketDetail?.messages?.map((msg) => {
                    const isSelf = msg.senderType === 'CLIENT'
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
              {!loadingDetail && ticketDetail?.status !== 'RESOLVED' ? (
                <div className="p-3 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                  {replyFile && (
                    <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl text-[10px] text-gray-700">
                      <div className="flex items-center gap-1.5 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                        <span className="font-semibold truncate">{replyFile.name}</span>
                        <span className="text-gray-400">({Math.round(replyFile.size / 1024)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyFile(null)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendReply} className="flex gap-2 items-center">
                    <input
                      type="file"
                      id="reply-file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setReplyFile(e.target.files[0])
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => document.getElementById('reply-file-upload').click()}
                      className="p-2.5 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={isUploading ? "Uploading attachment..." : "Write a message reply..."}
                      disabled={isUploading}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white disabled:opacity-50"
                    />

                    <button
                      type="submit"
                      disabled={replyMutation.isPending || isUploading}
                      className="p-2.5 bg-brand-blue text-white rounded-xl hover:bg-blue-600 shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[38px]"
                    >
                      {isUploading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </form>
                </div>
              ) : ticketDetail?.status === 'RESOLVED' ? (
                <div className="p-4 border-t border-gray-100 bg-emerald-50 text-emerald-800 text-center flex items-center justify-center gap-2 text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>This ticket is resolved. You can submit a reply to automatically reopen it.</span>
                  <button
                    onClick={() => {
                      setReplyText('Requesting reopen: ')
                      // update status to open is handled on submit
                    }}
                    className="ml-2 underline hover:text-emerald-950 font-bold"
                  >
                    Reopen
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="space-y-3">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto opacity-75" />
              <h4 className="text-sm font-bold text-gray-700">No Ticket Selected</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Select a ticket from the registry list to view the threaded conversation, status logs, and to reply.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-heading text-sm font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-blue" />
                <span>Submit Support Inquiry</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onCreateSubmit)} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website payment portal issue"
                  {...register('subject')}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
                  <select {...register('category')} className={inputCls}>
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Link Project (Optional)</label>
                  <select {...register('clientProjectId')} className={inputCls}>
                    <option value="">No Project Link</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Description / Inquiry Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain your problem or inquiry in detail..."
                  {...register('description')}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Attachment (Optional)</label>
                {createFile ? (
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-150 p-2.5 rounded-xl text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 truncate">
                      <Paperclip className="w-4 h-4 text-brand-blue shrink-0" />
                      <span className="font-semibold truncate">{createFile.name}</span>
                      <span className="text-gray-400">({Math.round(createFile.size / 1024)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreateFile(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition-all">
                    <input
                      type="file"
                      id="create-file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCreateFile(e.target.files[0])
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('create-file-upload').click()}
                      className="flex items-center gap-1.5 text-xs text-brand-blue font-bold hover:underline cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>Choose a file (Image, PDF, Word, Excel, ZIP)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    setShowCreateModal(false)
                    setCreateFile(null)
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || isUploading}
                  className="px-4 py-2 bg-brand-blue text-white rounded-xl hover:bg-blue-600 text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading File...</span>
                    </>
                  ) : (
                    <span>Submit Inquiry</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
