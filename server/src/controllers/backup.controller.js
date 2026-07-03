/**
 * backup.controller.js
 *
 * GET  /api/admin/backup         — Download full or selective DB backup as JSON
 * POST /api/admin/backup/restore — Restore data from a backup JSON (future)
 *
 * SUPER_ADMIN only.
 * No sensitive credentials are included in the backup (no SiteSetting sys_* keys).
 */

import prisma from '../config/db.js'

// Tables available for backup — display name + prisma model key
const BACKUP_TABLES = {
  services: {
    label: 'Services',
    fetch: () => prisma.service.findMany({ orderBy: { order: 'asc' } }),
  },
  projects: {
    label: 'Projects',
    fetch: () => prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  team: {
    label: 'Team Members',
    fetch: () => prisma.teamMember.findMany({ orderBy: { order: 'asc' } }),
  },
  testimonials: {
    label: 'Testimonials',
    fetch: () => prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
  },
  faqs: { label: 'FAQs', fetch: () => prisma.faq.findMany({ orderBy: { order: 'asc' } }) },
  milestones: {
    label: 'Milestones',
    fetch: () => prisma.milestone.findMany({ orderBy: { order: 'asc' } }),
  },
  partners: {
    label: 'Partners',
    fetch: () => prisma.partner.findMany({ orderBy: { order: 'asc' } }),
  },
  leads: {
    label: 'Contact Leads',
    fetch: () => prisma.contactLead.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  careers: {
    label: 'Job Postings',
    fetch: () => prisma.jobPosting.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  applications: {
    label: 'Applications',
    fetch: () => prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  legal: { label: 'Legal Pages', fetch: () => prisma.legalPage.findMany() },
  siteSettings: {
    label: 'Site Settings',
    fetch: () =>
      prisma.siteSetting.findMany({
        // Exclude all sys_* keys — these contain credentials
        where: { key: { not: { startsWith: 'sys_' } } },
      }),
  },
  clientProjects: {
    label: 'Client Projects',
    fetch: () => prisma.clientProject.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  workTasks: {
    label: 'Work Tasks',
    fetch: () => prisma.workTask.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  quickNotes: {
    label: 'Quick Notes',
    fetch: () => prisma.quickNote.findMany({ orderBy: { createdAt: 'desc' } }),
  },
  activityLogs: {
    label: 'Activity Logs',
    fetch: () => prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' } }),
  },
}

/**
 * GET /api/admin/backup
 * Query param: ?tables=services,projects,team  (comma-separated, defaults to all)
 * Returns a JSON file download.
 */
export const downloadBackup = async (req, res, next) => {
  try {
    const requested = req.query.tables
      ? req.query.tables
          .split(',')
          .map((t) => t.trim())
          .filter((t) => BACKUP_TABLES[t])
      : Object.keys(BACKUP_TABLES)

    if (requested.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No valid tables specified.' })
    }

    // Fetch all requested tables in parallel
    const results = await Promise.allSettled(
      requested.map(async (key) => {
        const data = await BACKUP_TABLES[key].fetch()
        return { key, label: BACKUP_TABLES[key].label, count: data.length, data }
      })
    )

    const tables = {}
    const summary = []

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { key, label, count, data } = result.value
        tables[key] = data
        summary.push({ table: key, label, count })
      }
    }

    const backup = {
      meta: {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        generatedBy: req.admin?.email || 'admin',
        project: 'Hindustan Projects',
        tablesIncluded: summary,
        totalRecords: summary.reduce((acc, t) => acc + t.count, 0),
        note: 'Sensitive credentials (sys_* site settings) are excluded from this backup.',
      },
      tables,
    }

    const filename = `hindustan-projects-backup-${new Date().toISOString().slice(0, 10)}.json`

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(JSON.stringify(backup, null, 2))
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/admin/backup/tables
 * Returns list of available tables with record counts.
 */
export const getBackupTableInfo = async (req, res, next) => {
  try {
    const counts = await Promise.allSettled(
      Object.entries(BACKUP_TABLES).map(async ([key, cfg]) => {
        const data = await cfg.fetch()
        return { key, label: cfg.label, count: data.length }
      })
    )

    const tables = counts.filter((r) => r.status === 'fulfilled').map((r) => r.value)

    res.json({ status: 'ok', data: tables })
  } catch (err) {
    next(err)
  }
}
