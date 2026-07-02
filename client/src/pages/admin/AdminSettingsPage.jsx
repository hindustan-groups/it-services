/**
 * Admin Settings — Change password
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function PasswordInput({ label, name, register, error, show, onToggle }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          {...register(name)}
          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg pr-10
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue
            transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [show, setShow] = useState({ curr: false, new: false, conf: false })
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [msg, setMsg] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
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
    <>
      <SEO title="Settings" noIndex />
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your admin account.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-semibold text-gray-800 mb-5">
            Change Password
          </h2>

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
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50
                border border-green-200 rounded-lg px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {msg}
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50
                border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white
                font-medium py-2.5 rounded-lg text-sm transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Admin info card */}
        <div className="bg-brand-blue/4 border border-brand-blue/15 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-brand-blue mb-2">Default Credentials</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Default login: <strong>admin@hindustanprojects.com</strong> / <strong>ChangeMe@123</strong><br />
            Change your password immediately after first login.
          </p>
        </div>
      </div>
    </>
  )
}
