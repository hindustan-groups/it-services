/**
 * tickets.controller.js — Support Ticketing System controller
 */
import prisma from '../config/db.js'

// ── CLIENT PORTAL ACTIONS ────────────────────────────────────────

// POST /api/client/tickets
export const createTicket = async (req, res, next) => {
  try {
    const clientId = req.client.id
    const { subject, category, clientProjectId, description } = req.body

    if (!subject || !category || !description) {
      return res.status(400).json({ status: 'error', message: 'Subject, category, and initial description are required' })
    }

    // Atomic transaction: Create ticket AND create the initial thread message
    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTicket.create({
        data: {
          subject,
          category,
          clientId,
          clientProjectId: clientProjectId || null,
        },
      })

      // Get client name to record sender name
      const client = await tx.client.findUnique({
        where: { id: clientId },
        select: { name: true },
      })

      const initialMessage = await tx.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          senderType: 'CLIENT',
          senderName: client?.name || 'Client',
          senderId: clientId,
          message: description,
        },
      })

      return { ticket, initialMessage }
    })

    res.status(201).json({ status: 'ok', data: result.ticket })
  } catch (err) {
    next(err)
  }
}

// GET /api/client/tickets
export const listClientTickets = async (req, res, next) => {
  try {
    const clientId = req.client.id

    const tickets = await prisma.supportTicket.findMany({
      where: { clientId },
      include: {
        clientProject: {
          select: { projectTitle: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json({ status: 'ok', data: tickets })
  } catch (err) {
    next(err)
  }
}

// GET /api/client/tickets/:id
export const getClientTicketById = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id

    const ticket = await prisma.supportTicket.findFirst({
      where: { id, clientId },
      include: {
        clientProject: {
          select: { projectTitle: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' })
    }

    res.json({ status: 'ok', data: ticket })
  } catch (err) {
    next(err)
  }
}

// POST /api/client/tickets/:id/messages
export const replyToTicketFromClient = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message content is required' })
    }

    // Verify ticket ownership
    const ticket = await prisma.supportTicket.findFirst({
      where: { id, clientId },
    })

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' })
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      const msg = await tx.ticketMessage.create({
        data: {
          ticketId: id,
          senderType: 'CLIENT',
          senderName: client?.name || 'Client',
          senderId: clientId,
          message,
        },
      })

      // Update ticket status back to OPEN if it was RESOLVED, and update updatedAt timestamp
      await tx.supportTicket.update({
        where: { id },
        data: {
          status: ticket.status === 'RESOLVED' ? 'OPEN' : ticket.status,
          updatedAt: new Date(),
        },
      })

      return msg
    })

    res.status(201).json({ status: 'ok', data: result })
  } catch (err) {
    next(err)
  }
}

// ── ADMINISTRATIVE ACTIONS ────────────────────────────────────────

// GET /api/admin/tickets
export const listAllTickets = async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        client: {
          select: { name: true, email: true },
        },
        clientProject: {
          select: { projectTitle: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    res.json({ status: 'ok', data: tickets })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/tickets/:id
export const getAdminTicketById = async (req, res, next) => {
  try {
    const { id } = req.params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        client: {
          select: { name: true, email: true },
        },
        clientProject: {
          select: { projectTitle: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' })
    }

    res.json({ status: 'ok', data: ticket })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/tickets/:id/messages
export const replyToTicketFromAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.user.id
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message content is required' })
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: 'Ticket not found' })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { email: true, role: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      const msg = await tx.ticketMessage.create({
        data: {
          ticketId: id,
          senderType: 'ADMIN',
          senderName: `${admin?.role || 'Staff'} (${admin?.email || 'Admin'})`,
          senderId: adminId,
          message,
        },
      })

      // Update ticket status to IN_PROGRESS when admin replies
      await tx.supportTicket.update({
        where: { id },
        data: {
          status: 'IN_PROGRESS',
          updatedAt: new Date(),
        },
      })

      return msg
    })

    res.status(201).json({ status: 'ok', data: result })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/tickets/:id
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid ticket status' })
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    res.json({ status: 'ok', data: updated })
  } catch (err) {
    next(err)
  }
}
