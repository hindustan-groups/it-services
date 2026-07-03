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
    if (data.dueDate) data.dueDate = new Date(data.dueDate)

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
    if (task) {
      await prisma.workTask.delete({ where: { id } })
      await logActivity(req, 'DELETE', 'WorkTask', `Deleted task '${task.title}'`)
    }
    res.json({ status: 'ok', message: 'Task deleted.' })
  } catch (err) {
    next(err)
  }
}
