/**
 * contact.route.js
 *
 * POST /api/contact — public, rate-limited, validated
 */

import { Router } from 'express'
import { body } from 'express-validator'
import { contactLimiter, validateRequest } from '../middleware/security.js'
import { submitContact } from '../controllers/contact.controller.js'

const router = Router()

// ── Input validation rules ─────────────────────────────────────
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+\d\s\-().]{7,20}$/)
    .withMessage('Please provide a valid phone number.'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters.')
    .escape(),

  body('serviceInterested')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Service name too long.')
    .escape(),

  body('recaptchaToken').notEmpty().withMessage('reCAPTCHA token is required.'),

  // Honeypot field — must be empty (bots fill it)
  body('_hp').optional().isLength({ max: 0 }).withMessage('Invalid submission.'),
]

// ── POST /api/contact ──────────────────────────────────────────
router.post('/', contactLimiter, contactValidation, validateRequest, submitContact)

export default router
