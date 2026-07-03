/**
 * Log admin activity to database (fails silently so business logic is never blocked)
 */
import prisma from '../config/db.js'

export const logActivity = async (req, action, entity, details) => {
  try {
    const admin = req.admin
    if (!admin) return

    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action,
        entity,
        details,
      },
    })
  } catch (err) {
    console.error('[ActivityLog] Failed to write log:', err.message)
  }
}
