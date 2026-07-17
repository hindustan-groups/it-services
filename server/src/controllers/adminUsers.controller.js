/**
 * adminUsers.controller.js — CRUD for Admin/Staff accounts (SUPER_ADMIN only)
 */
import prisma from '../config/db.js'
import bcrypt from 'bcryptjs'
import { logActivity } from '../utils/activity.js'

export const listAdminUsers = async (req, res, next) => {
  try {
    const users = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: users })
  } catch (err) {
    next(err)
  }
}

export const createAdminUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ status: 'error', message: 'Email, password, and role are required.' })
    }

    if (!['ADMIN', 'STAFF'].includes(role)) {
      return res.status(400).json({ status: 'error', message: 'Role must be ADMIN or STAFF.' })
    }

    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Email is already in use.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.admin.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    await logActivity(req, 'CREATE', 'AdminUser', `Created ${role} account: '${user.email}'`)

    res.status(201).json({ status: 'ok', data: user })
  } catch (err) {
    next(err)
  }
}

export const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role, isActive, password } = req.body

    const existing = await prisma.admin.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    // Prevent Super Admin self-deactivation or self-role change
    if (existing.id === req.admin.id && (isActive === false || role !== existing.role)) {
      return res.status(400).json({ status: 'error', message: 'You cannot deactivate yourself or change your own role.' })
    }

    const data = {}
    if (role !== undefined) {
      if (!['ADMIN', 'STAFF', 'SUPER_ADMIN'].includes(role)) {
        return res.status(400).json({ status: 'error', message: 'Invalid role.' })
      }
      data.role = role
    }
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive)
    }
    if (password && password.trim()) {
      data.passwordHash = await bcrypt.hash(password, 10)
    }

    const user = await prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    await logActivity(
      req,
      'UPDATE',
      'AdminUser',
      `Updated user '${user.email}' (Role: ${user.role}, Active: ${user.isActive})`
    )

    res.json({ status: 'ok', data: user })
  } catch (err) {
    next(err)
  }
}

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const existing = await prisma.admin.findUnique({ where: { id } })
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    if (existing.id === req.admin.id) {
      return res.status(400).json({ status: 'error', message: 'You cannot delete yourself.' })
    }

    if (existing.role === 'SUPER_ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Super Admin accounts cannot be deleted.' })
    }

    await prisma.admin.delete({ where: { id } })
    await logActivity(req, 'DELETE', 'AdminUser', `Deleted user account '${existing.email}'`)

    res.json({ status: 'ok', message: 'User account deleted.' })
  } catch (err) {
    next(err)
  }
}
