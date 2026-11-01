import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { pool } from './db/pool.js'
import { allowedOrigins, isAllowedOrigin } from './lib/security.js'
import { authRouter } from './routes/auth.js'
import { cmsRouter } from './routes/cms.js'
import { translateRouter } from './routes/translate.js'

const app = express()
const origins = allowedOrigins()

app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin, origins) ? origin || false : false), credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin')
    if (!isAllowedOrigin(origin, origins)) return res.status(403).json({ error: 'Request origin is not allowed.' })
  }
  next()
})

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false })
const requiredTables = ['users', 'sessions', 'password_resets', 'content_items', 'slides', 'videos', 'financial_terms', 'site_settings', 'audit_log']

async function checkDatabaseReady() {
  await pool.query('SELECT 1')
  const result = await pool.query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_name = ANY($2::text[])',
    ['public', requiredTables],
  )
  const existingTables = new Set(result.rows.map((row) => row.table_name))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))
  if (missingTables.length) {
    throw new Error(`Database schema is incomplete. Run "npm run db:migrate". Missing tables: ${missingTables.join(', ')}`)
  }
}

let databaseReady = null

export function ensureDatabaseReady() {
  if (!databaseReady) {
    databaseReady = checkDatabaseReady().catch((error) => {
      databaseReady = null
      throw error
    })
  }
  return databaseReady
}

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1')
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return next(error)
  }
})

app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseReady()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/auth', authLimiter, authRouter)
app.use('/api/translate', translateRouter)
app.use('/api', cmsRouter)
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found.' }))
app.use((error, _req, res, _next) => {
  console.error('Request failed:', error.message)
  return res.status(500).json({ error: 'An unexpected server error occurred.' })
})

export default app
