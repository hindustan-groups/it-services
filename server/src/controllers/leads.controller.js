/**
 * leads.controller.js — Admin: ContactLead management
 */
import prisma from '../config/db.js'

// ── GET /api/admin/leads ───────────────────────────────────────
export const getLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const where = status ? { status } : {}
    const skip = (Number(page) - 1) * Number(limit)

    const [leads, total] = await Promise.all([
      prisma.contactLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.contactLead.count({ where }),
    ])

    res.json({
      status: 'ok',
      data: leads,
      meta: { total, page: Number(page), limit: Number(limit) },
    })
  } catch (err) {
    next(err)
  }
}

// ── PATCH /api/admin/leads/:id ─────────────────────────────────
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, notes, estimatedBudget } = req.body

    const data = {}
    if (status !== undefined) {
      const valid = ['NEW', 'CONTACTED', 'CLOSED']
      if (!valid.includes(status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status.' })
      }
      data.status = status
    }
    if (notes !== undefined) {
      data.notes = notes
    }
    if (estimatedBudget !== undefined) {
      data.estimatedBudget = estimatedBudget
    }

    const lead = await prisma.contactLead.update({ where: { id }, data })
    res.json({ status: 'ok', data: lead })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/admin/leads/:id ────────────────────────────────
export const deleteLead = async (req, res, next) => {
  try {
    await prisma.contactLead.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Lead deleted.' })
  } catch (err) {
    next(err)
  }
}
