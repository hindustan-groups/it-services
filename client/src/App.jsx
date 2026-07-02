import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import AdminLayout from '@/layouts/AdminLayout'
import GlobalClickRipple from '@/components/ui/GlobalClickRipple'

// Public pages
import HomePage from '@/pages/HomePage'
import ServicesPage from '@/pages/ServicesPage'
import ServiceDetailPage from '@/pages/ServiceDetailPage'
import AboutPage from '@/pages/AboutPage'
import PortfolioPage from '@/pages/PortfolioPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'
import CareersPage from '@/pages/CareersPage'
import JobDetailPage from '@/pages/JobDetailPage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import TermsOfServicePage from '@/pages/TermsOfServicePage'
import RefundPolicyPage from '@/pages/RefundPolicyPage'

// Admin pages — lazy loaded
const AdminLoginPage    = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminLeadsPage    = lazy(() => import('@/pages/admin/AdminLeadsPage'))
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'))
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjectsPage'))
const AdminTeamPage     = lazy(() => import('@/pages/admin/AdminTeamPage'))
const AdminSettingsPage     = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminTestimonialsPage = lazy(() => import('@/pages/admin/AdminTestimonialsPage'))
const AdminFaqPage          = lazy(() => import('@/pages/admin/AdminFaqPage'))
const AdminSiteSettingsPage = lazy(() => import('@/pages/admin/AdminSiteSettingsPage'))
const AdminMilestonesPage   = lazy(() => import('@/pages/admin/AdminMilestonesPage'))
const AdminPartnersPage     = lazy(() => import('@/pages/admin/AdminPartnersPage'))
const AdminHelpPage         = lazy(() => import('@/pages/admin/AdminHelpPage'))
const AdminCareersPage      = lazy(() => import('@/pages/admin/AdminCareersPage'))
const AdminLegalPage        = lazy(() => import('@/pages/admin/AdminLegalPage'))

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <GlobalClickRipple />
      <Routes>
      {/* ── Public site ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ── Admin ── */}
      <Route path="/admin/login" element={
        <Suspense fallback={<AdminFallback />}>
          <AdminLoginPage />
        </Suspense>
      } />
      <Route path="/admin" element={
        <Suspense fallback={<AdminFallback />}>
          <AdminLayout />
        </Suspense>
      }>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="leads"     element={<AdminLeadsPage />} />
        <Route path="services"  element={<AdminServicesPage />} />
        <Route path="projects"  element={<AdminProjectsPage />} />
        <Route path="team"      element={<AdminTeamPage />} />
        <Route path="settings"      element={<AdminSettingsPage />} />
        <Route path="testimonials"  element={<AdminTestimonialsPage />} />
        <Route path="faqs"          element={<AdminFaqPage />} />
        <Route path="site-settings" element={<AdminSiteSettingsPage />} />
        <Route path="milestones"    element={<AdminMilestonesPage />} />
        <Route path="partners"      element={<AdminPartnersPage />} />
        <Route path="careers"       element={<AdminCareersPage />} />
        <Route path="legal"         element={<AdminLegalPage />} />
        <Route path="help"          element={<AdminHelpPage />} />
        <Route index element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  </>
)
}

