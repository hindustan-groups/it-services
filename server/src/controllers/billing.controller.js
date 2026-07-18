/**
 * billing.controller.js — Project Billing and Financial Milestones controller
 */
import prisma from '../config/db.js'

// ── CLIENT PORTAL ACTIONS ────────────────────────────────────────

// GET /api/client/billing
export const listClientMilestones = async (req, res, next) => {
  try {
    const clientId = req.client.id

    // Fetch milestones for all projects owned by the client
    const milestones = await prisma.billingMilestone.findMany({
      where: {
        clientProject: {
          clientId,
        },
      },
      include: {
        clientProject: {
          select: { projectTitle: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    res.json({ status: 'ok', data: milestones })
  } catch (err) {
    next(err)
  }
}

// POST /api/client/billing/:id/pay
export const simulatePayment = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id

    // Verify ownership of the milestone project
    const milestone = await prisma.billingMilestone.findFirst({
      where: {
        id,
        clientProject: {
          clientId,
        },
      },
    })

    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' })
    }

    if (milestone.status === 'PAID') {
      return res.status(400).json({ status: 'error', message: 'Milestone is already paid' })
    }

    const updated = await prisma.billingMilestone.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        invoiceUrl: `https://it-services-hindustan-projects.vercel.app/invoices/INV-${id.slice(-6).toUpperCase()}.pdf`, // mock invoice URL
      },
    })

    res.json({ status: 'ok', data: updated })
  } catch (err) {
    next(err)
  }
}

// ── ADMINISTRATIVE ACTIONS ────────────────────────────────────────

// GET /api/admin/client-projects/:id/billing
export const listProjectMilestones = async (req, res, next) => {
  try {
    const { id } = req.params

    const milestones = await prisma.billingMilestone.findMany({
      where: { clientProjectId: id },
      orderBy: { dueDate: 'asc' },
    })

    res.json({ status: 'ok', data: milestones })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/client-projects/:id/billing
export const createMilestone = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, amount, dueDate, status } = req.body

    if (!title || amount === undefined) {
      return res.status(400).json({ status: 'error', message: 'Title and amount are required' })
    }

    // Verify project exists
    const project = await prisma.clientProject.findUnique({
      where: { id },
    })

    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Client project not found' })
    }

    const milestone = await prisma.billingMilestone.create({
      data: {
        title,
        amount: parseFloat(amount),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
        clientProjectId: id,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    })

    res.status(201).json({ status: 'ok', data: milestone })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/billing/:id
export const updateMilestone = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, amount, dueDate, status } = req.body

    const milestone = await prisma.billingMilestone.findUnique({
      where: { id },
    })

    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' })
    }

    const data = {}
    if (title !== undefined) data.title = title
    if (amount !== undefined) data.amount = parseFloat(amount)
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null
    if (status !== undefined) {
      data.status = status
      if (status === 'PAID' && milestone.status !== 'PAID') {
        data.paidAt = new Date()
        data.invoiceUrl = `https://it-services-hindustan-projects.vercel.app/invoices/INV-${id.slice(-6).toUpperCase()}.pdf`
      } else if (status !== 'PAID') {
        data.paidAt = null
        data.invoiceUrl = null
      }
    }

    const updated = await prisma.billingMilestone.update({
      where: { id },
      data,
    })

    res.json({ status: 'ok', data: updated })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/billing/:id
export const deleteMilestone = async (req, res, next) => {
  try {
    const { id } = req.params

    const milestone = await prisma.billingMilestone.findUnique({
      where: { id },
    })

    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' })
    }

    await prisma.billingMilestone.delete({
      where: { id },
    })

    res.json({ status: 'ok', message: 'Milestone deleted successfully' })
  } catch (err) {
    next(err)
  }
}
