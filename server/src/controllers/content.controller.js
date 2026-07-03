/**
 * content.controller.js — FAQs, SiteSettings, Milestones, Partners
 * Public GET + Admin CRUD
 */
import prisma from '../config/db.js'

// ── FAQs ──────────────────────────────────────────────────────
export const getFaqs = async (_req, res, next) => {
  try {
    const faqs = await prisma.faq.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: faqs })
  } catch (err) {
    next(err)
  }
}
export const listFaqs = async (_req, res, next) => {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: faqs })
  } catch (err) {
    next(err)
  }
}
export const createFaq = async (req, res, next) => {
  try {
    const f = await prisma.faq.create({ data: req.body })
    res.status(201).json({ status: 'ok', data: f })
  } catch (err) {
    next(err)
  }
}
export const updateFaq = async (req, res, next) => {
  try {
    const f = await prisma.faq.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'ok', data: f })
  } catch (err) {
    next(err)
  }
}
export const deleteFaq = async (req, res, next) => {
  try {
    await prisma.faq.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Deleted.' })
  } catch (err) {
    next(err)
  }
}

// ── Site Settings ─────────────────────────────────────────────
export const getSettings = async (_req, res, next) => {
  try {
    const rows = await prisma.siteSetting.findMany()
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    res.json({ status: 'ok', data: settings })
  } catch (err) {
    next(err)
  }
}
export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body // { key: value, ... }
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )
    res.json({ status: 'ok', message: 'Settings updated.' })
  } catch (err) {
    next(err)
  }
}

// ── Milestones ────────────────────────────────────────────────
export const getMilestones = async (_req, res, next) => {
  try {
    const m = await prisma.milestone.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: m })
  } catch (err) {
    next(err)
  }
}
export const createMilestone = async (req, res, next) => {
  try {
    const m = await prisma.milestone.create({ data: req.body })
    res.status(201).json({ status: 'ok', data: m })
  } catch (err) {
    next(err)
  }
}
export const updateMilestone = async (req, res, next) => {
  try {
    const m = await prisma.milestone.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'ok', data: m })
  } catch (err) {
    next(err)
  }
}
export const deleteMilestone = async (req, res, next) => {
  try {
    await prisma.milestone.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Deleted.' })
  } catch (err) {
    next(err)
  }
}

// ── Partners ──────────────────────────────────────────────────
export const getPartners = async (_req, res, next) => {
  try {
    const p = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    res.json({ status: 'ok', data: p })
  } catch (err) {
    next(err)
  }
}
export const listPartners = async (_req, res, next) => {
  try {
    const p = await prisma.partner.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: p })
  } catch (err) {
    next(err)
  }
}
export const createPartner = async (req, res, next) => {
  try {
    const p = await prisma.partner.create({ data: req.body })
    res.status(201).json({ status: 'ok', data: p })
  } catch (err) {
    next(err)
  }
}
export const updatePartner = async (req, res, next) => {
  try {
    const p = await prisma.partner.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'ok', data: p })
  } catch (err) {
    next(err)
  }
}
export const deletePartner = async (req, res, next) => {
  try {
    await prisma.partner.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Deleted.' })
  } catch (err) {
    next(err)
  }
}
