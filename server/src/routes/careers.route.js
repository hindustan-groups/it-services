import { Router } from 'express'
import { body } from 'express-validator'
import {
  getActiveJobs,
  getJobBySlug,
  submitApplication,
} from '../controllers/careers.controller.js'
import { uploadResume } from '../utils/cloudinary.js'
import { validateRequest, contactLimiter } from '../middleware/security.js'

const router = Router()

// GET /api/careers — list all active job postings
router.get('/', getActiveJobs)

// GET /api/careers/:slug — single job posting details
router.get('/:slug', getJobBySlug)

// POST /api/careers/:slug/apply — submit application (validated + rate limited)
router.post(
  '/:slug/apply',
  contactLimiter, // Reuse strict contact submission limiter
  uploadResume.single('resume'),
  [
    body('fullName').notEmpty().trim().withMessage('Full Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
    body('phone').notEmpty().trim().withMessage('Phone number is required'),
    body('coverLetter').optional().trim(),
  ],
  validateRequest,
  submitApplication
)

export default router
