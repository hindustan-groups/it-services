/**
 * security.js — Central security middleware configuration
 *
 * Applied in app.js in this order:
 *  1. helmet()         — secure HTTP headers on every response
 *  2. corsOptions      — restrict to CLIENT_URL only (never wildcard *)
 *  3. apiLimiter       — 100 req / 15 min per IP on all /api routes
 *  4. contactLimiter   — 5 req / 15 min per IP on POST /api/contact (spam protection)
 *  5. validateRequest  — helper to check express-validator result and 422 on failure
 */

import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { validationResult } from 'express-validator'

// ── 1. Helmet — HTTP security headers ─────────────────────────
export const helmetConfig = helmet({
  // Content-Security-Policy tuned for a React SPA
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        // Vite dev HMR needs 'unsafe-inline' only in dev
        ...(process.env.NODE_ENV === 'development' ? ["'unsafe-inline'"] : []),
        // Google reCAPTCHA
        'https://www.google.com',
        'https://www.gstatic.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind CSS inline styles
        'https://fonts.googleapis.com',
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https://res.cloudinary.com', // Cloudinary images
      ],
      connectSrc: [
        "'self'",
        process.env.CLIENT_URL || 'http://localhost:5173',
      ],
      frameSrc: [
        'https://www.google.com', // reCAPTCHA iframe
        'https://maps.google.com', // Google Maps embed
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests:
        process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // needed for Google Maps / Cloudinary
})

// ── 2. CORS — allow only the frontend domain ──────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  // Add production domain here via env in production
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : []),
]

export const corsOptions = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error(`CORS: Origin '${origin}' not allowed`))
  },
  credentials: true, // needed for httpOnly JWT cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// ── 3. General API rate limiter ────────────────────────────────
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 2000 : 500, // Relaxed limits
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip entirely in dev
  message: { status: 'error', message: 'Too many requests, please try again later.' },
})

// ── 4. Strict limiter for contact form ────────────────────────
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 submissions per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many contact requests. Please wait before submitting again.',
  },
})

// ── 5. Strict limiter for admin auth routes ───────────────────
export const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes window
  max: process.env.NODE_ENV === 'development' ? 500 : 50, // much more relaxed
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // skip entirely in dev
  message: { status: 'error', message: 'Too many login attempts. Please try again later.' },
})

// ── 6. express-validator result checker ───────────────────────
/**
 * Use after express-validator chains in a route.
 * Returns 422 with field-level errors if validation fails.
 *
 * @example
 *   router.post('/', [body('email').isEmail()], validateRequest, controller)
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    })
  }
  next()
}
