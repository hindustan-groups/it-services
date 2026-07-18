/**
 * leadsImport.controller.js — Handles bulk importing leads from uploaded CSV files
 */
import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'

// Custom, robust CSV parser supporting double quotes and comma separation
const parseCSV = (buffer) => {
  const text = buffer.toString('utf8')
  const lines = []
  let row = ['']
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"'
        i++ // skip double-quote escape
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      row.push('')
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++ // handle CRLF
      }
      if (row.length > 1 || row[0] !== '') {
        lines.push(row.map((cell) => cell.trim()))
      }
      row = ['']
    } else {
      row[row.length - 1] += c
    }
  }

  if (row.length > 1 || row[0] !== '') {
    lines.push(row.map((cell) => cell.trim()))
  }

  return lines
}

// POST /api/admin/leads/import
export const bulkImportLeads = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Please upload a CSV file.' })
    }

    const rows = parseCSV(req.file.buffer)

    if (rows.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'The uploaded CSV file is empty or contains no header row.',
      })
    }

    const headerRow = rows[0].map((h) => h.toLowerCase())

    // Map column headers to database fields
    const nameIdx = headerRow.indexOf('name')
    const emailIdx = headerRow.indexOf('email')
    const phoneIdx = headerRow.indexOf('phone')
    const messageIdx = headerRow.indexOf('message')
    const serviceIdx = headerRow.includes('service interested')
      ? headerRow.indexOf('service interested')
      : headerRow.indexOf('service')
    const statusIdx = headerRow.indexOf('status')
    const notesIdx = headerRow.indexOf('notes')
    const budgetIdx = headerRow.includes('estimated budget')
      ? headerRow.indexOf('estimated budget')
      : headerRow.indexOf('budget')

    if (nameIdx === -1 && emailIdx === -1) {
      return res.status(400).json({
        status: 'error',
        message: 'CSV header must contain at least "Name" or "Email" columns.',
      })
    }

    const allowedStatuses = ['NEW', 'CONTACTED', 'CLOSED']
    const records = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length === 0 || (row.length === 1 && row[0] === '')) {
        continue // skip blank line
      }

      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : ''
      const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx] : ''

      // Skip lines with missing name and email
      if (!name && !email) continue

      let status = statusIdx !== -1 && row[statusIdx] ? row[statusIdx].toUpperCase() : 'NEW'
      if (!allowedStatuses.includes(status)) {
        status = 'NEW'
      }

      records.push({
        name: name || 'Unnamed Lead',
        email: email || 'no-email@example.com',
        phone: phoneIdx !== -1 ? row[phoneIdx] : null,
        message: messageIdx !== -1 && row[messageIdx] ? row[messageIdx] : 'Bulk imported lead.',
        serviceInterested: serviceIdx !== -1 ? row[serviceIdx] : null,
        status: status,
        notes: notesIdx !== -1 ? row[notesIdx] : '',
        estimatedBudget: budgetIdx !== -1 ? row[budgetIdx] : '',
      })
    }

    if (records.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid lead records found in the uploaded file.',
      })
    }

    // Perform database insertion in bulk
    const result = await prisma.contactLead.createMany({
      data: records,
    })

    await logActivity(req, 'CREATE', 'ContactLead', `Bulk imported ${result.count} leads from CSV file.`)

    res.json({
      status: 'ok',
      message: `Successfully imported ${result.count} leads from CSV file.`,
      count: result.count,
    })
  } catch (err) {
    next(err)
  }
}
