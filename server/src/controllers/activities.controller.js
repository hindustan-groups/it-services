/**
 * activities.controller.js — Fetch administrator activity logs
 */
import prisma from '../config/db.js'

export const listActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200, // Cap at latest 200 logs for performance
    })
    res.json({ status: 'ok', data: activities })
  } catch (err) {
    next(err)
  }
}
