/**
 * ClientLayout.jsx — Protected layout wrapper for Client Portal
 */
import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useClientMe, useClientLogout } from '@/hooks/useClientPortal'
import { ClientMobileNavBar } from '@/components/ui'

export default function ClientLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: client, isLoading, isError } = useClientMe()
  const logoutMutation = useClientLogout()

  useEffect(() => {
    if (!isLoading && (isError || !client)) {
      navigate('/client-login', { replace: true })
    }
  }, [client, isLoading, isError, navigate])

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      navigate('/client-login', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading Client Portal…</p>
        </div>
      </div>
    )
  }

  if (!client) return null

  const navigation = [
    { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-full
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex`}
        style={{ background: 'linear-gradient(175deg, #1A3E8C 0%, #0f2660 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="/logo-with-bg.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <p className="font-heading font-bold text-white text-sm leading-none">Hindustan</p>
              <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">
                Client Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-red rounded-full" />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-250 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-heading text-lg font-bold text-gray-900">
              Welcome, {client.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authorized Client</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24 lg:pb-8 scrollbar-thin">
          <Outlet />
        </main>
        <ClientMobileNavBar />
      </div>
    </div>
  )
}
