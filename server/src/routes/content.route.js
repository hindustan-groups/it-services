/**
 * Public content routes — FAQs, Settings, Milestones, Partners
 */
import { Router } from 'express'
import { getFaqs } from '../controllers/content.controller.js'
import { getSettings } from '../controllers/content.controller.js'
import { getMilestones } from '../controllers/content.controller.js'
import { getPartners } from '../controllers/content.controller.js'

const router = Router()

router.get('/faqs', getFaqs)
router.get('/settings', getSettings)
router.get('/milestones', getMilestones)
router.get('/partners', getPartners)

export default router
