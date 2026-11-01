import { createHash, randomBytes } from 'node:crypto'

export function createOpaqueToken() {
  return randomBytes(32).toString('base64url')
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    path: '/',
    maxAge,
  }
}

export function allowedOrigins() {
  const configuredOrigins = (process.env.WEB_ORIGINS || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const localDevOrigins = process.env.NODE_ENV === 'production'
    ? []
    : ['http://127.0.0.1:5173', 'http://127.0.0.1:5174']
  return [...new Set([...configuredOrigins, ...localDevOrigins])]
}

export function isAllowedOrigin(origin, configuredOrigins = allowedOrigins()) {
  if (!origin) return false
  if (configuredOrigins.includes(origin)) return true
  if (process.env.NODE_ENV === 'production') return false

  try {
    const parsedOrigin = new URL(origin)
    return ['localhost', '127.0.0.1', '[::1]'].includes(parsedOrigin.hostname)
  } catch {
    return false
  }
}
