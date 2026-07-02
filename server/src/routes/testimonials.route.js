import { Router } from 'express'
import { getTestimonials } from '../controllers/testimonials.controller.js'

const router = Router()

// GET /api/testimonials — public
router.get('/', getTestimonials)

export default router
