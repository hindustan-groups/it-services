import { Router } from 'express'
import {
  listSocialDrafts,
  updateSocialDraftStatus,
  deleteSocialDraft,
} from '../controllers/social.controller.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

// All routes require authentication & admin role check
router.use(verifyToken)
router.use(requireRole('ADMIN', 'SUPER_ADMIN'))

router.get('/drafts', listSocialDrafts)
router.patch('/drafts/:id', updateSocialDraftStatus)
router.delete('/drafts/:id', deleteSocialDraft)

export default router
