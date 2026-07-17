/**
 * AdminUsersPage — Super Admin management for Admin and Staff accounts
 */
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  UserPlus,
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
  
  // Create User Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STAFF')
  const [showPassword, setShowPassword] = useState(false)

  // Reset Password State
  const [resetUserId, setResetUserId] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

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
  })

  // Create User Mutation
  const createMutation = useMutation({
    mutationFn: (newUser) => api.post('/admin/users', newUser),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setStatus('success')
      setMsg(res.message || 'Account created successfully!')
      setShowAddForm(false)
      setEmail('')
      setPassword('')
      setRole('STAFF')
    },
    onError: (err) => {
      setStatus('error')
      setMsg(err.message || 'Failed to create user account.')
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
      setMsg(err.message || 'Failed to update user account.')
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
      setMsg(err.message || 'Failed to delete user account.')
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

  const handleToggleActive = (user) => {
    clearAlert()
    updateMutation.mutate({
      id: user.id,
      updates: { isActive: !user.isActive },
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

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <>
      <SEO title="User Management" noIndex />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Admins & Staff</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage administrative and employee login credentials.</p>
            </div>
          </div>

          <button
            onClick={() => {
              clearAlert()
              setShowAddForm(!showAddForm)
              setResetUserId(null)
            }}
            className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Global Feedback Status Alert */}
        {status && (
          <div
            className={`flex items-start gap-3 text-sm rounded-xl px-4 py-3 border ${
              status === 'success' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{status === 'success' ? 'Success' : 'Error'}</p>
              <p className="mt-0.5">{msg}</p>
            </div>
            <button onClick={clearAlert} className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1.5 py-0.5">×</button>
          </div>
        )}

        {/* Add User Form Drawer/Card */}
        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-heading text-base font-bold text-gray-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-blue" />
              Create New Admin/Staff Account
            </h2>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. employee@company.com"
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className={inputCls}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                >
                  <option value="STAFF">Staff (Work management only)</option>
                  <option value="ADMIN">Admin (Full content & leads access)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold rounded-xl text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reset Password Card */}
        {resetUserId && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-heading text-base font-bold text-amber-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              Reset Account Password
            </h2>
            <form onSubmit={handlePasswordResetSubmit} className="max-w-md space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password (min 8 chars)"
                    className={inputCls}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Save New Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetUserId(null)
                    setNewPassword('')
                  }}
                  className="border border-amber-300 hover:bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="ADMIN">Admins</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading user accounts...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500 text-sm">Failed to load accounts. Server error.</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No accounts found matching filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Account Details</th>
                    <th className="px-5 py-3.5">System Access Role</th>
                    <th className="px-5 py-3.5">2FA Status</th>
                    <th className="px-5 py-3.5">Account Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredUsers.map((u) => {
                    const isSuper = u.role === 'SUPER_ADMIN'
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {u.email[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{u.email}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Created on {new Date(u.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
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
                        <td className="px-5 py-4 text-xs font-medium text-gray-500">
                          {u.twoFactorEnabled ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> Enabled
                            </span>
                          ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                              <ShieldAlert className="w-4 h-4" /> Disabled
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold ${
                              u.isActive ? 'text-green-600' : 'text-red-500'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-400'}`} />
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Active status */}
                            {!isSuper && (
                              <button
                                onClick={() => handleToggleActive(u)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  u.isActive
                                    ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700'
                                    : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                                }`}
                                title={u.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Reset Password trigger */}
                            <button
                              onClick={() => {
                                clearAlert()
                                setResetUserId(u.id)
                                setShowAddForm(false)
                              }}
                              className="p-1.5 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
                              title="Reset Password"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete User */}
                            {!isSuper && (
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </>
  )
}
