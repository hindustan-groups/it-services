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

/**
 * Stealth filter - makes all /api/admin routes return a generic 404 Not Found 
 * if the request lacks a valid token.
 */
export const hideAdminRoutes = (req, res, next) => {
  const secretPath = process.env.ADMIN_SECRET_PATH

  // CRITICAL: ADMIN_SECRET_PATH must be set in production
  if (!secretPath) {
    console.error(
      '[SECURITY] ADMIN_SECRET_PATH env var is not set! All admin routes are blocked for safety.'
    )
    return res.status(404).json({
      status: 'error',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    })
  }

  const cleanUrl = req.originalUrl.split('?')[0]

  // Public/login paths allowed to bypass the stealth 404 filter
  const allowedPaths = [
    `/api/admin/${secretPath}/login`,
    `/api/admin/logout`,
    `/api/admin/refresh-token`,
    `/api/admin/2fa/login`,
  ]

  if (allowedPaths.includes(cleanUrl)) {
    return next()
  }

  // Extract access token
  const tokenFromCookie = req.cookies?.adminToken
  const authHeader = req.headers['authorization']
  const tokenFromHeader =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const token = tokenFromCookie || tokenFromHeader

  if (!token) {
    return res.status(404).json({
      status: 'error',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    // Return 404 so expired/invalid tokens don't confirm route existence
    return res.status(404).json({
      status: 'error',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    })
  }
}
