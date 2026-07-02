/**
 * adminServices.controller.js — Admin CRUD for Services
 */
import prisma from '../config/db.js'

export const listServices = async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: services })
  } catch (err) { next(err) }
}

export const createService = async (req, res, next) => {
  try {
    const { title, slug, shortDescription, fullDescription, icon, order } = req.body
    const service = await prisma.service.create({
      data: { title, slug, shortDescription, fullDescription, icon, order: order ?? 0 },
    })
    res.status(201).json({ status: 'ok', data: service })
  } catch (err) { next(err) }
}

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    const service = await prisma.service.update({ where: { id }, data })
    res.json({ status: 'ok', data: service })
  } catch (err) { next(err) }
}

export const deleteService = async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Service deleted.' })
  } catch (err) { next(err) }
}
