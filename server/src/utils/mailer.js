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
async function sendViaResend({ to, subject, html, text }) {
  const resend = new Resend(env.RESEND_API_KEY)
  const from = env.EMAIL_FROM || 'Hindustan Projects <info@hindustanprojects.in>'

  const { data, error } = await resend.emails.send({ from, to, subject, html, text })
  if (error) throw new Error(error.message || 'Resend send failed')
  return { messageId: data?.id }
}

// ── Nodemailer SMTP sender ─────────────────────────────────────
async function sendViaSMTP({ to, subject, html, text }) {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST || 'smtp.gmail.com',
    port: env.EMAIL_PORT || 587,
    secure: env.EMAIL_PORT === 465,
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  })
  const from = env.EMAIL_FROM || `"Hindustan Projects" <${env.EMAIL_USER}>`
  const info = await transporter.sendMail({ from, to, subject, html, text })
  return info
}

/**
 * sendEmail — unified send function.
 * Automatically picks Resend → SMTP → console based on env config.
 *
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
export async function sendEmail({ to, subject, html, text }) {
  const strategy = getStrategy()

  if (strategy === 'console') {
    console.log('\n📧 [DEV — EMAIL NOT SENT — LOG ONLY]')
    console.log(`  To:       ${to}`)
    console.log(`  Subject:  ${subject}`)
    console.log(`  Body:     ${text || '(html only)'}`)
    console.log('─────────────────────────────────────\n')
    return { messageId: 'dev-console-log' }
  }

  if (strategy === 'resend') {
    return sendViaResend({ to, subject, html, text })
  }

  return sendViaSMTP({ to, subject, html, text })
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
          Thank you for reaching out to us! We've received your message and our team will get back to you within <strong>1–2 business days</strong>.
        </p>

        <p style="font-size: 15px; color: #374151; line-height: 1.7;">
          In the meantime, feel free to explore our services or reach us directly:
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #f0f4ff; border-radius: 6px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #1A1A1A;">📞 <strong>Phone:</strong> +91 XXXXX XXXXX</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #1A1A1A;">📧 <strong>Email:</strong> info@hindustanprojects.com</p>
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
          Our HR team is currently reviewing applications. If your profile matches our requirements, we will contact you within <strong>7 business days</strong> to schedule a technical interview.
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
    text: `Dear ${name},\n\nThank you for applying for the ${jobTitle} position at Hindustan Projects!\n\nWe have successfully received your application. Our recruitment team will review it and get back to you if you are shortlisted.\n\nBest regards,\nHindustan Projects HR Team`,
  }
}
