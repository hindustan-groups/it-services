/**
 * admin.route.js — All admin routes (auth + CRUD)
 * All routes except login/logout require verifyToken + requireRole
 */
import { Router } from 'express'
import { body } from 'express-validator'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { authLimiter, validateRequest } from '../middleware/security.js'
import { adminLogin, adminLogout, getMe, getDashboardStats, changePassword, changeEmail } from '../controllers/admin.controller.js'
import { getLeads, updateLeadStatus, deleteLead } from '../controllers/leads.controller.js'
import { listServices, createService, updateService, deleteService } from '../controllers/adminServices.controller.js'
import { listProjects, createProject, updateProject, deleteProject } from '../controllers/adminProjects.controller.js'
import { listTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/adminTeam.controller.js'
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonials.controller.js'
import {
  listFaqs, createFaq, updateFaq, deleteFaq,
  updateSettings, getMilestones, createMilestone, updateMilestone, deleteMilestone,
  listPartners, createPartner, updatePartner, deletePartner,
} from '../controllers/content.controller.js'
import {
  listJobPostings, createJobPosting, updateJobPosting, deleteJobPosting,
  listApplications, updateApplicationStatus, deleteApplication
} from '../controllers/adminCareers.controller.js'
import { listLegalPages, updateLegalPage } from '../controllers/legal.controller.js'

const router = Router()

// ── Auth ───────────────────────────────────────────────────────
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 6 }),
], validateRequest, adminLogin)

router.post('/logout', adminLogout)
router.get('/me', verifyToken, getMe)
router.post('/change-password', verifyToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('Min 8 characters required'),
], validateRequest, changePassword)

router.post('/change-email', verifyToken, [
  body('newEmail').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
], validateRequest, changeEmail)

// ── Dashboard stats ────────────────────────────────────────────
router.get('/stats', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), getDashboardStats)

// ── Leads ──────────────────────────────────────────────────────
router.get('/leads', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), getLeads)
router.patch('/leads/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateLeadStatus)
router.delete('/leads/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteLead)

// ── Services ───────────────────────────────────────────────────
router.get('/services', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listServices)
router.post('/services', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createService)
router.patch('/services/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateService)
router.delete('/services/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteService)

// ── Projects ───────────────────────────────────────────────────
router.get('/projects', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listProjects)
router.post('/projects', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createProject)
router.patch('/projects/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateProject)
router.delete('/projects/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteProject)

// ── Team ───────────────────────────────────────────────────────
router.get('/team', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listTeam)
router.post('/team', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createTeamMember)
router.patch('/team/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateTeamMember)
router.delete('/team/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteTeamMember)

// ── Testimonials ───────────────────────────────────────────────
router.get('/testimonials', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listTestimonials)
router.post('/testimonials', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createTestimonial)
router.patch('/testimonials/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateTestimonial)
router.delete('/testimonials/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteTestimonial)

// ── FAQs ───────────────────────────────────────────────────────
router.get('/faqs', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listFaqs)
router.post('/faqs', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createFaq)
router.patch('/faqs/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateFaq)
router.delete('/faqs/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteFaq)

// ── Site Settings ──────────────────────────────────────────────
router.patch('/settings', verifyToken, requireRole('SUPER_ADMIN'), updateSettings)

// ── Legal Pages ────────────────────────────────────────────────
router.get('/legal', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listLegalPages)
router.put('/legal/:pageType', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateLegalPage)

// ── Milestones ─────────────────────────────────────────────────
router.get('/milestones', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), getMilestones)
router.post('/milestones', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createMilestone)
router.patch('/milestones/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateMilestone)
router.delete('/milestones/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteMilestone)

// ── Partners ───────────────────────────────────────────────────
router.get('/partners', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listPartners)
router.post('/partners', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createPartner)
router.patch('/partners/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updatePartner)
router.delete('/partners/:id', verifyToken, requireRole('SUPER_ADMIN'), deletePartner)

// ── Careers ────────────────────────────────────────────────────
router.get('/careers', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listJobPostings)
router.post('/careers', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), createJobPosting)
router.patch('/careers/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateJobPosting)
router.delete('/careers/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteJobPosting)

router.get('/applications', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listApplications)
router.patch('/applications/:id/status', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), updateApplicationStatus)
router.delete('/applications/:id', verifyToken, requireRole('SUPER_ADMIN'), deleteApplication)

export default router
