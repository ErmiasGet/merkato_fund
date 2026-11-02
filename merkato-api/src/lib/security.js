import { createHash, randomBytes } from 'node:crypto'

export function createOpaqueToken() {
  return randomBytes(32).toString('base64url')
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

const BUILTIN_PRODUCTION_ORIGINS = [
  'https://merkato-fund-mjrx.vercel.app',
  'https://merkato-fund-ccbi.vercel.app',
]

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
    path: '/',
    maxAge,
  }
}

export function allowedOrigins() {
  const configuredOrigins = (process.env.WEB_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const builtinOrigins = process.env.NODE_ENV === 'production'
    ? BUILTIN_PRODUCTION_ORIGINS
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
  return [...new Set([...configuredOrigins, ...builtinOrigins])]
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

const VERCEL_APP_ORIGIN = /^https:\/\/merkato-?fund[^.]*\.vercel\.app$/i

export function isTrustedRequestOrigin(origin, configuredOrigins = allowedOrigins()) {
  if (isAllowedOrigin(origin, configuredOrigins)) return true
  return Boolean(origin && process.env.NODE_ENV === 'production' && VERCEL_APP_ORIGIN.test(origin))
}
