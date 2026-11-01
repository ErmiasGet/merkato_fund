import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { sendPasswordResetEmail } from '../lib/mailer.js'
import { cookieOptions, createOpaqueToken, hashToken } from '../lib/security.js'
import { requireUser } from '../middleware/auth.js'

export const authRouter = Router()

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
})
const signupSchema = credentialsSchema.extend({ fullName: z.string().trim().min(2).max(120) })
const resetSchema = z.object({ token: z.string().min(40).max(100), password: z.string().min(12).max(128) })
const cookieName = () => process.env.SESSION_COOKIE_NAME || 'merkato_session'
const sessionTtlDays = () => Math.min(30, Math.max(1, Number(process.env.SESSION_TTL_DAYS || 7)))

async function createSession(userId, res) {
  const token = createOpaqueToken()
  const expiresAt = new Date(Date.now() + sessionTtlDays() * 24 * 60 * 60 * 1000)
  await pool.query('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [userId, hashToken(token), expiresAt])
  res.cookie(cookieName(), token, cookieOptions(sessionTtlDays() * 24 * 60 * 60 * 1000))
}

function publicUser(user) {
  return { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
}

authRouter.post('/signup', async (req, res, next) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid signup details.' })

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const result = await pool.query(
      `INSERT INTO users (email, full_name, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, full_name, role`,
      [parsed.data.email, parsed.data.fullName, passwordHash],
    )
    if (!result.rowCount) return res.status(409).json({ error: 'An account with this email already exists.' })
    await createSession(result.rows[0].id, res)
    return res.status(201).json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    return next(error)
  }
})

authRouter.post('/login', async (req, res, next) => {
  const parsed = credentialsSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email and password.' })

  try {
    const result = await pool.query('SELECT id, email, full_name, password_hash, role FROM users WHERE email = $1', [parsed.data.email])
    const user = result.rows[0]
    const passwordMatches = user ? await bcrypt.compare(parsed.data.password, user.password_hash) : false
    if (!passwordMatches) return res.status(401).json({ error: 'Email or password is incorrect.' })
    await createSession(user.id, res)
    return res.json({ user: publicUser(user) })
  } catch (error) {
    return next(error)
  }
})

authRouter.post('/logout', requireUser, async (req, res, next) => {
  const token = req.cookies[cookieName()]
  try {
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)])
    res.clearCookie(cookieName(), cookieOptions())
    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
})

authRouter.get('/me', requireUser, (req, res) => res.json({ user: req.user }))

authRouter.post('/forgot-password', async (req, res, next) => {
  const parsed = z.object({ email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email address.' })

  try {
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [parsed.data.email])
    if (result.rowCount) {
      const token = createOpaqueToken()
      const ttlMinutes = Math.min(120, Math.max(5, Number(process.env.PASSWORD_RESET_TTL_MINUTES || 30)))
      await pool.query('DELETE FROM password_resets WHERE user_id = $1 AND used_at IS NULL', [result.rows[0].id])
      await pool.query(
        'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, now() + ($3 * interval \'1 minute\'))',
        [result.rows[0].id, hashToken(token), ttlMinutes],
      )
      try {
        await sendPasswordResetEmail(result.rows[0].email, token)
      } catch (mailError) {
        console.error('Unable to deliver password reset email:', mailError.message)
      }
    }
    return res.json({ message: 'If an account exists for that email, password reset instructions will be sent.' })
  } catch (error) {
    return next(error)
  }
})

authRouter.post('/reset-password', async (req, res, next) => {
  const parsed = resetSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'The reset link or new password is invalid.' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const resetResult = await client.query(
      'SELECT id, user_id FROM password_resets WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() FOR UPDATE',
      [hashToken(parsed.data.token)],
    )
    const reset = resetResult.rows[0]
    if (!reset) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'This password reset link is invalid or expired.' })
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    await client.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, reset.user_id])
    await client.query('UPDATE password_resets SET used_at = now() WHERE user_id = $1 AND used_at IS NULL', [reset.user_id])
    await client.query('DELETE FROM sessions WHERE user_id = $1', [reset.user_id])
    await client.query('COMMIT')
    res.clearCookie(cookieName(), cookieOptions())
    return res.json({ message: 'Password updated. Sign in with your new password.' })
  } catch (error) {
    await client.query('ROLLBACK')
    return next(error)
  } finally {
    client.release()
  }
})
