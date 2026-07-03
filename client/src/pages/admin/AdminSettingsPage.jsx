/**
 * AdminSettingsPage — Change email, password, and Integration Master Key
 */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  KeyRound,
  Mail,
  ShieldCheck,
  Info,
  Copy,
  Check,
} from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

// ── Zod schemas ───────────────────────────────────────────────
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'Min 8 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const emailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required to confirm changes'),
})

const masterKeySchema = z
  .object({
    currentKey: z.string().min(1, 'Current key is required'),
    newKey: z.string().min(8, 'New key must be at least 8 characters'),
    confirmKey: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newKey === d.confirmKey, {
    message: 'Keys do not match',
    path: ['confirmKey'],
  })

// ── Shared password input ─────────────────────────────────────
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
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  )
}

// ── Status alert ──────────────────────────────────────────────
function StatusAlert({ status, msg }) {
  if (!status) return null
  const ok = status === 'success'
  return (
    <div
      className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${
        ok ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'
      }`}
    >
      {ok ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {msg}
    </div>
  )
}

// ── Change Email Form ─────────────────────────────────────────
function EmailForm({ currentEmail, onEmailUpdated }) {
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
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
      if (onEmailUpdated) onEmailUpdated(res.data)
    } catch (err) {
      setStatus('error')
      setMsg(err.message || 'Failed to update email.')
    }
  }

  return (
    <div className="bg-white border border-gray-100 border-l-4 border-l-brand-blue rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
          <Mail className="w-3.5 h-3.5 text-brand-blue" />
        </div>
        <h2 className="font-heading text-base font-semibold text-gray-800">Change Account Email</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">
            New Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              {...register('newEmail')}
              placeholder="e.g. newadmin@hindustanprojects.com"
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white
                focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue
                transition-all ${errors.newEmail ? 'border-red-400 bg-red-50/30' : 'border-gray-200'}`}
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
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">
            Current Password (to confirm)
          </label>
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
              onClick={() => setShowPassword((v) => !v)}
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

        <StatusAlert status={status} msg={msg} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm
            hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating…' : 'Update Email Address'}
        </button>
      </form>
    </div>
  )
}

// ── Change Password Form ──────────────────────────────────────
function PasswordForm() {
  const [show, setShow] = useState({ curr: false, new: false, conf: false })
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
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
    <div className="bg-white border border-gray-100 border-l-4 border-l-brand-blue rounded-xl p-6 shadow-sm">
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
          onToggle={() => setShow((s) => ({ ...s, curr: !s.curr }))}
        />
        <PasswordInput
          label="New Password (min 8 characters)"
          name="newPassword"
          register={register}
          error={errors.newPassword}
          show={show.new}
          onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
        />
        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          show={show.conf}
          onToggle={() => setShow((s) => ({ ...s, conf: !s.conf }))}
        />

        <StatusAlert status={status} msg={msg} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-blue text-white font-semibold py-2.5 rounded-xl text-sm
            hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}

// ── Integration Master Key Form ───────────────────────────────
function MasterKeyForm() {
  const [show, setShow] = useState({ curr: false, new: false, conf: false })
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')
  const [keyData, setKeyData] = useState(null) // { key, source }
  const [keyLoading, setKeyLoading] = useState(true)
  const [showCurrentKey, setShowCurrentKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(masterKeySchema),
  })

  const fetchKey = () => {
    setKeyLoading(true)
    api
      .get('/admin/master-key-hint')
      .then((r) => setKeyData(r))
      .catch(() => setKeyData(null))
      .finally(() => setKeyLoading(false))
  }

  useEffect(() => {
    fetchKey()
  }, [])

  const handleCopy = async () => {
    if (!keyData?.key) return
    try {
      await navigator.clipboard.writeText(keyData.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for browsers without clipboard API
      const el = document.createElement('textarea')
      el.value = keyData.key
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const onSubmit = async (data) => {
    setStatus(null)
    try {
      const res = await api.post('/admin/change-master-key', {
        currentKey: data.currentKey,
        newKey: data.newKey,
      })
      setStatus('success')
      setMsg(res.message || 'Integration master key updated successfully.')
      reset()
      fetchKey()
    } catch (err) {
      setStatus('error')
      setMsg(err.message || 'Failed to update master key.')
    }
  }

  return (
    <div className="bg-white border border-orange-100 border-l-4 border-l-orange-400 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
        </div>
        <h2 className="font-heading text-base font-semibold text-gray-800">
          Integration Page Master Key
        </h2>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        This key unlocks the Integration Settings page. It protects your Cloudinary, database, and
        email credentials. Change it regularly and keep it secret.
      </p>

      {/* Current key display */}
      <div className="mb-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-500" />
            <p className="text-xs font-semibold text-orange-800">Current Master Key</p>
          </div>
          <span className="text-[10px] text-orange-500 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
            {keyData?.source === 'database' ? 'Updated via Admin' : 'From .env file'}
          </span>
        </div>

        {keyLoading ? (
          <div className="h-9 bg-orange-100 animate-pulse rounded-lg" />
        ) : keyData?.key ? (
          <div className="flex items-center gap-2">
            <code
              className={`flex-1 text-sm font-mono bg-white border border-orange-200 rounded-lg px-3 py-2
              text-orange-900 tracking-wide select-all break-all leading-relaxed
              ${showCurrentKey ? '' : 'blur-[3px] select-none pointer-events-none'}`}
            >
              {keyData.key}
            </code>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowCurrentKey((v) => !v)}
                className="p-2 rounded-lg bg-white border border-orange-200 text-orange-500
                  hover:bg-orange-100 transition-colors"
                title={showCurrentKey ? 'Hide key' : 'Show key'}
              >
                {showCurrentKey ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white border border-orange-200 text-orange-500
                  hover:bg-orange-100 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-orange-600 italic">No key configured.</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          label="Current Master Key"
          name="currentKey"
          register={register}
          error={errors.currentKey}
          show={show.curr}
          onToggle={() => setShow((s) => ({ ...s, curr: !s.curr }))}
        />
        <PasswordInput
          label="New Master Key (min 8 characters)"
          name="newKey"
          register={register}
          error={errors.newKey}
          show={show.new}
          onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
        />
        <PasswordInput
          label="Confirm New Master Key"
          name="confirmKey"
          register={register}
          error={errors.confirmKey}
          show={show.conf}
          onToggle={() => setShow((s) => ({ ...s, conf: !s.conf }))}
        />

        <StatusAlert status={status} msg={msg} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5
            rounded-xl text-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating…' : 'Update Master Key'}
        </button>
      </form>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const { admin, setAdmin } = useOutletContext()

  return (
    <>
      <SEO title="Account Settings" noIndex />
      <div className="space-y-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your admin account and security.</p>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/70
              flex items-center justify-center shadow-sm shrink-0"
            >
              <span className="text-white font-bold text-lg">
                {admin?.email ? admin.email[0].toUpperCase() : 'A'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{admin?.email || 'Admin'}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {admin?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Administrator'} · Hindustan
                Projects
              </p>
              <span
                className="inline-flex items-center gap-1 mt-1.5 text-xs px-2 py-0.5
                bg-green-50 text-green-700 border border-green-200 rounded-full font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Change Email */}
        <EmailForm
          currentEmail={admin?.email}
          onEmailUpdated={(updatedData) => setAdmin(updatedData)}
        />

        {/* Change Password */}
        <PasswordForm />

        {/* Integration Master Key — only show for SUPER_ADMIN */}
        {admin?.role === 'SUPER_ADMIN' && <MasterKeyForm />}

        {/* Security reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Security Reminder</h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              Use a strong, unique password. Never share your admin credentials. If you suspect
              unauthorized access, change your password immediately.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
