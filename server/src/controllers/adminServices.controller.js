/**
 * adminServices.controller.js — Admin CRUD for Services
 */
import prisma from '../config/db.js'
import { deleteCacheByPrefix } from '../utils/cache.js'
import { logActivity } from '../utils/activity.js'

export const listServices = async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: services })
  } catch (err) {
    next(err)
  }
}

export const createService = async (req, res, next) => {
  try {
    const service = await prisma.service.create({ data: req.body })
    deleteCacheByPrefix('services:')
    
    await logActivity(req, 'CREATE', 'Service', `Created service '${service.title}'`)
    
    res.status(201).json({ status: 'ok', data: service })
  } catch (err) {
    next(err)
  }
}

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    const service = await prisma.service.update({ where: { id }, data })
    deleteCacheByPrefix('services:')
    
    await logActivity(req, 'UPDATE', 'Service', `Updated service '${service.title}'`)
    
    res.json({ status: 'ok', data: service })
  } catch (err) {
    next(err)
  }
}

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params
    const service = await prisma.service.findUnique({ where: { id } })
    if (service) {
      await prisma.service.delete({ where: { id } })
      deleteCacheByPrefix('services:')
      await logActivity(req, 'DELETE', 'Service', `Deleted service '${service.title}'`)
    }
    res.json({ status: 'ok', message: 'Service deleted.' })
  } catch (err) {
    next(err)
  }
}
