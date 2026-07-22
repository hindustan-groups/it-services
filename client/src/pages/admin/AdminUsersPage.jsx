/**
 * AdminUsersPage — Super Admin management for Admin, Staff and Client accounts
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  UserPlus,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Power,
  Trash2,
  Lock,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Copy,
  ExternalLink,
  Link2,
  Send,
  Check,
  FolderLock,
  ChevronRight,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const inputCls =
  'w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all'

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Tab State
  const [activeTab, setActiveTab] = useState('internal') // 'internal' | 'clients'

  // Create User Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STAFF')
  const [showPassword, setShowPassword] = useState(false)

  // Create Client Form State
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientProjectIds, setClientProjectIds] = useState([])

  // Link Projects Modal State for Existing Client
  const [linkingClient, setLinkingClient] = useState(null)
  const [linkedProjectsSelection, setLinkedProjectsSelection] = useState([])

  // Reset Password State
  const [resetUserId, setResetUserId] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Copy Link Feedback State
  const [copiedToken, setCopiedToken] = useState(null)

  // Feedback notifications
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')

  const clearAlert = () => {
    setStatus(null)
    setMsg('')
  }

  // Fetch Users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    enabled: activeTab === 'internal',
  })

  // Fetch Client Portal accounts
  const { data: clients = [], isLoading: isClientsLoading, isError: isClientsError } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: () => api.get('/admin/clients').then((r) => r.data),
    enabled: activeTab === 'clients',
  })

  // Fetch System Projects
  const { data: systemProjects = [] } = useQuery({
    queryKey: ['admin-system-projects'],
    queryFn: () => api.get('/admin/projects').then((r) => r.data),
  })

  // Create User Mutation
  const createMutation = useMutation({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setStatus('success')
      setMsg(res.message || 'Staff account created successfully and credentials emailed!')
      setShowAddForm(false)
      setEmail('')
      setPassword('')
      setRole('STAFF')
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to create user account.')
    },
    mutationFn: (newUser) => api.post('/admin/users', newUser),
  })

  // Create Client Mutation
  const createClientMutation = useMutation({
    mutationFn: (newClient) => api.post('/admin/clients', newClient),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      setStatus('success')
      setMsg('Client Portal account created successfully and invitation email sent!')
      setShowAddForm(false)
      setClientName('')
      setClientEmail('')
      setClientProjectIds([])
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to create client account.')
    },
  })

  // Update User Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => api.patch(`/admin/users/${id}`, updates),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setStatus('success')
      setMsg(res.message || 'User account updated successfully!')
      setResetUserId(null)
      setNewPassword('')
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to update user account.')
    },
  })

  // Update Client Mutation (Links projects, status changes, resend invite)
  const updateClientMutation = useMutation({
    mutationFn: ({ id, updates }) => api.patch(`/admin/clients/${id}`, updates),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      setStatus('success')
      setMsg(res.message || 'Client account updated successfully!')
      setLinkingClient(null)
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to update client account.')
    },
  })

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setStatus('success')
      setMsg(res.message || 'User account deleted.')
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to delete user account.')
    },
  })

  // Delete Client Mutation
  const deleteClientMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/clients/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      setStatus('success')
      setMsg('Client account deleted successfully.')
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.response?.data?.message || err.message || 'Failed to delete client account.')
    },
  })

  const handleCreateUser = (e) => {
    e.preventDefault()
    clearAlert()
    if (!email || !password || !role) {
      setStatus('error')
      setMsg('All fields are required.')
      return
    }
    createMutation.mutate({ email, password, role })
  }

  const handleCreateClient = (e) => {
    e.preventDefault()
    clearAlert()
    if (!clientName || !clientEmail) {
      setStatus('error')
      setMsg('Name and email are required.')
      return
    }
    createClientMutation.mutate({
      name: clientName,
      email: clientEmail,
      projectIds: clientProjectIds,
    })
  }

  const handleToggleActive = (user) => {
    clearAlert()
    updateMutation.mutate({
      id: user.id,
      updates: { isActive: !user.isActive },
    })
  }

  const handleToggleClientActive = (client) => {
    clearAlert()
    updateClientMutation.mutate({
      id: client.id,
      updates: { isActive: !client.isActive },
    })
  }

  const handleResendClientInvite = (client) => {
    clearAlert()
    updateClientMutation.mutate({
      id: client.id,
      updates: { resendInvite: true },
    })
  }

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault()
    clearAlert()
    if (!newPassword || newPassword.length < 8) {
      setStatus('error')
      setMsg('Password must be at least 8 characters long.')
      return
    }
    updateMutation.mutate({
      id: resetUserId,
      updates: { password: newPassword },
    })
  }

  const handleDeleteUser = (user) => {
    if (confirm(`Are you sure you want to permanently delete account ${user.email}? This action cannot be undone.`)) {
      clearAlert()
      deleteMutation.mutate(user.id)
    }
  }

  const handleDeleteClient = (client) => {
    if (confirm(`Are you sure you want to permanently delete client account ${client.name} (${client.email})? This action cannot be undone.`)) {
      clearAlert()
      deleteClientMutation.mutate(client.id)
    }
  }

  const handleOpenLinkProjects = (client) => {
    setLinkingClient(client)
    setLinkedProjectsSelection(client.projects ? client.projects.map((p) => p.id) : [])
  }

  const handleSaveLinkedProjects = () => {
    if (!linkingClient) return
    clearAlert()
    updateClientMutation.mutate({
      id: linkingClient.id,
      updates: { projectIds: linkedProjectsSelection },
    })
  }

  const handleCopyLink = (token) => {
    const clientUrl = window.location.origin
    const setupUrl = `${clientUrl}/client/setup-password?token=${token}`
    navigator.clipboard.writeText(setupUrl)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <>
      <SEO title="User Management" noIndex />
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                User Access Center
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure administrative credentials and secure client portal spaces.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              clearAlert()
              setShowAddForm(!showAddForm)
              setResetUserId(null)
            }}
            className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            {activeTab === 'internal' ? 'Create Staff User' : 'Register Client'}
          </button>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex gap-1.5 bg-gray-150 p-1.5 rounded-2xl w-fit border border-gray-200">
            <button
              onClick={() => {
                setActiveTab('internal')
                setShowAddForm(false)
                clearAlert()
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'internal'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admins & Staff
            </button>
            <button
              onClick={() => {
                setActiveTab('clients')
                setShowAddForm(false)
                clearAlert()
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'clients'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Client Portal
            </button>
          </div>

          {/* Search/Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === 'internal' ? "Search staff by email..." : "Search clients by name or email..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
              />
            </div>

            {activeTab === 'internal' && (
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                >
                  <option value="ALL">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Global Feedback Status Alert */}
        {status && (
          <div
            className={`flex items-start gap-3 text-sm rounded-xl px-5 py-4 border ${
              status === 'success'
                ? 'text-green-800 bg-green-50/50 border-green-200'
                : 'text-red-700 bg-red-50/50 border-red-200'
            } animate-fade-in`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-bold">{status === 'success' ? 'Task Completed' : 'Operation Failed'}</p>
              <p className="mt-0.5 text-gray-650">{msg}</p>
            </div>
            <button onClick={clearAlert} className="text-gray-400 hover:text-gray-600 font-bold px-1 text-lg">×</button>
          </div>
        )}

        {/* Add Staff Form */}
        {showAddForm && activeTab === 'internal' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-down">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-blue" />
                Add Internal Team Account
              </h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-650 text-sm font-semibold">Cancel</button>
            </div>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5 font-sans">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@hindustanprojects.in"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5 font-sans">Initial Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={inputCls}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5 font-sans">Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                >
                  <option value="STAFF">Staff (Work management only)</option>
                  <option value="ADMIN">Admin (Full content & leads access)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? 'Sending credentials...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Client Form */}
        {showAddForm && activeTab === 'clients' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-down">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-blue" />
                Add Client Portal Account
              </h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-650 text-sm font-semibold">Cancel</button>
            </div>
            <p className="text-xs text-gray-500">
              An invitation email containing a secure setup link will be automatically dispatched.
            </p>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5 font-sans">Client Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5 font-sans">Client Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. rajesh@company.com"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Link initial project selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">Link Initial Projects (Optional)</label>
                {systemProjects.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No system projects created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-150 rounded-xl max-h-32 overflow-y-auto">
                    {systemProjects.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={clientProjectIds.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClientProjectIds([...clientProjectIds, p.id])
                            } else {
                              setClientProjectIds(clientProjectIds.filter(id => id !== p.id))
                            }
                          }}
                          className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        />
                        <span className="text-xs font-semibold text-gray-800 truncate">{p.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={createClientMutation.isPending}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {createClientMutation.isPending ? 'Sending Invite...' : 'Create & Send Invite'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reset Password Card */}
        {resetUserId && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-down">
            <h2 className="font-heading text-base font-bold text-amber-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-700" />
              Reset Account Password
            </h2>
            <form onSubmit={handlePasswordResetSubmit} className="max-w-md space-y-4">
              <div>
                <label className="text-xs font-semibold text-amber-900 block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter secure new password (min 8 chars)"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Password & Notify'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetUserId(null)
                    setNewPassword('')
                  }}
                  className="border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Link Projects Inline Form Overlay/Card */}
        {linkingClient && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 shadow-sm space-y-4 animate-slide-down">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100">
              <h2 className="font-heading text-base font-bold text-blue-950 flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-blue-700" />
                Manage Projects for: <span className="underline">{linkingClient.name}</span>
              </h2>
              <button
                onClick={() => setLinkingClient(null)}
                className="text-blue-500 hover:text-blue-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-blue-800">
              Check/uncheck projects to link them to this client's portal dashboard space.
            </p>

            {systemProjects.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No system projects created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {systemProjects.map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 p-3 bg-white border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors shadow-sm">
                    <input
                      type="checkbox"
                      checked={linkedProjectsSelection.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLinkedProjectsSelection([...linkedProjectsSelection, p.id])
                        } else {
                          setLinkedProjectsSelection(linkedProjectsSelection.filter(id => id !== p.id))
                        }
                      }}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue w-4 h-4"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-800 block truncate">{p.title}</span>
                      <span className="text-[10px] text-gray-400 block truncate uppercase tracking-wider">{p.category}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveLinkedProjects}
                disabled={updateClientMutation.isPending}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {updateClientMutation.isPending ? 'Saving...' : 'Save Linked Projects'}
              </button>
              <button
                onClick={() => setLinkingClient(null)}
                className="border border-gray-300 hover:bg-gray-150 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── INTERNAL USERS TABLE ── */}
        {activeTab === 'internal' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading Team accounts...</p>
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 text-sm font-semibold">Failed to load internal user accounts.</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">No team accounts found matching filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-450 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Team Member</th>
                      <th className="px-6 py-4">System Access</th>
                      <th className="px-6 py-4">Security (2FA)</th>
                      <th className="px-6 py-4">Account Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => {
                      const isSuper = u.role === 'SUPER_ADMIN'
                      return (
                        <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-brand-blue/15">
                                {u.email[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{u.email}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Created {new Date(u.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                isSuper
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : u.role === 'ADMIN'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {isSuper ? 'Super Admin' : u.role === 'ADMIN' ? 'Admin' : 'Staff'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-xs font-medium">
                            {u.twoFactorEnabled ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 shrink-0" /> Secured
                              </span>
                            ) : (
                              <span className="text-gray-400 flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 shrink-0" /> Unsecured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4.5">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                                u.isActive ? 'text-green-600' : 'text-red-500'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500 ring-4 ring-green-100' : 'bg-red-400'}`} />
                              {u.isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Active status */}
                              {!isSuper && (
                                <button
                                  onClick={() => handleToggleActive(u)}
                                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                    u.isActive
                                      ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100'
                                      : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                                  }`}
                                  title={u.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}

                              {/* Reset Password trigger */}
                              <button
                                onClick={() => {
                                  clearAlert()
                                  setResetUserId(u.id)
                                  setShowAddForm(false)
                                  setLinkingClient(null)
                                }}
                                className="p-2 border border-gray-200 hover:bg-gray-150 text-gray-500 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
                                title="Reset Password"
                              >
                                <Lock className="w-4 h-4" />
                              </button>

                              {/* Delete User */}
                              {!isSuper && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-2 border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTS TABLE ── */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {isClientsLoading ? (
              <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Loading clients...</p>
              </div>
            ) : isClientsError ? (
              <div className="p-12 text-center text-red-500 text-sm font-semibold">Failed to load client accounts.</div>
            ) : filteredClients.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <UserCheck className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-600">No client portal spaces yet.</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Click "Register Client" to set up client access and link project workspaces.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-450 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Client Detail</th>
                      <th className="px-6 py-4">Linked Projects</th>
                      <th className="px-6 py-4">Access Setup</th>
                      <th className="px-6 py-4">Portal Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredClients.map((c) => {
                      const isPending = !c.passwordHash
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-emerald-100">
                                {c.name[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                                <p className="text-xs text-gray-450 truncate">{c.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5">
                            {c.projects && c.projects.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {c.projects.map((p) => (
                                  <span key={p.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    {p.projectTitle}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic font-medium">No linked workspaces</span>
                            )}
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              !isPending
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${!isPending ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                              {!isPending ? 'Setup Complete' : 'Invite Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                                c.isActive ? 'text-green-600' : 'text-red-500'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-green-500 ring-4 ring-green-100' : 'bg-red-400'}`} />
                              {c.isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Copy Invite Link (Only for pending accounts) */}
                              {isPending && c.inviteToken && (
                                <button
                                  onClick={() => handleCopyLink(c.inviteToken)}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    copiedToken === c.inviteToken
                                      ? 'border-green-300 bg-green-50 text-green-600'
                                      : 'border-gray-250 hover:bg-gray-150 text-gray-500 hover:text-gray-700'
                                  }`}
                                  title="Copy Password Setup URL"
                                >
                                  {copiedToken === c.inviteToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              )}

                              {/* Resend Invite Email */}
                              {isPending && (
                                <button
                                  onClick={() => handleResendClientInvite(c)}
                                  className="p-2 border border-gray-200 hover:bg-gray-150 text-brand-blue hover:text-brand-blue-hover rounded-lg transition-colors cursor-pointer"
                                  title="Resend Invite Email"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}

                              {/* Edit/Link Projects */}
                              <button
                                onClick={() => handleOpenLinkProjects(c)}
                                className="p-2 border border-gray-200 hover:bg-gray-150 text-gray-500 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
                                title="Link Projects"
                              >
                                <Link2 className="w-4 h-4" />
                              </button>

                              {/* Toggle Client Active status */}
                              <button
                                onClick={() => handleToggleClientActive(c)}
                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                                  c.isActive
                                    ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100'
                                    : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                                title={c.isActive ? 'Deactivate Client' : 'Reactivate Client'}
                              >
                                <Power className="w-4 h-4" />
                              </button>

                              {/* Delete Client */}
                              <button
                                onClick={() => handleDeleteClient(c)}
                                className="p-2 border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Client Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
