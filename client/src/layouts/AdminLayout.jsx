/**
 * AdminLayout — Sidebar + content shell for all admin pages.
 * Checks auth on mount — redirects to /admin/login if no session.
 */
import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Briefcase, FolderKanban,
  Users, LogOut, Menu, X, ChevronRight, Settings, Star,
  HelpCircle, Flag, Handshake, SlidersHorizontal,
} from 'lucide-react'
import { api } from '@/utils/api'

const NAV = [
  { to: '/admin/dashboard',     icon: LayoutDashboard,    label: 'Dashboard' },
  { to: '/admin/leads',         icon: MessageSquare,      label: 'Leads' },
  { to: '/admin/services',      icon: Briefcase,          label: 'Services' },
  { to: '/admin/projects',      icon: FolderKanban,       label: 'Projects' },
  { to: '/admin/team',          icon: Users,              label: 'Team' },
  { to: '/admin/testimonials',  icon: Star,               label: 'Testimonials' },
  { to: '/admin/faqs',          icon: HelpCircle,         label: 'FAQs' },
  { to: '/admin/milestones',    icon: Flag,               label: 'Milestones' },
  { to: '/admin/partners',      icon: Handshake,          label: 'Partners' },
  { to: '/admin/site-settings', icon: SlidersHorizontal,  label: 'Site Settings' },
  { to: '/admin/settings',      icon: Settings,           label: 'Account' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    api.get('/admin/me')
      .then(r => setAdmin(r.data))
      .catch(() => navigate('/admin/login', { replace: true }))
  }, [navigate])

  const handleLogout = async () => {
    await api.post('/admin/logout', {})
    navigate('/admin/login', { replace: true })
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-brand-blue flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <span className="font-heading font-bold text-base">
            <span className="text-brand-red">HP</span>
            <span className="text-white"> Admin</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-0.5 px-3 overflow-y-auto" aria-label="Admin navigation">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3 shrink-0">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-white/50 truncate">{admin.email}</p>
            <p className="text-xs text-white/30">{admin.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm
              font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center
          justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500">
            <span className="font-medium text-brand-blue">Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center
              justify-center text-white font-bold text-xs">
              {admin.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
