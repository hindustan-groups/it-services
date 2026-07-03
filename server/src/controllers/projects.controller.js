import prisma from '../config/db.js'

const CACHE_SHORT = 'public, max-age=300, stale-while-revalidate=60' // 5 min
const CACHE_LONG = 'public, max-age=3600, stale-while-revalidate=300' // 1 hour

/**
 * GET /api/projects
 * Returns all projects. Supports ?category=Web&featured=true filters.
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query

    const where = {}
    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        clientName: true,
        description: true,
        thumbnailUrl: true,
        technologies: true,
        category: true,
        isFeatured: true,
        createdAt: true,
      },
    })
    res.setHeader('Cache-Control', CACHE_SHORT)
    res.json({ status: 'ok', data: projects })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/projects/:slug
 * Returns a single project with full details including images array.
 */
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const project = await prisma.project.findUnique({ where: { slug } })

    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' })
    }
    res.setHeader('Cache-Control', CACHE_LONG)
    res.json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}
