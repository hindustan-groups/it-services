/**
 * notes.controller.js — Admin CRUD for Quick Notes
 */
import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'

export const listNotes = async (req, res, next) => {
  try {
    const notes = await prisma.quickNote.findMany()
    const sorted = [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    res.json({ status: 'ok', data: sorted })
  } catch (err) {
    next(err)
  }
}

export const createNote = async (req, res, next) => {
  try {
    const { title, content, color } = req.body
    if (!content) {
      return res.status(400).json({ status: 'error', message: 'Note content is required.' })
    }
    const note = await prisma.quickNote.create({
      data: {
        title,
        content,
        color: color ?? 'yellow',
        isPinned: false,
      },
    })

    await logActivity(
      req,
      'CREATE',
      'QuickNote',
      `Created sticky note '${note.title || 'Untitled'}'`
    )

    res.status(201).json({ status: 'ok', data: note })
  } catch (err) {
    next(err)
  }
}

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params
    const note = await prisma.quickNote.update({
      where: { id },
      data: req.body,
    })

    await logActivity(
      req,
      'UPDATE',
      'QuickNote',
      `Updated sticky note '${note.title || 'Untitled'}'`
    )

    res.json({ status: 'ok', data: note })
  } catch (err) {
    next(err)
  }
}

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params
    const note = await prisma.quickNote.findUnique({ where: { id } })
    if (note) {
      await prisma.quickNote.delete({ where: { id } })
      await logActivity(
        req,
        'DELETE',
        'QuickNote',
        `Deleted sticky note '${note.title || 'Untitled'}'`
      )
    }
    res.json({ status: 'ok', message: 'Note deleted.' })
  } catch (err) {
    next(err)
  }
}
