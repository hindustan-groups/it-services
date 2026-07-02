/**
 * Admin Login Page — Premium branded login screen (light theme)
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle, Mail, Lock, ShieldCheck } from 'lucide-react'
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
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Admin Login" noIndex />
      <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)' }}>

        {/* ── Left panel — Brand ── */}
        <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(175deg, #1A3E8C 0%, #0f2660 100%)' }}>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

          {/* Glow orbs */}
          <div className="absolute top-20 left-10 w-48 h-48 bg-brand-red/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <img src="/apple-touch-icon.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-white/20" />
            <div>
              <p className="font-heading font-bold text-white text-base">Hindustan Projects</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>

          {/* Center content */}
          <div className="relative space-y-6">
            <div>
              <h2 className="text-white font-heading text-3xl font-bold leading-tight mb-3" style={{ color: '#fff' }}>
                Manage Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                  Digital Presence
                </span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Update services, projects, team, leads and site settings — all in one place.
              </p>
            </div>

            {/* Feature bullets */}
            <div className="space-y-3">
              {[
                'Manage services & portfolio projects',
                'Track and respond to client leads',
                'Update team, FAQs & testimonials',
              ].map(text => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red/30 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  </div>
                  <p className="text-white/60 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative">
            <p className="text-white/25 text-xs">© 2025 Hindustan Projects, Bhilwara</p>
          </div>
        </div>

        {/* ── Right panel — Form ── */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2.5 mb-2">
                <img src="/apple-touch-icon.png" alt="Logo" className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5 border border-white/20"
                  style={{ background: 'linear-gradient(135deg, #1A3E8C, #0f2660)' }} />
                <span className="font-heading font-bold text-xl text-brand-blue">Hindustan Projects</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/60 p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/8 border border-brand-blue/15 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="text-xs font-semibold text-brand-blue">Secure Admin Access</span>
                </div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-sm text-gray-500 mt-1">Sign in to your admin dashboard</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      autoComplete="email"
                      className={`w-full pl-9 pr-3.5 py-3 text-sm border rounded-xl focus:outline-none
                        focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all
                        ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="admin@hindustanprojects.com"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`w-full pl-9 pr-10 py-3 text-sm border rounded-xl focus:outline-none
                        focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all
                        ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password.message}
                    </p>
                  )}
                </div>

                {/* API error */}
                {error && (
                  <div className="flex items-center gap-2.5 text-sm text-red-700 bg-red-50
                    border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-semibold py-3 rounded-xl text-sm
                    transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    hover:shadow-lg hover:shadow-brand-blue/25 hover:-translate-y-0.5 active:translate-y-0 mt-2"
                  style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1A3E8C 0%, #2d5fd6 100%)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : 'Sign In to Dashboard'}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                <p className="text-xs text-gray-400">Secured with JWT authentication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
