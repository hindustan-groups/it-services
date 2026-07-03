/**
 * adminCareers.controller.js — Admin CRUD for Job Postings and Applications
 */
import prisma from '../config/db.js'

// ── Job Postings CRUD ──────────────────────────────────────────

export const listJobPostings = async (_req, res, next) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: jobs })
  } catch (err) {
    next(err)
  }
}

export const createJobPosting = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      department,
      location,
      jobType,
      experienceRequired,
      description,
      responsibilities,
      requirements,
      isActive,
    } = req.body

    const job = await prisma.jobPosting.create({
      data: {
        title,
        slug,
        department,
        location,
        jobType,
        experienceRequired,
        description,
        responsibilities: responsibilities ?? [],
        requirements: requirements ?? [],
        isActive: isActive ?? true,
      },
    })
    res.status(201).json({ status: 'ok', data: job })
  } catch (err) {
    next(err)
  }
}

export const updateJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      title,
      slug,
      department,
      location,
      jobType,
      experienceRequired,
      description,
      responsibilities,
      requirements,
      isActive,
    } = req.body

    const job = await prisma.jobPosting.update({
      where: { id },
      data: {
        title,
        slug,
        department,
        location,
        jobType,
        experienceRequired,
        description,
        responsibilities,
        requirements,
        isActive,
      },
    })
    res.json({ status: 'ok', data: job })
  } catch (err) {
    next(err)
  }
}

export const deleteJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.jobPosting.delete({
      where: { id },
    })
    res.json({ status: 'ok', message: 'Job posting deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// ── Job Applications Management ────────────────────────────────

export const listApplications = async (req, res, next) => {
  try {
    const { jobPostingId, status } = req.query
    const where = {}
    if (jobPostingId) where.jobPostingId = jobPostingId
    if (status) where.status = status

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        jobPosting: {
          select: { title: true, department: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: applications })
  } catch (err) {
    next(err)
  }
}

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const application = await prisma.jobApplication.update({
      where: { id },
      data: { status },
      include: {
        jobPosting: {
          select: { title: true },
        },
      },
    })
    res.json({ status: 'ok', data: application })
  } catch (err) {
    next(err)
  }
}

export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.jobApplication.delete({
      where: { id },
    })
    res.json({ status: 'ok', message: 'Application deleted successfully' })
  } catch (err) {
    next(err)
  }
}
