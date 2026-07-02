/**
 * contact.controller.js
 *
 * POST /api/contact
 *   1. Honeypot check (spam bots fill hidden fields)
 *   2. reCAPTCHA v3 token verification (skip in dev if secret not set)
 *   3. Save lead to ContactLead table
 *   4. Send admin notification email
 *   5. Send auto-reply to user
 */

import prisma from '../config/db.js'
import { env } from '../config/env.js'
import { sendEmail, adminNotificationTemplate, autoReplyTemplate } from '../utils/mailer.js'

/**
 * Verify Google reCAPTCHA v3 token.
 * Returns true if score >= threshold (0.5).
 * Returns true unconditionally in dev when secret key is not configured.
 */
async function verifyRecaptcha(token) {
  if (!env.RECAPTCHA_SECRET_KEY) {
    // Dev mode: skip reCAPTCHA verification
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification in dev.')
    return true
  }

  const params = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY,
    response: token,
  })

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?${params.toString()}`,
    { method: 'POST' },
  )

  if (!response.ok) {
    throw new Error('reCAPTCHA verification request failed')
  }

  const data = await response.json()
  // reCAPTCHA v3 returns a score 0.0–1.0; >= 0.5 = likely human
  return data.success && data.score >= 0.5
}

/**
 * POST /api/contact
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message, serviceInterested, recaptchaToken, _hp } = req.body

    // ── 1. Honeypot check ──────────────────────────────────────
    // `_hp` is a hidden field. Bots fill it; real users leave it blank.
    if (_hp) {
      // Silently accept but do nothing (don't tell bot it was blocked)
      return res.status(200).json({
        status: 'ok',
        message: 'Your message has been received. We will be in touch shortly.',
      })
    }

    // ── 2. reCAPTCHA v3 verification ──────────────────────────
    if (!recaptchaToken) {
      return res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA token is required.',
      })
    }

    const isHuman = await verifyRecaptcha(recaptchaToken)
    if (!isHuman) {
      return res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA verification failed. Please try again.',
      })
    }

    // ── Check for recent submission (24 hour lock) ─────────────────
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existingLead = await prisma.contactLead.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        createdAt: { gte: oneDayAgo },
      },
    })

    if (existingLead) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already submitted an inquiry in the last 24 hours. Please wait before sending another message.',
      })
    }

    // ── 3. Save lead to database ───────────────────────────────
    const lead = await prisma.contactLead.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
        serviceInterested: serviceInterested?.trim() || null,
        status: 'NEW',
      },
    })

    // ── 4 & 5. Send emails (non-blocking — don't fail the request if email fails) ──
    const adminEmail = adminNotificationTemplate({ name, email, phone, message, serviceInterested })
    const userReply = autoReplyTemplate({ name })

    const emailTarget = env.EMAIL_FROM
      ? env.EMAIL_FROM.replace(/.*<(.+)>/, '$1')
      : env.EMAIL_USER

    // Fire-and-forget with error logging
    Promise.all([
      emailTarget
        ? sendEmail({ to: emailTarget, ...adminEmail }).catch((err) =>
            console.error('[mailer] Admin notification failed:', err.message),
          )
        : Promise.resolve(),
      sendEmail({ to: email, ...userReply }).catch((err) =>
        console.error('[mailer] Auto-reply failed:', err.message),
      ),
    ])

    return res.status(201).json({
      status: 'ok',
      message: 'Your message has been received. We will be in touch shortly.',
      data: { id: lead.id },
    })
  } catch (err) {
    next(err)
  }
}
