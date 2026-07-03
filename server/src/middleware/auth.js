/**
 * auth.js — JWT verification middleware for protected admin routes.
 *
 * JWT is stored in an httpOnly cookie (set during admin login in Phase 7).
 * Falls back to Authorization Bearer header for API clients / testing.
 *
 * Usage: apply to any admin route
 *   router.get('/admin/leads', verifyToken, requireRole('ADMIN'), controller)
 */

import jwt from 'jsonwebtoken'

/**
 * Verifies JWT from httpOnly cookie or Authorization header.
 * Attaches decoded payload to req.admin on success.
 */
export const verifyToken = (req, res, next) => {
  // 1. Check httpOnly cookie first (production auth flow)
  const tokenFromCookie = req.cookies?.adminToken

  // 2. Fall back to Authorization: Bearer <token> header
  const authHeader = req.headers['authorization']
  const tokenFromHeader =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  const token = tokenFromCookie || tokenFromHeader

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please log in.',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded // { id, email, role, iat, exp }
    next()
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.'

    return res.status(401).json({ status: 'error', message })
  }
}

/**
 * Role-based access guard — use after verifyToken.
 * @param {...string} roles — allowed roles e.g. 'ADMIN', 'SUPER_ADMIN'
 */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated.' })
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.',
      })
    }
    next()
  }
