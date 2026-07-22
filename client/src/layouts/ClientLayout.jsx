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
  MessageSquare,
  CreditCard,
  FileText,
  HelpCircle,
  CheckCircle2,
  Bell,
} from 'lucide-react'
import { useState } from 'react'
import { useClientMe, useClientLogout, useClientTickets } from '@/hooks/useClientPortal'
import { ClientMobileNavBar } from '@/components/ui'

export default function ClientLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const { data: client, isLoading, isError } = useClientMe()
  const logoutMutation = useClientLogout()
  const { data: tickets = [] } = useClientTickets()

  useEffect(() => {
    if (client?.name) {
      localStorage.setItem('hp_client_name', client.name)
    }
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

  const unreadTicketsCount = Array.isArray(tickets) ? tickets.filter((t) => t.clientHasUnread).length : 0

  const navigation = [
    { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/client/support', label: 'Support Desk', icon: MessageSquare, badge: unreadTicketsCount },
    { to: '/client/billing', label: 'Billing & Payments', icon: CreditCard },
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
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white shrink-0 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Portal Rules & Terms Section */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-1">
          <button
            onClick={() => setShowTermsModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>Portal Terms & SLA Rules</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
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

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => window.location.href = '/client/support'}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
              title={unreadTicketsCount > 0 ? `${unreadTicketsCount} unread ticket update(s)` : 'No new notifications'}
            >
              <Bell className={`w-4 h-4 ${unreadTicketsCount > 0 ? 'text-brand-red animate-pulse' : 'text-gray-400'}`} />
              {unreadTicketsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center animate-bounce">
                  {unreadTicketsCount > 9 ? '9+' : unreadTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowTermsModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-brand-blue" />
              <span>SLA Rules &amp; Terms</span>
            </button>
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

      {/* Client Portal SLA Rules & Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-brand-blue rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-gray-900">
                    Client Portal SLA Rules & Terms
                  </h3>
                  <p className="text-xs text-gray-400">
                    Hindustan Projects official client engagement guidelines & policies
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-brand-blue flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                  1. Service Level Agreement (SLA) & Support SLA
                </h4>
                <p className="text-xs text-gray-600">
                  Support Desk tickets submitted via the portal receive a initial technical response within <strong>2 to 4 business hours</strong>. Urgent production issues are assigned directly to dedicated project leads.
                </p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-emerald-800 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  2. Intellectual Property (IP) & Source Code Transfer
                </h4>
                <p className="text-xs text-gray-600">
                  Full ownership rights, custom source code zips, and Figma assets are transferred into your <strong>Project File Vault</strong> immediately upon 100% completion of milestone payments.
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-amber-800 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  3. Milestone Billing & GST Tax Invoice Compliance
                </h4>
                <p className="text-xs text-gray-600">
                  All billing milestones are subject to standard 18% GST itemized billing. Official verified tax receipts with GSTIN <strong>08AAACH9929P1Z5</strong> can be printed or saved as PDF directly from the Billing tab.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-purple-900 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  4. Project Asset Upload Guidelines
                </h4>
                <p className="text-xs text-gray-600">
                  Clients can upload project logos, Figma references, and zip files up to 10MB per file into their File Vault. All uploaded assets are securely stored and encrypted in Cloudinary CDN.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
