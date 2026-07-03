/**
 * admin.controller.js — Admin auth + dashboard stats
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../config/db.js'
import { env } from '../config/env.js'
import { setAdminCookie, clearAdminCookie } from '../utils/authCookie.js'
import { verifyMasterKey, resolveMasterKey } from '../utils/masterKey.js'

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

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || '7d',
    })

    // httpOnly cookie — not accessible from JS
    setAdminCookie(res, token)

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
  clearAdminCookie(res)
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
