import { Router } from 'express'
import { askQuestion, listInquiries, deleteInquiry } from '../controllers/chatbot.controller.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// Public rate-limited endpoint for asking questions
router.post('/ask', askQuestion)

// Admin-only endpoints for managing captured inquiries
router.get('/admin/inquiries', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), listInquiries)
router.delete('/admin/inquiries/:id', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), deleteInquiry)

export default router
