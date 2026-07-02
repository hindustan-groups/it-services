/**
 * careers.controller.js — Public Careers routes (list jobs + apply)
 */
import prisma from '../config/db.js'
import { sendEmail, jobAdminNotificationTemplate, jobApplicantConfirmationTemplate } from '../utils/mailer.js'
import { env } from '../config/env.js'

export const getActiveJobs = async (_req, res, next) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ status: 'ok', data: jobs })
  } catch (err) { next(err) }
}

export const getJobBySlug = async (req, res, next) => {
  try {
    let job = await prisma.jobPosting.findUnique({
      where: { slug: req.params.slug, isActive: true }
    })

    if (!job && req.params.slug === 'general-application') {
      job = await prisma.jobPosting.upsert({
        where: { slug: 'general-application' },
        update: { isActive: true },
        create: {
          title: 'General Application (Future Openings)',
          slug: 'general-application',
          department: 'General',
          location: 'Remote / Bhilwara',
          jobType: 'FULL_TIME',
          experienceRequired: 'Any experience',
          description: 'Submit your resume for general consideration for future openings at Hindustan Projects.',
          responsibilities: ['Support various projects as needed', 'Collaborate with the team on software, design, or marketing goals'],
          requirements: ['Passion for learning and building products', 'Good communication and teamwork skills'],
          isActive: true
        }
      })
    }

    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job posting not found' })
    }
    res.json({ status: 'ok', data: job })
  } catch (err) { next(err) }
}

export const submitApplication = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { fullName, email, phone, coverLetter } = req.body

    let job = await prisma.jobPosting.findUnique({
      where: { slug, isActive: true }
    })

    if (!job && slug === 'general-application') {
      job = await prisma.jobPosting.upsert({
        where: { slug: 'general-application' },
        update: { isActive: true },
        create: {
          title: 'General Application (Future Openings)',
          slug: 'general-application',
          department: 'General',
          location: 'Remote / Bhilwara',
          jobType: 'FULL_TIME',
          experienceRequired: 'Any experience',
          description: 'Submit your resume for general consideration for future openings at Hindustan Projects.',
          responsibilities: ['Support various projects as needed', 'Collaborate with the team on software, design, or marketing goals'],
          requirements: ['Passion for learning and building products', 'Good communication and teamwork skills'],
          isActive: true
        }
      })
    }

    if (!job) {
      return res.status(404).json({ status: 'error', message: 'Job posting not found' })
    }

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Resume file is required' })
    }

    // ── Check for recent application (24 hour lock per job posting) ──
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existingApp = await prisma.jobApplication.findFirst({
      where: {
        jobPostingId: job.id,
        email: email.trim().toLowerCase(),
        createdAt: { gte: oneDayAgo }
      }
    })

    if (existingApp) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this position in the last 24 hours. Please wait before applying again.'
      })
    }

    // Multer-Cloudinary sets file.path to the uploaded URL. Fallback to placeholder if mock.
    const resumeUrl = req.file.path || req.file.secure_url || 'https://res.cloudinary.com/demo/image/upload/v1580000000/sample_resume.pdf'

    const application = await prisma.jobApplication.create({
      data: {
        jobPostingId: job.id,
        fullName,
        email,
        phone,
        resumeUrl,
        coverLetter: coverLetter || null,
        status: 'NEW'
      }
    })

    // ── Send Email Notifications ─────────────────────────────────
    // 1. Email to Admin
    const adminEmail = env.ADMIN_EMAIL || 'info@hindustanprojects.com'
    const adminMail = jobAdminNotificationTemplate({
      jobTitle: job.title,
      name: fullName,
      email,
      phone,
      resumeUrl,
      coverLetter
    })
    await sendEmail({ to: adminEmail, ...adminMail }).catch(err => {
      console.error('[mailer] Job application admin email failed:', err.message)
    })

    // 2. Confirmation to Applicant
    const applicantMail = jobApplicantConfirmationTemplate({
      name: fullName,
      jobTitle: job.title
    })
    await sendEmail({ to: email, ...applicantMail }).catch(err => {
      console.error('[mailer] Job application applicant confirmation failed:', err.message)
    })

    res.status(201).json({ status: 'ok', data: application })
  } catch (err) { next(err) }
}
