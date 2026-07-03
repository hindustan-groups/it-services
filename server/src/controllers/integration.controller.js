/**
 * integration.controller.js
 *
 * Manages third-party integration credentials (Cloudinary, SMTP, reCAPTCHA,
 * Database URL, JWT Secret) stored securely in the SiteSetting table with
 * a "sys_" prefix.
 *
 * Keys stored:
 *   sys_cloudinary_cloud_name, sys_cloudinary_api_key, sys_cloudinary_api_secret
 *   sys_smtp_host, sys_smtp_port, sys_smtp_user, sys_smtp_pass, sys_smtp_from
 *   sys_recaptcha_secret_key
 *   sys_database_url
 *   sys_jwt_secret
 *
 * On GET  — sensitive values are MASKED (last 4 chars visible)
 * On SAVE — values stored in DB AND applied to process.env immediately
 *           Database URL change triggers Prisma client reconnect
 */

import prisma from '../config/db.js'
import { env } from '../config/env.js'
import { timingSafeEqual } from 'crypto'
import { verifyMasterKey } from '../utils/masterKey.js'

// Keys that must be masked in GET responses
const MASKED_KEYS = new Set([
  'sys_cloudinary_api_secret',
  'sys_smtp_pass',
  'sys_recaptcha_secret_key',
  'sys_database_url',
  'sys_jwt_secret',
  'sys_resend_api_key',
])

// Maps DB keys → process.env variable names
const ENV_MAP = {
  sys_cloudinary_cloud_name: 'CLOUDINARY_CLOUD_NAME',
  sys_cloudinary_api_key: 'CLOUDINARY_API_KEY',
  sys_cloudinary_api_secret: 'CLOUDINARY_API_SECRET',
  sys_smtp_host: 'EMAIL_HOST',
  sys_smtp_port: 'EMAIL_PORT',
  sys_smtp_user: 'EMAIL_USER',
  sys_smtp_pass: 'EMAIL_PASS',
  sys_smtp_from: 'EMAIL_FROM',
  sys_recaptcha_secret_key: 'RECAPTCHA_SECRET_KEY',
  sys_database_url: 'DATABASE_URL',
  sys_jwt_secret: 'JWT_SECRET',
  sys_resend_api_key: 'RESEND_API_KEY',
}

// All integration keys we manage
const ALL_KEYS = Object.keys(ENV_MAP)

/**
 * GET /api/admin/integrations
 * Returns current integration config — sensitive fields masked.
 */
export const getIntegrationConfig = async (_req, res, next) => {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ALL_KEYS } },
    })

    // Build response object, masking secrets
    const config = {}
    for (const key of ALL_KEYS) {
      const row = rows.find((r) => r.key === key)
      const value = row?.value || ''

      if (MASKED_KEYS.has(key) && value) {
        // Show last 4 chars only: ••••••••xxxx
        config[key] = `${'•'.repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`
      } else {
        config[key] = value
      }
    }

    // Also expose which services are currently active (have credentials)
    config._status = {
      cloudinary: !!(
        config.sys_cloudinary_cloud_name &&
        config.sys_cloudinary_api_key &&
        rows.find((r) => r.key === 'sys_cloudinary_api_secret')?.value
      ),
      smtp: !!(config.sys_smtp_user && rows.find((r) => r.key === 'sys_smtp_pass')?.value),
      resend: !!rows.find((r) => r.key === 'sys_resend_api_key')?.value,
      recaptcha: !!rows.find((r) => r.key === 'sys_recaptcha_secret_key')?.value,
      database: !!rows.find((r) => r.key === 'sys_database_url')?.value,
      jwt: !!rows.find((r) => r.key === 'sys_jwt_secret')?.value,
    }

    res.json({ status: 'ok', data: config })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/admin/integrations
 * Save integration keys to DB and immediately apply to process.env.
 * Blank values are IGNORED (keeps existing secret).
 * Send "__CLEAR__" to explicitly delete a value.
 */
export const updateIntegrationConfig = async (req, res, next) => {
  try {
    const updates = req.body

    const opsToRun = []

    for (const [key, rawValue] of Object.entries(updates)) {
      // Only allow known integration keys
      if (!ALL_KEYS.includes(key)) continue

      const value = typeof rawValue === 'string' ? rawValue.trim() : ''

      if (value === '__CLEAR__') {
        // Explicit clear — delete from DB and unset env
        opsToRun.push(prisma.siteSetting.deleteMany({ where: { key } }).catch(() => {}))
        delete process.env[ENV_MAP[key]]
        continue
      }

      // Skip empty — don't overwrite existing secret with blank
      if (value === '') continue

      // For masked fields, skip if value looks like our masking pattern (user didn't change it)
      if (MASKED_KEYS.has(key) && /^•+/.test(value)) continue

      // Upsert to DB
      opsToRun.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )

      // Apply to running process immediately
      process.env[ENV_MAP[key]] = value

      // Special: SMTP port needs to be numeric
      if (key === 'sys_smtp_port') {
        process.env.EMAIL_PORT = String(parseInt(value, 10) || 587)
      }
    }

    await Promise.all(opsToRun)

    // Reconfigure Cloudinary SDK if cloud keys were updated
    const cloudinaryKeys = [
      'sys_cloudinary_cloud_name',
      'sys_cloudinary_api_key',
      'sys_cloudinary_api_secret',
    ]
    const cloudinaryUpdated = Object.keys(updates).some((k) => cloudinaryKeys.includes(k))
    if (cloudinaryUpdated) {
      try {
        const { cloudinary } = await import('../utils/cloudinary.js')
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })
      } catch (e) {
        console.warn('[integrations] Could not re-init Cloudinary:', e.message)
      }
    }

    // Reconnect Prisma if DATABASE_URL was changed
    if (
      updates.sys_database_url &&
      typeof updates.sys_database_url === 'string' &&
      updates.sys_database_url.trim() !== '' &&
      !/^•+/.test(updates.sys_database_url.trim())
    ) {
      try {
        await prisma.$disconnect()
        await prisma.$connect()
        console.log('[integrations] Prisma reconnected with new DATABASE_URL.')
      } catch (e) {
        console.warn('[integrations] Prisma reconnect failed:', e.message)
      }
    }

    res.json({ status: 'ok', message: 'Integration settings saved and applied.' })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/admin/integrations/test-smtp
 * Send a test email to the currently configured SMTP address.
 */
export const testSmtpConnection = async (req, res, next) => {
  try {
    const { sendEmail } = await import('../utils/mailer.js')

    // Determine which strategy is active
    const usingResend = !!process.env.RESEND_API_KEY
    const usingSmtp = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)

    if (!usingResend && !usingSmtp) {
      return res.status(400).json({
        status: 'error',
        message: 'No email provider configured. Set RESEND_API_KEY or EMAIL_USER + EMAIL_PASS.',
      })
    }

    const targetEmail =
      process.env.EMAIL_USER || (process.env.EMAIL_FROM || '').replace(/.*<(.+)>/, '$1')

    if (!targetEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'Set EMAIL_USER (or EMAIL_FROM) so the test email has a destination.',
      })
    }

    await sendEmail({
      to: targetEmail,
      subject: 'Test Email — Hindustan Projects Admin',
      html: `<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e5e7eb;border-radius:8px;max-width:500px">
        <h2 style="color:#1A3E8C;margin:0 0 12px">✅ Email Test Successful</h2>
        <p style="color:#374151">Your email configuration is working correctly.</p>
        <p style="color:#6B7280;font-size:13px">Provider: <strong>${usingResend ? 'Resend' : 'SMTP/Nodemailer'}</strong></p>
        <p style="color:#6B7280;font-size:13px;margin-top:20px;border-top:1px solid #f3f4f6;padding-top:12px">
          Sent from Hindustan Projects Admin Panel
        </p>
      </div>`,
      text: 'Email Test Successful — Your email configuration is working.',
    })

    res.json({
      status: 'ok',
      message: `Test email sent to ${targetEmail} via ${usingResend ? 'Resend' : 'SMTP'}.`,
    })
  } catch (err) {
    // Sanitize error — never forward raw provider errors (may contain credentials)
    const safeMsg = err.message?.includes('Invalid login')
      ? 'Authentication failed. Check your email credentials.'
      : err.message?.includes('ECONNREFUSED') || err.message?.includes('ETIMEDOUT')
        ? 'Could not connect to email server. Check HOST and PORT settings.'
        : 'Email test failed. Check your configuration and try again.'
    res.status(500).json({ status: 'error', message: safeMsg })
  }
}

/**
 * POST /api/admin/integrations/test-cloudinary
 * Verify Cloudinary credentials by making a lightweight API call.
 */
export const testCloudinaryConnection = async (req, res, next) => {
  try {
    const { cloudinary } = await import('../utils/cloudinary.js')

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Cloudinary credentials are not configured.',
      })
    }

    // Lightweight ping — fetches usage stats (doesn't upload anything)
    await cloudinary.api.ping()

    res.json({ status: 'ok', message: 'Cloudinary connection verified successfully.' })
  } catch (err) {
    // Sanitize — never leak API keys from error messages
    const safeMsg =
      err.message?.includes('401') || err.message?.includes('Invalid')
        ? 'Authentication failed. Check your Cloudinary API Key and Secret.'
        : 'Cloudinary connection failed. Verify your credentials and try again.'
    res.status(500).json({ status: 'error', message: safeMsg })
  }
}

/**
 * POST /api/admin/integrations/test-database
 * Verify current DATABASE_URL by running a lightweight query.
 */
export const testDatabaseConnection = async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', message: 'Database connection verified successfully.' })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Database test failed: ${err.message}`,
    })
  }
}

/**
 * POST /api/admin/integrations/verify-key
 * Verifies the Integration Master Key before unlocking the page.
 * Returns a short-lived session token stored in sessionStorage on the client.
 *
 * If INTEGRATION_MASTER_KEY is not set in .env, falls back to the JWT_SECRET
 * last 8 chars — so it always works.
 */
export const verifyIntegrationKey = async (req, res, next) => {
  try {
    const { key } = req.body

    if (!key || typeof key !== 'string' || key.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'Key is required.' })
    }

    const { match, masterKey } = await verifyMasterKey(key)

    if (!masterKey) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Master key not configured on server.' })
    }

    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Incorrect key. Access denied.' })
    }

    // Issue a short-lived unlock token (15 min) signed with JWT_SECRET
    // Client stores it in sessionStorage — clears on tab/browser close
    const { default: jwt } = await import('jsonwebtoken')
    const unlockToken = jwt.sign(
      { purpose: 'integration_unlock', adminId: req.admin.id },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    res.json({ status: 'ok', unlockToken })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/admin/integrations/check-unlock
 * Validates an unlock token. Called on page load to auto-unlock if token is still valid.
 */
export const checkUnlockToken = async (req, res, next) => {
  try {
    const { token } = req.query
    if (!token) return res.json({ status: 'ok', valid: false })

    const { default: jwt } = await import('jsonwebtoken')
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)
      if (decoded.purpose !== 'integration_unlock') throw new Error('Invalid purpose')
      res.json({ status: 'ok', valid: true })
    } catch {
      res.json({ status: 'ok', valid: false })
    }
  } catch (err) {
    next(err)
  }
}
