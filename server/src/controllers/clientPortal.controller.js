/**
 * clientPortal.controller.js — Client-scoped queries for their projects
 */
import prisma from '../config/db.js'

// GET /api/client/projects
export const getClientProjects = async (req, res, next) => {
  try {
    const clientId = req.client.id

    const projects = await prisma.clientProject.findMany({
      where: { clientId },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { deadline: 'asc' },
    })

    // Add completion stats
    const formatted = projects.map((p) => {
      const totalTasks = p._count.tasks
      const completedTasks = p.tasks.filter((t) => t.status === 'DONE').length
      
      // Remove raw tasks list from dashboard overview for speed
      const { tasks, _count, ...rest } = p

      return {
        ...rest,
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
        },
      };
    })

    res.json({ status: 'ok', data: formatted })
  } catch (err) {
    next(err)
  }
}

// GET /api/client/projects/:id
export const getClientProjectById = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id

    const project = await prisma.clientProject.findFirst({
      where: { id, clientId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' })
    }

    res.json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}

// POST /api/client/projects/:id/feedback
export const submitProjectFeedback = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id
    const { rating, text, companyName, role } = req.body

    if (!rating || !text) {
      return res.status(400).json({ status: 'error', message: 'Rating and feedback text are required' })
    }

    // Verify project belongs to client and is COMPLETED
    const project = await prisma.clientProject.findFirst({
      where: { id, clientId },
      include: { client: true },
    })

    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' })
    }

    if (project.status !== 'COMPLETED') {
      return res.status(400).json({ status: 'error', message: 'Feedback can only be submitted for completed projects.' })
    }

    if (project.hasFeedback) {
      return res.status(400).json({ status: 'error', message: 'Feedback has already been submitted for this project.' })
    }

    // Create testimonial and update project hasFeedback flag in transaction
    const result = await prisma.$transaction(async (tx) => {
      const testimonial = await tx.testimonial.create({
        data: {
          name: project.client?.name || project.clientName,
          role: role || 'Client Partner',
          company: companyName || 'Hindustan Projects Partner',
          text,
          rating: parseInt(rating),
          avatarUrl: null, // default
          isActive: false, // in review pipeline, requires admin approval
          order: 0,
        },
      })

      await tx.clientProject.update({
        where: { id },
        data: { hasFeedback: true },
      })

      return testimonial
    })

    res.status(201).json({ status: 'ok', data: result })
  } catch (err) {
    next(err)
  }
}
