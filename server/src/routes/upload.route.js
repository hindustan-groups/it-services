/**
 * upload.route.js — POST /api/upload
 * Admin-only image upload to Cloudinary
 */
import { Router } from 'express'
import { verifyToken, requireRole } from '../middleware/auth.js'
import { upload } from '../utils/cloudinary.js'

const router = Router()

/**
 * POST /api/upload
 * Expects multipart/form-data with field name "image"
 * Returns: { status: 'ok', data: { url, publicId } }
 */
router.post(
  '/',
  verifyToken,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  (req, res, next) => {
    // Check Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(503).json({
        status: 'error',
        message: 'Image upload is not configured. Set Cloudinary env vars.',
      })
    }
    next()
  },
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image file provided.' })
    }
    return res.status(201).json({
      status: 'ok',
      data: {
        url: req.file.path, // secure Cloudinary URL
        publicId: req.file.filename,
      },
    })
  }
)

export default router
