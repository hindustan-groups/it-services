import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'

// Public
export const getTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    res.json({ status: 'ok', data: testimonials })
  } catch (err) {
    next(err)
  }
}

// Admin CRUD
export const listTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: testimonials })
  } catch (err) {
    next(err)
  }
}

export const createTestimonial = async (req, res, next) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body })
    
    await logActivity(req, 'CREATE', 'Testimonial', `Created testimonial from '${t.name}' (${t.company})`)
    
    res.status(201).json({ status: 'ok', data: t })
  } catch (err) {
    next(err)
  }
}

export const updateTestimonial = async (req, res, next) => {
  try {
    const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body })
    
    await logActivity(req, 'UPDATE', 'Testimonial', `Updated testimonial from '${t.name}' (${t.company})`)
    
    res.json({ status: 'ok', data: t })
  } catch (err) {
    next(err)
  }
}

export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params
    const t = await prisma.testimonial.findUnique({ where: { id } })
    if (t) {
      await prisma.testimonial.delete({ where: { id } })
      await logActivity(req, 'DELETE', 'Testimonial', `Deleted testimonial from '${t.name}' (${t.company})`)
    }
    res.json({ status: 'ok', message: 'Deleted.' })
  } catch (err) {
    next(err)
  }
}
