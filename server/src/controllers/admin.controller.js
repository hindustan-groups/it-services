/**
 * admin.controller.js — Admin auth + dashboard stats
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../config/db.js'
import { env } from '../config/env.js'

// ── POST /api/admin/login ──────────────────────────────────────
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN || '7d' },
    )

    // httpOnly cookie — not accessible from JS
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return res.json({
      status: 'ok',
      data: { id: admin.id, email: admin.email, role: admin.role },
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/admin/logout ─────────────────────────────────────
export const adminLogout = (_req, res) => {
  res.clearCookie('adminToken', { httpOnly: true, sameSite: 'strict' })
  return res.json({ status: 'ok', message: 'Logged out.' })
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

// ── GET /api/admin/stats ───────────────────────────────────────
export const getDashboardStats = async (_req, res, next) => {
  try {
    const [totalLeads, newLeads, totalProjects, totalServices, totalTeam] =
      await Promise.all([
        prisma.contactLead.count(),
        prisma.contactLead.count({ where: { status: 'NEW' } }),
        prisma.project.count(),
        prisma.service.count({ where: { isActive: true } }),
        prisma.teamMember.count(),
      ])

    res.json({
      status: 'ok',
      data: { totalLeads, newLeads, totalProjects, totalServices, totalTeam },
    })
  } catch (err) {
    next(err)
  }
}
