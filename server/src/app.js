import express from 'express'
import cookieParser from 'cookie-parser'

import { helmetConfig, corsOptions, apiLimiter } from './middleware/security.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

// ── Route imports ──────────────────────────────────────────────
import healthRouter from './routes/health.route.js'
import servicesRouter from './routes/services.route.js'
import projectsRouter from './routes/projects.route.js'
import teamRouter from './routes/team.route.js'
import contactRouter from './routes/contact.route.js'
import adminRouter from './routes/admin.route.js'
import uploadRouter from './routes/upload.route.js'
import testimonialsRouter from './routes/testimonials.route.js'
import contentRouter from './routes/content.route.js'

const app = express()

// ── 1. Security headers (helmet) ──────────────────────────────
app.use(helmetConfig)

// ── 2. CORS — allow only CLIENT_URL ───────────────────────────
app.use(corsOptions)

// ── 3. Body parsers ───────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))       // limit body size → prevent payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())                         // needed for httpOnly JWT cookies

// ── 4. General API rate limiter ───────────────────────────────
app.use('/api', apiLimiter)

// ── 5. Routes ─────────────────────────────────────────────────
app.use('/api/health', healthRouter)
app.use('/api/services', servicesRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/team', teamRouter)
app.use('/api/contact', contactRouter)
app.use('/api/admin', adminRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api', contentRouter)

// ── 6. 404 + Error handlers ───────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
