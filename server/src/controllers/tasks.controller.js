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
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: tasks })
  } catch (err) {
    next(err)
  }
}

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, clientProjectId, tags } =
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
        creatorId: req.admin.id,
        assignedToAdminId,
      },
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
