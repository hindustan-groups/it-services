/**
 * recycleBin.controller.js — Handles listing, restoring, and permanently deleting soft-deleted items
 */
import prisma from '../config/db.js'
import { cloudinary } from '../utils/cloudinary.js'
import { logActivity } from '../utils/activity.js'
import { deleteCacheByPrefix } from '../utils/cache.js'

// Helper to delete a file from Cloudinary safely
const deleteCloudinaryFile = async (publicId, fileType = '') => {
  if (!publicId) return
  try {
    const isImage = fileType.startsWith('image/')
    const resourceType = isImage ? 'image' : 'raw'
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete file ${publicId}:`, err.message)
  }
}

// GET /api/admin/recycle-bin
export const getDeletedItems = async (req, res, next) => {
  try {
    const [leads, projects, blog, applications] = await Promise.all([
      prisma.contactLead.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
      }),
      prisma.clientProject.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
      }),
      prisma.blogPost.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          authorName: true,
          deletedAt: true,
        },
      }),
      prisma.jobApplication.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        include: {
          jobPosting: { select: { title: true } },
        },
      }),
    ])

    res.json({
      status: 'ok',
      data: { leads, projects, blog, applications },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/recycle-bin/restore
export const restoreItem = async (req, res, next) => {
  try {
    const { type, id } = req.body

    if (!type || !id) {
      return res.status(400).json({ status: 'error', message: 'Type and ID are required.' })
    }

    let restoredItem = null

    if (type === 'lead') {
      restoredItem = await prisma.contactLead.update({
        where: { id },
        data: { deletedAt: null },
      })
      await logActivity(req, 'UPDATE', 'ContactLead', `Restored lead '${restoredItem.name}'`)
    } else if (type === 'project') {
      restoredItem = await prisma.clientProject.update({
        where: { id },
        data: { deletedAt: null },
      })
      await logActivity(req, 'UPDATE', 'ClientProject', `Restored project '${restoredItem.projectTitle}'`)
    } else if (type === 'blog') {
      restoredItem = await prisma.blogPost.update({
        where: { id },
        data: { deletedAt: null },
      })
      deleteCacheByPrefix('blog:')
      await logActivity(req, 'UPDATE', 'BlogPost', `Restored blog post '${restoredItem.title}'`)
    } else if (type === 'application') {
      restoredItem = await prisma.jobApplication.update({
        where: { id },
        data: { deletedAt: null },
      })
      await logActivity(req, 'UPDATE', 'JobApplication', `Restored job application of '${restoredItem.fullName}'`)
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid restore item type.' })
    }

    res.json({ status: 'ok', message: 'Item restored successfully.', data: restoredItem })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/recycle-bin/permanent/:id
export const permanentlyDeleteItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const { type } = req.query

    if (!type) {
      return res.status(400).json({ status: 'error', message: 'Query parameter type is required.' })
    }

    if (type === 'lead') {
      const lead = await prisma.contactLead.findUnique({
        where: { id },
        include: { attachments: true },
      })

      if (!lead) {
        return res.status(404).json({ status: 'error', message: 'Lead not found.' })
      }

      // Delete attachments from Cloudinary
      if (lead.attachments && lead.attachments.length > 0) {
        for (const attachment of lead.attachments) {
          await deleteCloudinaryFile(attachment.publicId, attachment.fileType)
        }
      }

      await prisma.contactLead.delete({ where: { id } })
      await logActivity(req, 'DELETE', 'ContactLead', `Permanently deleted lead '${lead.name}'`)
    } else if (type === 'project') {
      const project = await prisma.clientProject.findUnique({
        where: { id },
        include: {
          attachments: true,
          tasks: {
            include: { attachments: true },
          },
        },
      })

      if (!project) {
        return res.status(404).json({ status: 'error', message: 'Project not found.' })
      }

      // Delete project-level attachments
      if (project.attachments && project.attachments.length > 0) {
        for (const att of project.attachments) {
          await deleteCloudinaryFile(att.publicId, att.fileType)
        }
      }

      // Delete task-level attachments
      if (project.tasks && project.tasks.length > 0) {
        for (const task of project.tasks) {
          if (task.attachments && task.attachments.length > 0) {
            for (const att of task.attachments) {
              await deleteCloudinaryFile(att.publicId, att.fileType)
            }
          }
        }
      }

      await prisma.clientProject.delete({ where: { id } })
      await logActivity(req, 'DELETE', 'ClientProject', `Permanently deleted project '${project.projectTitle}'`)
    } else if (type === 'blog') {
      const post = await prisma.blogPost.findUnique({
        where: { id },
      })

      if (!post) {
        return res.status(404).json({ status: 'error', message: 'Blog post not found.' })
      }

      // Extract publicId if thumbnail belongs to Cloudinary
      if (post.featuredImageUrl && post.featuredImageUrl.includes('cloudinary')) {
        // e.g. https://res.cloudinary.com/demo/image/upload/v12345/hindustan-projects/sample.jpg
        const parts = post.featuredImageUrl.split('/')
        const fileNameWithExt = parts.pop()
        const folderName = parts.pop() // e.g. hindustan-projects
        if (folderName && fileNameWithExt) {
          const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`
          await deleteCloudinaryFile(publicId, 'image/')
        }
      }

      await prisma.blogPost.delete({ where: { id } })
      deleteCacheByPrefix('blog:')
      await logActivity(req, 'DELETE', 'BlogPost', `Permanently deleted blog post '${post.title}'`)
    } else if (type === 'application') {
      const app = await prisma.jobApplication.findUnique({
        where: { id },
      })

      if (!app) {
        return res.status(404).json({ status: 'error', message: 'Application not found.' })
      }

      // Delete resume from Cloudinary
      if (app.resumeUrl && app.resumeUrl.includes('cloudinary')) {
        const parts = app.resumeUrl.split('/')
        const fileNameWithExt = parts.pop()
        const folderName = parts.pop()
        if (folderName && fileNameWithExt) {
          const publicId = `${folderName}/${fileNameWithExt.split('.')[0]}`
          await deleteCloudinaryFile(publicId, 'raw')
        }
      }

      await prisma.jobApplication.delete({ where: { id } })
      await logActivity(req, 'DELETE', 'JobApplication', `Permanently deleted job application of '${app.fullName}'`)
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid item type for permanent delete.' })
    }

    res.json({ status: 'ok', message: 'Item permanently deleted.' })
  } catch (err) {
    next(err)
  }
}
