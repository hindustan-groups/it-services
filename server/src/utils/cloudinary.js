/**
 * cloudinary.js — Cloudinary config + multer memory storage + direct SDK upload
 * Uses cloudinary v1 SDK with in-memory multer (no multer-storage-cloudinary dependency)
 */
import cloudinaryPkg from 'cloudinary'
import multer from 'multer'
import { env } from '../config/env.js'

const cloudinary = cloudinaryPkg.v2

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// Use memory storage — file goes to buffer, we upload manually
const memoryStorage = multer.memoryStorage()

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
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
})

// Resume file filter
const resumeFileFilter = (_req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const ext = file.originalname.split('.').pop().toLowerCase()
  if (allowedTypes.includes(file.mimetype) || ['pdf', 'doc', 'docx'].includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only PDF and Word documents (.doc, .docx) are allowed.'), false)
  }
}

export const uploadResume = multer({
  storage: memoryStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

/**
 * Upload buffer to Cloudinary directly
 * Used in upload.route.js after multer processes the file into memory
 */
export const uploadToCloudinary = (buffer, folder = 'hindustan-projects', resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        transformation: resourceType === 'image'
          ? [{ width: 1200, quality: 'auto', fetch_format: 'auto' }]
          : undefined,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export { cloudinary }
