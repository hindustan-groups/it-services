/**
 * Admin Login Page — JWT httpOnly cookie auth
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { api } from '@/utils/api'
import { SEO } from '@/components/ui'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/login', data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Admin Login" noIndex />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="font-heading text-2xl font-bold">
              <span className="text-brand-red">Hindustan </span>
              <span className="text-brand-blue">Projects</span>
            </span>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h1 className="font-heading text-xl font-bold text-brand-blue mb-6">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors
                    ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="admin@hindustanprojects.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none
                      focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors pr-10
                      ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                      hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* API error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50
                  border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-medium
                  py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60
                  disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
