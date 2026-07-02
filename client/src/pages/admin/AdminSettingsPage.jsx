/**
 * Admin Settings — Change email and password
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, Eye, EyeOff, Lock, ShieldAlert, KeyRound, Mail } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const emailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required to confirm changes'),
})

function PasswordInput({ label, name, register, error, show, onToggle }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 block mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          {...register(name)}
          className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white
            focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue
            transition-all ${error ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error.message}</p>}
    </div>
  )
}

function EmailForm({ currentEmail, onEmailUpdated }) {
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = async (data) => {
    setStatus(null)
    try {
      const res = await api.post('/admin/change-email', {
        newEmail: data.newEmail,
        password: data.password,
      })
      setStatus('success')
      setMsg(res.message || 'Email updated successfully.')
      reset()
      if (onEmailUpdated) {
        onEmailUpdated(res.data)
      }
    } catch (err) {
      setStatus('error')
      setMsg(err.message || 'Failed to update email.')
    }
  }

  return (
    <div className="bg-white border border-blue-100 border-l-4 border-l-brand-blue rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
          <Mail className="w-3.5 h-3.5 text-brand-blue" />
        </div>
        <h2 className="font-heading text-base font-semibold text-gray-800">Change Account Email</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">New Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              {...register('newEmail')}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue
                transition-all ${errors.newEmail ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
              placeholder="e.g. newadmin@hindustanprojects.com"
            />
          </div>
          {errors.newEmail && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.newEmail.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">Current Password (to confirm)</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue
                transition-all ${errors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {isSubmitting ? 'Updating…' : 'Update Email Address'}
        </button>
      </form>
    </div>
  )
}

function PasswordForm() {
  const [show, setShow] = useState({ curr: false, new: false, conf: false })
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (data) => {
    setStatus(null)
    try {
      const res = await api.post('/admin/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setStatus('success')
      setMsg(res.message || 'Password updated successfully.')
      reset()
    } catch (err) {
      setStatus('error')
      setMsg(err.message || 'Failed to update password.')
    }
  }

  return (
    <div className="bg-white border border-blue-100 border-l-4 border-l-brand-blue rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 text-brand-blue" />
        </div>
        <h2 className="font-heading text-base font-semibold text-gray-800">Change Password</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          label="Current Password"
          name="currentPassword"
          register={register}
          error={errors.currentPassword}
          show={show.curr}
          onToggle={() => setShow(s => ({ ...s, curr: !s.curr }))}
        />
        <PasswordInput
          label="New Password (min 8 characters)"
          name="newPassword"
          register={register}
          error={errors.newPassword}
          show={show.new}
          onToggle={() => setShow(s => ({ ...s, new: !s.new }))}
        />
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          show={show.conf}
          onToggle={() => setShow(s => ({ ...s, conf: !s.conf }))}
        />

        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {isSubmitting ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { admin, setAdmin } = useOutletContext()

  return (
    <>
      <SEO title="Settings" noIndex />
      <div className="space-y-6 max-w-lg">

        {/* Page Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your admin account and security.</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/70 flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-bold text-lg">
                {admin?.email ? admin.email[0].toUpperCase() : 'A'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{admin?.email || 'Admin'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Administrator · Hindustan Projects</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-xs px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Change Email Form */}
        <EmailForm currentEmail={admin?.email} onEmailUpdated={(updatedData) => setAdmin(updatedData)} />

        {/* Change Password Form */}
        <PasswordForm />

        {/* Security reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Security Reminder</h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              Use a strong, unique password. Never share your admin credentials.
              If you suspect unauthorized access, change your password immediately.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
