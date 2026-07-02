/**
 * adminProjects.controller.js — Admin CRUD for Projects
 */
import prisma from '../config/db.js'

export const listProjects = async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ status: 'ok', data: projects })
  } catch (err) { next(err) }
}

export const createProject = async (req, res, next) => {
  try {
    const { title, slug, clientName, description, thumbnailUrl, images, technologies, category, isFeatured } = req.body
    const project = await prisma.project.create({
      data: { title, slug, clientName, description, thumbnailUrl, images: images ?? [], technologies: technologies ?? [], category, isFeatured: isFeatured ?? false },
    })
    res.status(201).json({ status: 'ok', data: project })
  } catch (err) { next(err) }
}

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await prisma.project.update({ where: { id }, data: req.body })
    res.json({ status: 'ok', data: project })
  } catch (err) { next(err) }
}

export const deleteProject = async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Project deleted.' })
  } catch (err) { next(err) }
}
