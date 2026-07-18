/**
 * client.route.js — Client Portal API Routes
 */
import { Router } from 'express'
import {
  clientLogin,
  getClientProfile,
  setupClientPassword,
  clientLogout,
} from '../controllers/clientAuth.controller.js'
import {
  getClientProjects,
  getClientProjectById,
} from '../controllers/clientPortal.controller.js'
import {
  createTicket,
  listClientTickets,
  getClientTicketById,
  replyToTicketFromClient,
} from '../controllers/tickets.controller.js'
import {
  listClientMilestones,
  simulatePayment,
} from '../controllers/billing.controller.js'
import { verifyClientToken } from '../middleware/auth.js'

const router = Router()

// Public Auth routes
router.post('/login', clientLogin)
router.post('/setup-password', setupClientPassword)
router.post('/logout', clientLogout)

// Protected Portal routes
router.get('/me', verifyClientToken, getClientProfile)
router.get('/projects', verifyClientToken, getClientProjects)
router.get('/projects/:id', verifyClientToken, getClientProjectById)

// Support Tickets routes
router.get('/tickets', verifyClientToken, listClientTickets)
router.post('/tickets', verifyClientToken, createTicket)
router.get('/tickets/:id', verifyClientToken, getClientTicketById)
router.post('/tickets/:id/messages', verifyClientToken, replyToTicketFromClient)

// Billing / Milestones routes
router.get('/billing', verifyClientToken, listClientMilestones)
router.post('/billing/:id/pay', verifyClientToken, simulatePayment)

export default router
