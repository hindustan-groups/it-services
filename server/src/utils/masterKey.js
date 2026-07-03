/**
 * masterKey.js — Integration Master Key verification utility
 *
 * Centralises master key lookup and comparison so the logic is not
 * duplicated across integration.controller.js and admin.controller.js.
 *
 * Key resolution order:
 *  1. DB (sys_integration_master_key) — updated via Account Settings
 *  2. INTEGRATION_MASTER_KEY env var  — set in .env / hosting platform
 *  3. No fallback to JWT_SECRET — that would link two unrelated secrets
 */

import { timingSafeEqual } from 'crypto'
import prisma from '../config/db.js'
import { env } from '../config/env.js'

/**
 * Resolve the current master key from DB or env.
 * Returns null if not configured — callers should return 500.
 */
export async function resolveMasterKey() {
  const dbRow = await prisma.siteSetting.findUnique({
    where: { key: 'sys_integration_master_key' },
  })
  return dbRow?.value || env.INTEGRATION_MASTER_KEY || null
}

/**
 * Constant-time comparison of inputKey against the configured master key.
 * Returns { match: boolean, masterKey: string|null }
 */
export async function verifyMasterKey(inputKey) {
  const masterKey = await resolveMasterKey()

  if (!masterKey) return { match: false, masterKey: null }

  const inputBuf = Buffer.from((inputKey || '').trim())
  const masterBuf = Buffer.from(masterKey)

  let match = false
  if (inputBuf.length === masterBuf.length) {
    match = timingSafeEqual(inputBuf, masterBuf)
  }

  return { match, masterKey }
}
