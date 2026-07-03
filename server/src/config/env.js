import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  INTEGRATION_MASTER_KEY: process.env.INTEGRATION_MASTER_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
}

// Validate required env vars at startup
const required = ['DATABASE_URL', 'JWT_SECRET']
for (const key of required) {
  if (!env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}
