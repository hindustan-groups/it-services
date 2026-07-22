/**
 * tasks.controller.js — Admin CRUD for Work Tasks
 */
import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'

export const listTasks = async (req, res, next) => {
  try {
    const { clientProjectId, status } = req.query
    const where = {}
    if (clientProjectId) where.clientProjectId = clientProjectId
    if (status) where.status = status

    if (req.admin.role === 'STAFF') {
      where.OR = [
        { creatorId: req.admin.id },
        { assignedToAdminId: req.admin.id },
        { assignedTo: req.admin.email },
      ]
    }

    const tasks = await prisma.workTask.findMany({
      where,
      include: {
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true, role: true } })
    const adminsMap = new Map(admins.map((a) => [a.id, a]))
    const emailMap = new Map(admins.map((a) => [a.email?.toLowerCase(), a]))

    const formatted = tasks.map((t) => {
      const creator = t.creatorId ? adminsMap.get(t.creatorId) : null
      const assignee = t.assignedToAdminId
        ? adminsMap.get(t.assignedToAdminId)
        : t.assignedTo
        ? emailMap.get(t.assignedTo.toLowerCase())
        : null

      return {
        ...t,
        creatorName: creator?.name || creator?.email || 'System / Admin',
        creatorRole: creator?.role || 'SUPER_ADMIN',
        assigneeName: assignee?.name || assignee?.email || t.assignedTo || 'Unassigned',
        assigneeRole: assignee?.role || 'STAFF',
      }
    })

    res.json({ status: 'ok', data: formatted })
  } catch (err) {
    next(err)
  }
}

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, clientProjectId, tags, estimatedHours, loggedHours, subtasks } =
      req.body
    if (!title) {
      return res.status(400).json({ status: 'error', message: 'Task title is required.' })
    }

    let assignedToAdminId = null
    if (assignedTo && assignedTo.trim()) {
      const targetAdmin = await prisma.admin.findUnique({
        where: { email: assignedTo.trim() },
      })
      if (targetAdmin) {
        assignedToAdminId = targetAdmin.id
      }
    }

    const task = await prisma.workTask.create({
      data: {
        title,
        description,
        status: status ?? 'TODO',
        priority: priority ?? 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        clientProjectId: clientProjectId || null,
        tags: tags ?? [],
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        loggedHours: loggedHours ? parseFloat(loggedHours) : 0,
        subtasks: subtasks || null,
        creatorId: req.admin.id,
        assignedToAdminId,
      },
      include: {
        attachments: true
      }
    })

    await logActivity(req, 'CREATE', 'WorkTask', `Created task '${task.title}'`)

    res.status(201).json({ status: 'ok', data: task })
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }

    const existingTask = await prisma.workTask.findUnique({ where: { id } })
    if (!existingTask) {
      return res.status(404).json({ status: 'error', message: 'Task not found.' })
    }

    // Enforce STAFF permission (must be owner or assignee)
    if (req.admin.role === 'STAFF') {
      const isOwner = existingTask.creatorId === req.admin.id
      const isAssignee =
        existingTask.assignedToAdminId === req.admin.id ||
        existingTask.assignedTo === req.admin.email
      if (!isOwner && !isAssignee) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to modify this task.',
        })
      }
    }

    if (data.dueDate) data.dueDate = new Date(data.dueDate)
    if (data.estimatedHours !== undefined) data.estimatedHours = data.estimatedHours ? parseFloat(data.estimatedHours) : null
    if (data.loggedHours !== undefined) data.loggedHours = data.loggedHours ? parseFloat(data.loggedHours) : 0

    if (data.assignedTo !== undefined) {
      let assignedToAdminId = null
      if (data.assignedTo && data.assignedTo.trim()) {
        const targetAdmin = await prisma.admin.findUnique({
          where: { email: data.assignedTo.trim() },
        })
        if (targetAdmin) {
          assignedToAdminId = targetAdmin.id
        }
      }
      data.assignedToAdminId = assignedToAdminId
    }

    const task = await prisma.workTask.update({
      where: { id },
      data,
      include: {
        attachments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    await logActivity(
      req,
      'UPDATE',
      'WorkTask',
      `Updated task '${task.title}' (Status: ${task.status})`
    )

    res.json({ status: 'ok', data: task })
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await prisma.workTask.findUnique({ where: { id } })
    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found.' })
    }

    // Enforce STAFF permission (only owner can delete)
    if (req.admin.role === 'STAFF') {
      const isOwner = task.creatorId === req.admin.id
      if (!isOwner) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to delete this task.',
        })
      }
    }

    await prisma.workTask.delete({ where: { id } })
    await logActivity(req, 'DELETE', 'WorkTask', `Deleted task '${task.title}'`)
    res.json({ status: 'ok', message: 'Task deleted.' })
  } catch (err) {
    next(err)
  }
}
