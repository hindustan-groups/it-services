/**
 * adminTeam.controller.js — Admin CRUD for TeamMembers
 */
import prisma from '../config/db.js'

export const listTeam = async (_req, res, next) => {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
    res.json({ status: 'ok', data: members })
  } catch (err) { next(err) }
}

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, photoUrl, bio, linkedinUrl, order } = req.body
    const member = await prisma.teamMember.create({
      data: { name, role, photoUrl, bio, linkedinUrl, order: order ?? 0 },
    })
    res.status(201).json({ status: 'ok', data: member })
  } catch (err) { next(err) }
}

export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params
    const member = await prisma.teamMember.update({ where: { id }, data: req.body })
    res.json({ status: 'ok', data: member })
  } catch (err) { next(err) }
}

export const deleteTeamMember = async (req, res, next) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } })
    res.json({ status: 'ok', message: 'Team member deleted.' })
  } catch (err) { next(err) }
}
