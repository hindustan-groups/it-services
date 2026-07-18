/**
 * mailer.js — Email sending via Resend (primary) or Nodemailer SMTP (fallback)
 *
 * Priority:
 *  1. Resend SDK  — if RESEND_API_KEY is set (recommended)
 *  2. Nodemailer  — if EMAIL_USER + EMAIL_PASS is set (SMTP fallback)
 *  3. Console log — dev mode when neither is configured
 *
 * Never hardcode credentials here. All from env vars.
 */

import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { env } from '../config/env.js'

// ── Determine sending strategy ─────────────────────────────────
function getStrategy() {
  if (env.RESEND_API_KEY) return 'resend'
  if (env.EMAIL_USER && env.EMAIL_PASS) return 'smtp'
  return 'console'
}

// ── Resend sender ──────────────────────────────────────────────
async function sendViaResend({ to, subject, html, text, attachments }) {
  const resend = new Resend(env.RESEND_API_KEY)

  // Ensure from always has a display name like "Hindustan Projects <email>"
  // If EMAIL_FROM is just an email (no display name), wrap it properly
  const rawFrom = env.EMAIL_FROM || 'info@hindustanprojects.in'
  const from = rawFrom.includes('<')
    ? rawFrom
    : `Hindustan Projects <${rawFrom}>`

  const { data, error } = await resend.emails.send({ from, to, subject, html, text, attachments })
  if (error) throw new Error(error.message || 'Resend send failed')
  return { messageId: data?.id }
}

// ── Nodemailer SMTP sender ─────────────────────────────────────
async function sendViaSMTP({ to, subject, html, text, attachments }) {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST || 'smtp.gmail.com',
    port: env.EMAIL_PORT || 587,
    secure: env.EMAIL_PORT === 465,
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  })
  const from = env.EMAIL_FROM || `"Hindustan Projects" <${env.EMAIL_USER}>`
  const info = await transporter.sendMail({ from, to, subject, html, text, attachments })
  return info
}

/**
 * sendEmailDirect — unified direct send function.
 * Automatically picks Resend → SMTP → console based on env config.
 */
async function sendEmailDirect({ to, subject, html, text, attachments }) {
  const strategy = getStrategy()

  if (strategy === 'console') {
    console.log('\n📧 [DEV — EMAIL NOT SENT — LOG ONLY]')
    console.log(`  To:       ${to}`)
    console.log(`  Subject:  ${subject}`)
    console.log(`  Body:     ${text || '(html only)'}`)
    if (attachments) {
      console.log(`  Attachments: ${attachments.map((a) => a.filename).join(', ')}`)
    }
    console.log('─────────────────────────────────────\n')
    return { messageId: 'dev-console-log' }
  }

  if (strategy === 'resend') {
    return sendViaResend({ to, subject, html, text, attachments })
  }

  return sendViaSMTP({ to, subject, html, text, attachments })
}

// ── In-Memory Throttled Email Queue ────────────────────────────
const emailQueue = []
let processingQueue = false

async function processEmailQueue() {
  if (processingQueue || emailQueue.length === 0) return
  processingQueue = true

  while (emailQueue.length > 0) {
    const { options, resolve, reject } = emailQueue.shift()
    try {
      const result = await sendEmailDirect(options)
      resolve(result)
    } catch (err) {
      console.error('[mailer queue error]:', err.message)
      reject(err)
    }
    // Throttle: wait 1 second between email attempts to prevent rate limit issues
    await new Promise((res) => setTimeout(res, 1000))
  }

  processingQueue = false
}

/**
 * sendEmail — unified queued send function.
 * Throttles outbound emails to 1 email/sec to prevent SMTP service exhaustion.
 *
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
export async function sendEmail(options) {
  return new Promise((resolve, reject) => {
    emailQueue.push({ options, resolve, reject })
    processEmailQueue()
  })
}

// ── Shared Professional Email Footer ───────────────────────────

/**
 * professionalEmailFooter() — Brand-consistent footer for all client emails.
 * Based on Hindustan Projects Official Email Signature System (HP-BB-030).
 */
export function professionalEmailFooter() {
  return `
    <div style="margin-top: 32px; border-top: 2px solid #1A3E8C; padding-top: 20px;">

      <!-- Brand + Contact -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top; padding-right: 20px;">

            <!-- Logo Text -->
            <div style="margin-bottom: 12px;">
              <span style="font-size: 22px; font-weight: 900; color: #1A3E8C; letter-spacing: -0.5px;">Hi</span><span style="font-size: 22px; font-weight: 900; color: #E31E24;">PRO</span>
              <div style="font-size: 9px; font-weight: 700; color: #1A3E8C; letter-spacing: 2px; text-transform: uppercase; margin-top: 1px;">HINDUSTAN PROJECTS</div>
              <div style="font-size: 8px; color: #6B7280; letter-spacing: 0.5px; margin-top: 2px;">Engineering &bull; Construction &bull; Infrastructure</div>
            </div>

            <!-- Contact Details -->
            <table style="border-collapse: collapse; font-size: 12px; color: #374151;">
              <tr>
                <td style="padding: 2px 8px 2px 0; white-space: nowrap;">&#128222;</td>
                <td style="padding: 2px 0;"><a href="tel:+919929120431" style="color: #1A3E8C; text-decoration: none;">+91 99291 20431</a></td>
              </tr>
              <tr>
                <td style="padding: 2px 8px 2px 0; white-space: nowrap;">&#128241;</td>
                <td style="padding: 2px 0;"><a href="https://wa.me/917014796047" style="color: #1A3E8C; text-decoration: none;">+91 70147 96047</a> <span style="color: #6B7280;">(WhatsApp)</span></td>
              </tr>
              <tr>
                <td style="padding: 2px 8px 2px 0; white-space: nowrap;">&#127760;</td>
                <td style="padding: 2px 0;"><a href="https://www.hindustanprojects.in" style="color: #1A3E8C; text-decoration: none;">www.hindustanprojects.in</a></td>
              </tr>
              <tr>
                <td style="padding: 2px 8px 2px 0; white-space: nowrap;">&#128205;</td>
                <td style="padding: 2px 0; color: #374151;">Bhilwara &ndash; 311001, Rajasthan, India</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Social Media Links -->
      <div style="margin-top: 16px;">
        <span style="font-size: 11px; color: #6B7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Follow us:</span>
        &nbsp;
        <a href="https://www.linkedin.com/company/hindustan-projects" style="display: inline-block; background: #0A66C2; color: white; font-size: 11px; font-weight: bold; padding: 3px 9px; border-radius: 4px; text-decoration: none; margin: 2px;">in</a>
        <a href="https://www.facebook.com/hindustanprojects" style="display: inline-block; background: #1877F2; color: white; font-size: 11px; font-weight: bold; padding: 3px 9px; border-radius: 4px; text-decoration: none; margin: 2px;">f</a>
        <a href="https://www.instagram.com/hindustanprojects" style="display: inline-block; background: #E1306C; color: white; font-size: 11px; font-weight: bold; padding: 3px 9px; border-radius: 4px; text-decoration: none; margin: 2px;">&#9678;</a>
        <a href="https://www.youtube.com/@hindustanprojects" style="display: inline-block; background: #FF0000; color: white; font-size: 11px; font-weight: bold; padding: 3px 9px; border-radius: 4px; text-decoration: none; margin: 2px;">&#9654;</a>
      </div>

      <!-- Confidentiality Notice -->
      <div style="margin-top: 16px; padding: 10px 14px; background: #f9fafb; border-left: 3px solid #d1d5db; border-radius: 0 4px 4px 0;">
        <p style="margin: 0; font-size: 10px; color: #9CA3AF; line-height: 1.6;">
          <strong style="color: #6B7280;">CONFIDENTIALITY NOTICE:</strong> This email and any attachments are intended solely for the use of the addressee and may contain confidential information. If you are not the intended recipient, please notify the sender and delete this email immediately.
        </p>
      </div>

      <!-- Copyright -->
      <p style="margin: 12px 0 0; font-size: 10px; color: #9CA3AF; text-align: center;">
        &copy; ${new Date().getFullYear()} Hindustan Projects. All rights reserved. &nbsp;|&nbsp; Bhilwara, Rajasthan, India
      </p>
    </div>
  `
}

// ── Email templates ────────────────────────────────────────────

/**
 * Admin notification email — sent to the company when a lead comes in.
 */
export function adminNotificationTemplate({ name, email, phone, message, serviceInterested }) {
  const service = serviceInterested || 'Not specified'
  const phoneDisplay = phone || 'Not provided'

  return {
    subject: `New Contact Lead: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Lead</h1>
          <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">Hindustan Projects Website</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 35%;">Name</td>
            <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600;">${name}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 4px; color: #6B7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 4px; font-size: 14px;"><a href="mailto:${email}" style="color: #1A3E8C;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Phone</td>
            <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px;">${phoneDisplay}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 4px; color: #6B7280; font-size: 14px;">Service</td>
            <td style="padding: 8px 4px; color: #1A1A1A; font-size: 14px;">${service}</td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 6px; border-left: 4px solid #1A3E8C;">
          <p style="margin: 0 0 8px; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="mailto:${email}" style="display: inline-block; background: #E31E24; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to ${name}</a>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          This lead was submitted via the Hindustan Projects contact form.
        </p>
      </div>
    `,
    text: `New Contact Lead\n\nName: ${name}\nEmail: ${email}\nPhone: ${phoneDisplay}\nService: ${service}\n\nMessage:\n${message}`,
  }
}

/**
 * Auto-reply email — sent to the user confirming their submission.
 */
export function autoReplyTemplate({ name }) {
  const phone = process.env.SITE_PHONE || '+91 99999 99999'
  const email = process.env.EMAIL_FROM
    ? process.env.EMAIL_FROM.replace(/.*<(.+)>/, '$1')
    : process.env.EMAIL_USER || 'info@hindustanprojects.com'
  return {
    subject: 'Thank you for contacting Hindustan Projects',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">
            <span style="color: #E31E24;">Hindustan </span>Projects
          </h1>
        </div>

        <p style="font-size: 16px; color: #1A1A1A;">Hi <strong>${name}</strong>,</p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          Thank you for reaching out to us! We've received your message and our team will contact you within <strong>24 hours</strong>.
        </p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          In the meantime, feel free to explore our services or reach us directly:
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #f0f4ff; border-radius: 6px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #1A1A1A;">📞 <strong>Phone:</strong> ${phone}</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #1A1A1A;">📧 <strong>Email:</strong> ${email}</p>
          <p style="margin: 0; font-size: 14px; color: #1A1A1A;">📍 <strong>Location:</strong> Bhilwara, Rajasthan, India</p>
        </div>

        <p style="font-size: 13px; color: #6B7280; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
          © ${new Date().getFullYear()} Hindustan Projects. All rights reserved.<br>
          Bhilwara, Rajasthan, India
        </p>
      </div>
    `,
    text: `Hi ${name},\n\nThank you for contacting Hindustan Projects!\n\nWe've received your message and will get back to you within 1–2 business days.\n\nRegards,\nHindustan Projects Team\nBhilwara, Rajasthan, India`,
  }
}

/**
 * Admin notification email for a new job application.
 */
export function jobAdminNotificationTemplate({
  jobTitle,
  name,
  email,
  phone,
  resumeUrl,
  coverLetter,
}) {
  const coverLetterDisplay = coverLetter || 'Not provided'

  return {
    subject: `New Job Application: ${name} - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Job Application</h1>
          <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">Hindustan Projects Careers</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 35%;">Applied For</td>
            <td style="padding: 8px 0; color: #1A1A1A; font-size: 14px; font-weight: 600;">${jobTitle}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 4px; color: #6B7280; font-size: 14px;">Applicant Name</td>
            <td style="padding: 8px 4px; color: #1A1A1A; font-size: 14px; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #1A3E8C;">${email}</a></td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px 4px; color: #6B7280; font-size: 14px;">Phone</td>
            <td style="padding: 8px 4px; color: #1A1A1A; font-size: 14px;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Resume / CV</td>
            <td style="padding: 8px 0; font-size: 14px;"><a href="${resumeUrl}" target="_blank" style="color: #E31E24; font-weight: bold; text-decoration: underline;">Download / View Resume</a></td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 6px; border-left: 4px solid #1A3E8C;">
          <p style="margin: 0 0 8px; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Cover Letter / Notes</p>
          <p style="margin: 0; color: #1A1A1A; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${coverLetterDisplay}</p>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="mailto:${email}" style="display: inline-block; background: #1A3E8C; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Email ${name}</a>
        </div>
      </div>
    `,
    text: `New Job Application\n\nJob Title: ${jobTitle}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nResume: ${resumeUrl}\n\nCover Letter:\n${coverLetterDisplay}`,
  }
}

/**
 * Job application confirmation email sent to the applicant.
 */
export function jobApplicantConfirmationTemplate({ name, jobTitle }) {
  return {
    subject: `Application Received: ${jobTitle} at Hindustan Projects`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">
            <span style="color: #E31E24;">Hindustan </span>Projects
          </h1>
        </div>

        <p style="font-size: 16px; color: #1A1A1A;">Dear <strong>${name}</strong>,</p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          Thank you for applying for the <strong>${jobTitle}</strong> position at Hindustan Projects. We have successfully received your job application and resume.
        </p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          Our HR team is currently reviewing applications. If your profile matches our requirements, we will contact you within <strong>24 hours</strong>.
        </p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          We appreciate your interest in building a career with Hindustan Projects!
        </p>

        <p style="font-size: 13px; color: #6B7280; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
          © ${new Date().getFullYear()} Hindustan Projects. All rights reserved.<br>
          Bhilwara, Rajasthan, India
        </p>
      </div>
    `,
    text: `Dear ${name},\n\nThank you for applying for the ${jobTitle} position at Hindustan Projects!\n\nWe have successfully received your application. Our recruitment team will review it and get back to you within 24 hours.\n\nBest regards,\nHindustan Projects HR Team`,
  }
}

/**
 * Admin reminder email for overdue leads.
 */
export function leadFollowUpReminderTemplate({ leads, adminUrl }) {
  const leadsRows = leads.map(lead => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px; font-size: 14px; font-weight: bold; color: #1A1A1A;">${lead.name}</td>
      <td style="padding: 10px; font-size: 14px; color: #374151;"><a href="mailto:${lead.email}" style="color: #1A3E8C;">${lead.email}</a><br><span style="font-size: 12px; color: #6B7280;">${lead.phone || 'No phone'}</span></td>
      <td style="padding: 10px; font-size: 14px; color: #374151;">${lead.serviceInterested || 'Not specified'}</td>
      <td style="padding: 10px; font-size: 12px; color: #6B7280;">${new Date(lead.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('')

  return {
    subject: `⚠️ ACTION REQUIRED: ${leads.length} Unresolved Overdue Leads (>24h)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #E31E24; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Overdue Leads Follow-Up Reminder</h1>
          <p style="color: #ffcccc; margin: 4px 0 0; font-size: 14px;">The following leads have been NEW for over 24 hours</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background: #f3f4f6; text-align: left; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Name</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Contact</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Service</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Created</th>
            </tr>
          </thead>
          <tbody>
            ${leadsRows}
          </tbody>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${adminUrl}" style="display: inline-block; background: #1A3E8C; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">Open Admin Panel leads</a>
        </div>
      </div>
    `,
    text: `Follow-up reminder for ${leads.length} overdue leads. Direct Admin Link: ${adminUrl}`,
  }
}

/**
 * Admin reminder email for stale contacted leads.
 */
export function staleLeadFollowUpTemplate({ leads, adminUrl }) {
  const leadsRows = leads.map(lead => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px; font-size: 14px; font-weight: bold; color: #1A1A1A;">${lead.name}</td>
      <td style="padding: 10px; font-size: 14px; color: #374151;"><a href="mailto:${lead.email}" style="color: #1A3E8C;">${lead.email}</a></td>
      <td style="padding: 10px; font-size: 14px; color: #374151;">${lead.serviceInterested || 'Not specified'}</td>
      <td style="padding: 10px; font-size: 12px; color: #6B7280;">Last contact: ${new Date(lead.updatedAt).toLocaleDateString()}</td>
    </tr>
  `).join('')

  return {
    subject: `🕒 FOLLOW-UP REMINDER: ${leads.length} Stale Contacted Leads (>3 days)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Stale Leads Reminder</h1>
          <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">These leads have been in CONTACTED status for more than 3 days</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background: #f3f4f6; text-align: left; border-bottom: 2px solid #e5e7eb;">
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Name</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Email</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Service</th>
              <th style="padding: 10px; font-size: 13px; color: #4B5563;">Status Date</th>
            </tr>
          </thead>
          <tbody>
            ${leadsRows}
          </tbody>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${adminUrl}" style="display: inline-block; background: #E31E24; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: 600;">Open Admin Leads Dashboard</a>
        </div>
      </div>
    `,
    text: `Stale leads follow-up reminder for ${leads.length} leads. Admin link: ${adminUrl}`,
  }
}

/**
 * Weekly summary report email.
 */
export function weeklySummaryReportTemplate({ stats }) {
  const serviceRows = Object.entries(stats.leadsByService).map(([srv, count]) => `
    <tr>
      <td style="padding: 6px 0; font-size: 14px; color: #374151;">${srv}</td>
      <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #1A1A1A; text-align: right;">${count}</td>
    </tr>
  `).join('')

  const statusRows = Object.entries(stats.appsByStatus).map(([status, count]) => `
    <tr>
      <td style="padding: 6px 0; font-size: 14px; color: #374151;">${status}</td>
      <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #1A1A1A; text-align: right;">${count}</td>
    </tr>
  `).join('')

  return {
    subject: `📊 Weekly Summary Report — Hindustan Projects`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1A3E8C; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Weekly Summary Report</h1>
          <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">Performance breakdown for the past 7 days</p>
        </div>

        <div style="margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="background: #f0f4ff; padding: 15px; border-radius: 6px; text-align: center; border-left: 4px solid #1A3E8C; width: 45%;">
                <p style="margin: 0; font-size: 13px; color: #4B5563; text-transform: uppercase;">New Leads</p>
                <h2 style="margin: 5px 0 0; font-size: 28px; color: #1A3E8C;">${stats.totalNewLeads}</h2>
              </td>
              <td style="width: 10%;">&nbsp;</td>
              <td style="background: #fff0f0; padding: 15px; border-radius: 6px; text-align: center; border-left: 4px solid #E31E24; width: 45%;">
                <p style="margin: 0; font-size: 13px; color: #4B5563; text-transform: uppercase;">Job Apps</p>
                <h2 style="margin: 5px 0 0; font-size: 28px; color: #E31E24;">${stats.totalNewApplications}</h2>
              </td>
            </tr>
          </table>
        </div>

        <h3 style="color: #1A3E8C; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 25px;">Breakdown of Leads by Service</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${serviceRows || '<tr><td style="color: #6B7280; font-size: 14px; padding: 10px 0;">No new leads this week</td></tr>'}
        </table>

        <h3 style="color: #1A3E8C; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 25px;">Breakdown of Job Applications by Status</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${statusRows || '<tr><td style="color: #6B7280; font-size: 14px; padding: 10px 0;">No active job applications</td></tr>'}
        </table>

        <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
          This automated report was generated by Hindustan Projects.
        </p>
      </div>
    `,
    text: `Weekly Summary: New Leads: ${stats.totalNewLeads}, Job Apps: ${stats.totalNewApplications}`,
  }
}

/**
 * Backup failure alert email.
 */
export function dbBackupFailureTemplate({ error }) {
  return {
    subject: `🚨 CRITICAL ALERT: Database Backup Failure`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fecaca; border-radius: 8px;">
        <div style="background: #dc2626; padding: 20px; border-radius: 6px 6px 0 0; margin: -20px -20px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Database Backup Failed</h1>
          <p style="color: #fecaca; margin: 4px 0 0; font-size: 14px;">Immediate administrator attention required</p>
        </div>

        <p style="font-size: 15px; color: #1a1a1a; margin-top: 20px;">
          The nightly automated database backup failed to complete successfully. Below is the error trace captured by the system:
        </p>

        <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 15px 0;">
          <code style="font-size: 13px; color: #991b1b; word-break: break-all;">${error}</code>
        </div>

        <p style="font-size: 14px; color: #4B5563;">
          Please inspect the application logs on the Render Dashboard to diagnose connection timeouts, server memory exhaustion, or SMTP issues.
        </p>
      </div>
    `,
    text: `CRITICAL: Nightly database backup failed. Error: ${error}`,
  }
}
