/**
 * adminSearch.controller.js — Global cross-module search for administrators
 */
import prisma from '../config/db.js'

// GET /api/admin/search
export const globalSearch = async (req, res, next) => {
  try {
    const query = String(req.query.q || '').trim()
    const role = req.admin.role
    const adminId = req.admin.id
    const adminEmail = req.admin.email

    if (!query || query.length < 2) {
      return res.json({
        status: 'ok',
        data: { leads: [], projects: [], tasks: [], blog: [], team: [] },
      })
    }

    const searchStr = query

    // Define search conditions for each module
    const searchConditions = {
      leads: {
        OR: [
          { name: { contains: searchStr, mode: 'insensitive' } },
          { email: { contains: searchStr, mode: 'insensitive' } },
          { phone: { contains: searchStr, mode: 'insensitive' } },
          { message: { contains: searchStr, mode: 'insensitive' } },
        ],
      },
      projects: {
        OR: [
          { clientName: { contains: searchStr, mode: 'insensitive' } },
          { projectTitle: { contains: searchStr, mode: 'insensitive' } },
          { description: { contains: searchStr, mode: 'insensitive' } },
        ],
      },
      tasks: {
        AND: [
          {
            OR: [
              { title: { contains: searchStr, mode: 'insensitive' } },
              { description: { contains: searchStr, mode: 'insensitive' } },
            ],
          },
        ],
      },
      blog: {
        OR: [
          { title: { contains: searchStr, mode: 'insensitive' } },
          { excerpt: { contains: searchStr, mode: 'insensitive' } },
          { content: { contains: searchStr, mode: 'insensitive' } },
        ],
      },
      team: {
        OR: [
          { name: { contains: searchStr, mode: 'insensitive' } },
          { role: { contains: searchStr, mode: 'insensitive' } },
          { bio: { contains: searchStr, mode: 'insensitive' } },
        ],
      },
    }

    // Role-based restrictions & scoping
    let includeLeads = true
    let includeProjects = true
    let includeTasks = true
    let includeBlog = true
    let includeTeam = true

    if (role === 'STAFF') {
      // Staff can see Leads (read-only) and Tasks (scoped to them)
      includeProjects = false
      includeBlog = false
      includeTeam = false

      // Scope tasks to only those assigned to or created by the staff member
      searchConditions.tasks.AND.push({
        OR: [
          { creatorId: adminId },
          { assignedToAdminId: adminId },
          { assignedTo: adminEmail },
        ],
      })
    }

    // Run database queries in parallel
    const [leads, projects, tasks, blog, team] = await Promise.all([
      includeLeads
        ? prisma.contactLead.findMany({ where: searchConditions.leads, take: 10 })
        : Promise.resolve([]),
      includeProjects
        ? prisma.clientProject.findMany({ where: searchConditions.projects, take: 10 })
        : Promise.resolve([]),
      includeTasks
        ? prisma.workTask.findMany({ where: searchConditions.tasks, take: 10 })
        : Promise.resolve([]),
      includeBlog
        ? prisma.blogPost.findMany({ where: searchConditions.blog, take: 10 })
        : Promise.resolve([]),
      includeTeam
        ? prisma.teamMember.findMany({ where: searchConditions.team, take: 10 })
        : Promise.resolve([]),
    ])

    res.json({
      status: 'ok',
      data: {
        leads: leads.map((l) => ({ id: l.id, title: l.name, subtitle: l.email, route: '/admin/leads' })),
        projects: projects.map((p) => ({ id: p.id, title: p.projectTitle, subtitle: p.clientName, route: '/admin/client-projects' })),
        tasks: tasks.map((t) => ({ id: t.id, title: t.title, subtitle: t.status, route: '/admin/tasks' })),
        blog: blog.map((b) => ({ id: b.id, title: b.title, subtitle: b.category, route: '/admin/blog' })),
        team: team.map((tm) => ({ id: tm.id, title: tm.name, subtitle: tm.role, route: '/admin/team' })),
      },
    })
  } catch (err) {
    next(err)
  }
}
