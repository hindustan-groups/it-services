import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import GlobalClickRipple from '@/components/ui/GlobalClickRipple'

// ── Page loading fallback ──────────────────────────────────────
function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-bg-base">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ── Public pages — lazy loaded for code splitting ──────────────
// HomePage is eager-loaded (above the fold, always needed)
import HomePage from '@/pages/HomePage'

const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const CareersPage = lazy(() => import('@/pages/CareersPage'))
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'))
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// ── Admin pages — lazy loaded ──────────────────────────────────
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminLeadsPage = lazy(() => import('@/pages/admin/AdminLeadsPage'))
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage'))
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjectsPage'))
const AdminTeamPage = lazy(() => import('@/pages/admin/AdminTeamPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const AdminTestimonialsPage = lazy(() => import('@/pages/admin/AdminTestimonialsPage'))
const AdminFaqPage = lazy(() => import('@/pages/admin/AdminFaqPage'))
const AdminSiteSettingsPage = lazy(() => import('@/pages/admin/AdminSiteSettingsPage'))
const AdminMilestonesPage = lazy(() => import('@/pages/admin/AdminMilestonesPage'))
const AdminPartnersPage = lazy(() => import('@/pages/admin/AdminPartnersPage'))
const AdminHelpPage = lazy(() => import('@/pages/admin/AdminHelpPage'))
const AdminCareersPage = lazy(() => import('@/pages/admin/AdminCareersPage'))
const AdminLegalPage = lazy(() => import('@/pages/admin/AdminLegalPage'))
const AdminIntegrationPage = lazy(() => import('@/pages/admin/AdminIntegrationPage'))
const AdminBackupPage = lazy(() => import('@/pages/admin/AdminBackupPage'))
const AdminClientProjectsPage = lazy(() => import('@/pages/admin/AdminClientProjectsPage'))
const AdminTasksPage = lazy(() => import('@/pages/admin/AdminTasksPage'))
const AdminNotesPage = lazy(() => import('@/pages/admin/AdminNotesPage'))
const AdminCalendarPage = lazy(() => import('@/pages/admin/AdminCalendarPage'))
const AdminActivitiesPage = lazy(() => import('@/pages/admin/AdminActivitiesPage'))
const AdminMonitoringPage = lazy(() => import('@/pages/admin/AdminMonitoringPage'))

export default function App() {
  return (
    <>
      <GlobalClickRipple />
      <Routes>
        {/* ── Admin ── */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminDashboardPage />
              </Suspense>
            }
          />
          <Route
            path="leads"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminLeadsPage />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminServicesPage />
              </Suspense>
            }
          />
          <Route
            path="projects"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="team"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminTeamPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminSettingsPage />
              </Suspense>
            }
          />
          <Route
            path="testimonials"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminTestimonialsPage />
              </Suspense>
            }
          />
          <Route
            path="faqs"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminFaqPage />
              </Suspense>
            }
          />
          <Route
            path="site-settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminSiteSettingsPage />
              </Suspense>
            }
          />
          <Route
            path="milestones"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminMilestonesPage />
              </Suspense>
            }
          />
          <Route
            path="partners"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminPartnersPage />
              </Suspense>
            }
          />
          <Route
            path="careers"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminCareersPage />
              </Suspense>
            }
          />
          <Route
            path="legal"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminLegalPage />
              </Suspense>
            }
          />
          <Route
            path="integrations"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminIntegrationPage />
              </Suspense>
            }
          />
          <Route
            path="backup"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminBackupPage />
              </Suspense>
            }
          />
          <Route
            path="help"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminHelpPage />
              </Suspense>
            }
          />
          <Route
            path="client-projects"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminClientProjectsPage />
              </Suspense>
            }
          />
          <Route
            path="tasks"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminTasksPage />
              </Suspense>
            }
          />
          <Route
            path="notes"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminNotesPage />
              </Suspense>
            }
          />
          <Route
            path="calendar"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminCalendarPage />
              </Suspense>
            }
          />
          <Route
            path="activities"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminActivitiesPage />
              </Suspense>
            }
          />
          <Route
            path="monitoring"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminMonitoringPage />
              </Suspense>
            }
          />
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminDashboardPage />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/:adminSecret"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* ── Public site ── */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/services"
            element={
              <Suspense fallback={<PageFallback />}>
                <ServicesPage />
              </Suspense>
            }
          />
          <Route
            path="/services/:slug"
            element={
              <Suspense fallback={<PageFallback />}>
                <ServiceDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<PageFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<PageFallback />}>
                <PortfolioPage />
              </Suspense>
            }
          />
          <Route
            path="/careers"
            element={
              <Suspense fallback={<PageFallback />}>
                <CareersPage />
              </Suspense>
            }
          />
          <Route
            path="/careers/:slug"
            element={
              <Suspense fallback={<PageFallback />}>
                <JobDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageFallback />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <Suspense fallback={<PageFallback />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="/terms-of-service"
            element={
              <Suspense fallback={<PageFallback />}>
                <TermsOfServicePage />
              </Suspense>
            }
          />
          <Route
            path="/refund-policy"
            element={
              <Suspense fallback={<PageFallback />}>
                <RefundPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  )
}
