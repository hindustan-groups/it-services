import prisma from '../config/db.js'

export const listSocialDrafts = async (_req, res, next) => {
  try {
    const drafts = await prisma.socialPostDraft.findMany({
      include: {
        project: {
          select: { title: true, category: true, clientName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: drafts })
  } catch (err) {
    next(err)
  }
}

export const updateSocialDraftStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['DRAFT', 'POSTED'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' })
    }

    const draft = await prisma.socialPostDraft.update({
      where: { id },
      data: { status },
    })
    res.json({ status: 'ok', data: draft })
  } catch (err) {
    next(err)
  }
}

export const deleteSocialDraft = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.socialPostDraft.delete({ where: { id } })
    res.json({ status: 'ok', message: 'Social post draft deleted.' })
  } catch (err) {
    next(err)
  }
}

export const createSocialDraft = async (req, res, next) => {
  try {
    const { projectId, text, status } = req.body
    if (!projectId || !text) {
      return res.status(400).json({ status: 'error', message: 'Project ID and text are required.' })
    }
    const draft = await prisma.socialPostDraft.create({
      data: {
        projectId,
        text,
        status: status || 'DRAFT'
      },
      include: {
        project: {
          select: { title: true, category: true, clientName: true }
        }
      }
    })
    res.json({ status: 'ok', data: draft })
  } catch (err) {
    next(err)
  }
}
