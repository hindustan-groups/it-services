import prisma from '../config/db.js'

// Public
export const getTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    res.json({ status: 'ok', data: testimonials })
  } catch (err) { next(err) }
}

// Admin CRUD
export const listTestimonials = async (_req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: testimonials })
  } catch (err) { next(err) }
}

export const createTestimonial = async (req, res, next) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body })
    res.status(201).json({ status: 'ok', data: t })
  } catch (err) { next(err) }
}

export const updateTestimonial = async (req, res, next) => {
  try {
    const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body })
    res.json({ status: 'ok', data: t })
  } catch (err) { next(err) }
}

export const deleteTestimonial = async (req, res, next) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Deleted.' })
  } catch (err) { next(err) }
}
