/**
 * clientProjects.controller.js — Admin CRUD for Client Projects
 */
import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'

export const listClientProjects = async (req, res, next) => {
  try {
    const projects = await prisma.clientProject.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: true,
        attachments: {
          orderBy: { createdAt: 'desc' }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    })
    res.json({ status: 'ok', data: projects })
  } catch (err) {
    next(err)
  }
}

export const createClientProject = async (req, res, next) => {
  try {
    const {
      clientName,
      projectTitle,
      description,
      startDate,
      deadline,
      assignedTo,
      budget,
      tags,
      notes,
      status,
      priority,
      progress,
      clientId,
    } = req.body
    if (!clientName || !projectTitle || !startDate || !deadline) {
      return res.status(400).json({
        status: 'error',
        message: 'Client name, project title, start date, and deadline are required.',
      })
    }
    const project = await prisma.clientProject.create({
      data: {
        clientName,
        projectTitle,
        description,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        assignedTo,
        budget,
        tags: tags ?? [],
        notes,
        status: status ?? 'PLANNING',
        priority: priority ?? 'MEDIUM',
        progress: progress ? parseInt(progress) : 0,
        clientId: clientId || null,
      },
      include: {
        tasks: true,
        attachments: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    await logActivity(
      req,
      'CREATE',
      'ClientProject',
      `Created project '${project.projectTitle}' for client '${project.clientName}'`
    )

    res.status(201).json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}

export const updateClientProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.deadline) data.deadline = new Date(data.deadline)
    if (data.progress !== undefined) data.progress = parseInt(data.progress)
    if (data.clientId === '') {
      data.clientId = null
    }

    const project = await prisma.clientProject.update({
      where: { id },
      data,
      include: {
        tasks: true,
        attachments: {
          orderBy: { createdAt: 'desc' }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    await logActivity(
      req,
      'UPDATE',
      'ClientProject',
      `Updated project '${project.projectTitle}' (Progress: ${project.progress}%, Status: ${project.status})`
    )

    res.json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}

export const deleteClientProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await prisma.clientProject.findUnique({ where: { id } })
    if (project) {
      await prisma.clientProject.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      await logActivity(
        req,
        'DELETE',
        'ClientProject',
        `Soft deleted project '${project.projectTitle}' (Client: ${project.clientName})`
      )
    }
    res.json({ status: 'ok', message: 'Client project soft deleted.' })
  } catch (err) {
    next(err)
  }
}
