/**
 * cloudinary.js — Cloudinary config + multer-storage-cloudinary setup
 * All credentials from env vars only — never hardcoded.
 */
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { env } from '../config/env.js'

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// Multer-Cloudinary storage — uploads directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hindustan-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
  },
})

// File filter — only images
const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, and WebP images are allowed.'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

export { cloudinary }
