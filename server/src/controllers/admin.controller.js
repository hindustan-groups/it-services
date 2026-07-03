import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import prisma from '../config/db.js'
import { env } from '../config/env.js'
import { setAdminCookie, setAdminRefreshTokenCookie, clearAdminCookies, clearAdminCookie } from '../utils/authCookie.js'
import { verifyMasterKey, resolveMasterKey } from '../utils/masterKey.js'
import { sendEmail } from '../utils/mailer.js'

// Helper to generate access and refresh tokens
const generateTokens = async (admin) => {
  const accessToken = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    env.JWT_SECRET,
    { expiresIn: '2h' } // Access token valid for 2 hours
  )
  
  const refreshToken = jwt.sign(
    { id: admin.id },
    env.JWT_SECRET,
    { expiresIn: '7d' } // Refresh token valid for 7 days
  )

  // Save refresh token to database
  await prisma.admin.update({
    where: { id: admin.id },
    data: { refreshToken }
  })

  return { accessToken, refreshToken }
}

// ── POST /api/admin/login ──────────────────────────────────────
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' })
    }

    // Check account lockout status
    if (admin.lockoutUntil && new Date() < new Date(admin.lockoutUntil)) {
      const waitTime = Math.ceil((new Date(admin.lockoutUntil) - new Date()) / 60000)
      return res.status(423).json({
        status: 'error',
        message: `Account is locked. Please try again in ${waitTime} minute(s).`,
      })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      const attempts = admin.loginAttempts + 1
      let lockoutUntil = null
      let message = 'Invalid credentials.'

      // Log failed attempt details to console/Render logs
      console.warn(
        `[SECURITY_ALERT] FAILED_LOGIN_ATTEMPT | Email: ${email} | IP: ${ip} | Total attempts: ${attempts}`
      )

      if (attempts >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        message = 'Too many failed attempts. Account locked for 15 minutes.'

        // Send lockout notification email (at exactly 5 attempts to avoid spamming on subsequent attempts)
        if (attempts === 5) {
          sendEmail({
            to: admin.email,
            subject: 'Hindustan Projects Admin Account Locked',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #E31E24;">Security Alert: Account Locked</h2>
                <p>Your admin account (<strong>${admin.email}</strong>) has been locked for 15 minutes due to 5 consecutive failed login attempts.</p>
                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                <p>If this was not you, please change your password immediately.</p>
              </div>
            `,
            text: `Security Alert: Admin Account Locked\n\nYour account has been locked for 15 minutes due to 5 consecutive failed login attempts.\nIP Address: ${ip}\nTime: ${new Date().toISOString()}`,
          }).catch((err) => {
            console.error('[mailer] Lockout email failed:', err.message)
          })
        }
      }

      // Send brute-force alert email to admin on 10+ consecutive failed attempts
      if (attempts >= 10) {
        sendEmail({
          to: admin.email,
          subject: 'URGENT: Brute-Force Alert on Admin Login',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #E31E24; border-radius: 8px;">
              <h2 style="color: #E31E24;">Urgent Security Alert: Brute Force Detected</h2>
              <p>The IP address <strong>${ip}</strong> has failed admin login 10+ times on account <strong>${admin.email}</strong>.</p>
              <p><strong>Consecutive failed attempts:</strong> ${attempts}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              <p>Please check backend console logs and consider blocking this IP address at your hosting-level firewall.</p>
            </div>
          `,
          text: `Urgent Security Alert: Brute Force Detected\n\nThe IP address ${ip} has failed admin login 10+ times on account ${admin.email}.\nConsecutive attempts: ${attempts}\nTime: ${new Date().toISOString()}`,
        }).catch((err) => {
          console.error('[mailer] Brute-force email alert failed:', err.message)
        })

        console.warn(
          `[SECURITY_ALERT] BRUTE_FORCE_ALERT_SENT | Email: ${email} | IP: ${ip} | Total attempts: ${attempts}`
        )
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: { loginAttempts: attempts, lockoutUntil },
      })

      return res.status(401).json({ status: 'error', message })
    }

    // Reset login attempts on successful credentials
    await prisma.admin.update({
      where: { id: admin.id },
      data: { loginAttempts: 0, lockoutUntil: null }
    })

    // Audit log successful login & notify
    try {
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          adminEmail: admin.email,
          action: 'LOGIN_ATTEMPT',
          entity: 'Admin',
          details: `Successful credentials check from IP ${ip}`,
        }
      })

      sendEmail({
        to: admin.email,
        subject: 'New Admin Login Detected - Hindustan Projects',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2>Security Notice: Successful Login</h2>
            <p>A new login was recorded for your admin account: <strong>${admin.email}</strong>.</p>
            <p><strong>IP Address:</strong> ${ip}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p>If this was you, no action is needed. Otherwise, please contact support immediately.</p>
          </div>
        `,
        text: `Security Notice: Successful Login\n\nA new login was recorded for admin: ${admin.email}\nIP Address: ${ip}\nTime: ${new Date().toISOString()}`
      }).catch((err) => {
        console.error('[audit/mailer] Login notification failed:', err.message)
      })

    // Check if 2FA is enabled
    if (admin.twoFactorEnabled) {
      // Return a short-lived temp token (valid for 5 minutes)
      const tempToken = jwt.sign(
        { id: admin.id, temp: true },
        env.JWT_SECRET,
        { expiresIn: '5m' }
      )
      return res.json({
        status: '2fa_required',
        tempToken,
      })
    }

    // Normal login (2FA not enabled)
    const { accessToken, refreshToken } = await generateTokens(admin)
    setAdminCookie(res, accessToken)
    setAdminRefreshTokenCookie(res, refreshToken)

    return res.json({
      status: 'ok',
      data: { id: admin.id, email: admin.email, role: admin.role },
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/logout ─────────────────────────────────────
export const adminLogout = async (req, res, next) => {
  try {
    // If we have admin from verifyToken, clear their active refresh token from DB
    if (req.admin?.id) {
      await prisma.admin.update({
        where: { id: req.admin.id },
        data: { refreshToken: null }
      }).catch(() => {})
    }
    clearAdminCookies(res)
    return res.json({ status: 'ok', message: 'Logged out.' })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/refresh-token ──────────────────────────────
export const adminRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.adminRefreshToken
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Refresh token required' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired refresh token' })
    }

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } })
    if (!admin || admin.refreshToken !== token) {
      return res.status(401).json({ status: 'error', message: 'Token revoked or invalid' })
    }

    // Rotate tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(admin)
    setAdminCookie(res, accessToken)
    setAdminRefreshTokenCookie(res, newRefreshToken)

    return res.json({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/2fa/setup ──────────────────────────────────
export const setup2FA = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
    if (!admin) {
      return res.status(404).json({ status: 'error', message: 'Admin not found' })
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Hindustan Projects (${admin.email})`
    })

    // Save secret temporarily in DB (but keep twoFactorEnabled = false until verified)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { twoFactorSecret: secret.base32 }
    })

    // Generate QR code Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url)

    return res.json({
      status: 'ok',
      data: {
        secret: secret.base32,
        qrCode: qrCodeDataUrl
      }
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/2fa/verify ─────────────────────────────────
export const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body
    if (!token) {
      return res.status(400).json({ status: 'error', message: 'Verification code required' })
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
    if (!admin || !admin.twoFactorSecret) {
      return res.status(400).json({ status: 'error', message: '2FA setup has not been initiated' })
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1 // 30-sec tolerance window
    })

    if (!verified) {
      return res.status(400).json({ status: 'error', message: 'Invalid verification code' })
    }

    // Enable 2FA
    await prisma.admin.update({
      where: { id: admin.id },
      data: { twoFactorEnabled: true }
    })

    return res.json({ status: 'ok', message: 'Two-Factor Authentication enabled successfully' })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/2fa/login ──────────────────────────────────
export const login2FA = async (req, res, next) => {
  try {
    const { tempToken, code } = req.body
    if (!tempToken || !code) {
      return res.status(400).json({ status: 'error', message: 'Token and verification code required' })
    }

    let decoded
    try {
      decoded = jwt.verify(tempToken, env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Temporary session expired. Please log in again.' })
    }

    if (!decoded.temp) {
      return res.status(401).json({ status: 'error', message: 'Invalid session state' })
    }

    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } })
    if (!admin || !admin.twoFactorSecret) {
      return res.status(401).json({ status: 'error', message: 'Invalid admin account state' })
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1
    })

    if (!verified) {
      return res.status(401).json({ status: 'error', message: 'Invalid verification code' })
    }

    // Set full cookies
    const { accessToken, refreshToken } = await generateTokens(admin)
    setAdminCookie(res, accessToken)
    setAdminRefreshTokenCookie(res, refreshToken)

    return res.json({
      status: 'ok',
      data: { id: admin.id, email: admin.email, role: admin.role },
    })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/admin/me ──────────────────────────────────────────
export const getMe = (req, res) => {
  res.json({ status: 'ok', data: req.admin })
}

// ── POST /api/admin/change-password ───────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
    if (!admin) return res.status(404).json({ status: 'error', message: 'Admin not found.' })

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect.' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } })

    res.json({ status: 'ok', message: 'Password updated successfully.' })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/change-email ──────────────────────────────
export const changeEmail = async (req, res, next) => {
  try {
    const { newEmail, password } = req.body
    const admin = await prisma.admin.findUnique({ where: { id: req.admin.id } })
    if (!admin) return res.status(404).json({ status: 'error', message: 'Admin not found.' })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Incorrect password.' })
    }

    // Check if new email is already in use by another admin
    const existing = await prisma.admin.findUnique({ where: { email: newEmail } })
    if (existing && existing.id !== admin.id) {
      return res.status(400).json({ status: 'error', message: 'Email is already in use.' })
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: { email: newEmail },
    })

    // Generate new JWT token and update cookie
    const token = jwt.sign(
      { id: updatedAdmin.id, email: updatedAdmin.email, role: updatedAdmin.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN || '7d' }
    )

    setAdminCookie(res, token)

    res.json({
      status: 'ok',
      message: 'Email updated successfully.',
      data: { id: updatedAdmin.id, email: updatedAdmin.email, role: updatedAdmin.role },
    })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/admin/master-key-hint ───────────────────────────
// Returns the current master key for display in Account Settings.
// Full key is returned (SUPER_ADMIN only, requires valid JWT cookie).
export const getMasterKeyHint = async (req, res, next) => {
  try {
    const currentMaster = await resolveMasterKey()
    const dbRow = await prisma.siteSetting.findUnique({
      where: { key: 'sys_integration_master_key' },
    })

    res.json({
      status: 'ok',
      key: currentMaster || null,
      source: dbRow?.value ? 'database' : 'env',
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/change-master-key ────────────────────────
export const changeMasterKey = async (req, res, next) => {
  try {
    const { currentKey, newKey } = req.body

    if (!newKey || typeof newKey !== 'string' || newKey.trim().length < 8) {
      return res
        .status(400)
        .json({ status: 'error', message: 'New key must be at least 8 characters.' })
    }

    const { match, masterKey } = await verifyMasterKey(currentKey)

    if (!masterKey) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Master key not configured on server.' })
    }

    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Current master key is incorrect.' })
    }

    // Save new key to DB and update process.env
    await prisma.siteSetting.upsert({
      where: { key: 'sys_integration_master_key' },
      update: { value: newKey.trim() },
      create: { key: 'sys_integration_master_key', value: newKey.trim() },
    })
    process.env.INTEGRATION_MASTER_KEY = newKey.trim()

    res.json({ status: 'ok', message: 'Integration master key updated successfully.' })
  } catch (err) {
    next(err)
  }
}
export const getDashboardStats = async (_req, res, next) => {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      closedLeads,
      totalProjects,
      totalServices,
      totalTeam,
      totalApplications,
      openPositions,
      clientProjects,
      workTasks,
    ] = await Promise.all([
      prisma.contactLead.count(),
      prisma.contactLead.count({ where: { status: 'NEW' } }),
      prisma.contactLead.count({ where: { status: 'CONTACTED' } }),
      prisma.contactLead.count({ where: { status: 'CLOSED' } }),
      prisma.project.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.teamMember.count(),
      prisma.jobApplication.count(),
      prisma.jobPosting.count({ where: { isActive: true } }),
      prisma.clientProject.findMany(),
      prisma.workTask.findMany(),
    ])

    const activeProjectsCount = clientProjects.filter((p) => p.status !== 'COMPLETED').length
    const now = new Date()
    const overdueProjectsCount = clientProjects.filter(
      (p) => p.status !== 'COMPLETED' && new Date(p.deadline) < now
    ).length

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    const dueTodayTasksCount = workTasks.filter((t) => {
      if (!t.dueDate || t.status === 'DONE') return false
      const d = new Date(t.dueDate)
      return d >= todayStart && d <= todayEnd
    }).length

    res.json({
      status: 'ok',
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        closedLeads,
        totalProjects,
        totalServices,
        totalTeam,
        totalApplications,
        openPositions,
        activeProjectsCount,
        overdueProjectsCount,
        dueTodayTasksCount,
        totalClientProjectsCount: clientProjects.length,
      },
    })
  } catch (err) {
    next(err)
  }
}
