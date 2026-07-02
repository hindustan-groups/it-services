/**
 * AdminLayout — Sidebar + content shell for all admin pages.
 * Checks auth on mount — redirects to /admin/login if no session.
 * Theme: Brand-blue sidebar + white content (no dark mode)
 */
import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, Briefcase, FolderKanban,
  Users, LogOut, Menu, X, Settings, Star,
  HelpCircle, Flag, Handshake, SlidersHorizontal, Bell,
  ChevronRight,
} from 'lucide-react'
import { api } from '@/utils/api'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard',     icon: LayoutDashboard,    label: 'Dashboard' },
      { to: '/admin/leads',         icon: MessageSquare,      label: 'Leads',     badge: 'new' },
    ]
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/services',      icon: Briefcase,          label: 'Services' },
      { to: '/admin/projects',      icon: FolderKanban,       label: 'Projects' },
      { to: '/admin/team',          icon: Users,              label: 'Team' },
      { to: '/admin/testimonials',  icon: Star,               label: 'Testimonials' },
      { to: '/admin/faqs',          icon: HelpCircle,         label: 'FAQs' },
      { to: '/admin/milestones',    icon: Flag,               label: 'Milestones' },
      { to: '/admin/partners',      icon: Handshake,          label: 'Partners' },
    ]
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/site-settings', icon: SlidersHorizontal,  label: 'Site Settings' },
      { to: '/admin/settings',      icon: Settings,           label: 'Account' },
    ]
  }
]

const PAGE_TITLES = {
  '/admin/dashboard':    'Dashboard',
  '/admin/leads':        'Leads',
  '/admin/services':     'Services',
  '/admin/projects':     'Projects',
  '/admin/team':         'Team',
  '/admin/testimonials': 'Testimonials',
  '/admin/faqs':         'FAQs',
  '/admin/milestones':   'Milestones',
  '/admin/partners':     'Partners',
  '/admin/site-settings':'Site Settings',
  '/admin/settings':     'Account',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [admin, setAdmin] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentTitle = PAGE_TITLES[location.pathname] || 'Admin'

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading admin panel…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-full
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex`}
        style={{ background: 'linear-gradient(175deg, #1A3E8C 0%, #0f2660 100%)' }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="/apple-touch-icon.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5 border border-white/20" />
            <div>
              <p className="font-heading font-bold text-white text-sm leading-none">Hindustan</p>
              <p className="text-white/40 text-[10px] font-medium tracking-wider uppercase">Projects Admin</p>
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

        {/* ── Nav links ── */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5 scrollbar-thin" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }} aria-label="Admin navigation">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, badge }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 group ${
                        isActive
                          ? 'bg-white/15 text-white shadow-sm'
                          : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-red rounded-full" />
                        )}
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        {badge === 'new' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── User + logout ── */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-red to-orange-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {admin.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 font-medium truncate">{admin.email}</p>
              <p className="text-[10px] text-white/40 truncate">{admin.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm
              font-medium text-white/50 hover:bg-red-500/15 hover:text-red-300 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center
          justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-20 shadow-sm">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-gray-400 hidden sm:inline">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:inline" />
              <span className="font-semibold text-gray-800">{currentTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bell placeholder */}
            <button className="relative w-9 h-9 rounded-lg flex items-center justify-center
              hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-4.5 h-4.5" />
            </button>
            {/* View site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-blue
                bg-brand-blue/8 hover:bg-brand-blue/15 border border-brand-blue/20
                px-3 py-1.5 rounded-lg transition-colors"
            >
              View Site →
            </a>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-[#0f2660]
              flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
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
