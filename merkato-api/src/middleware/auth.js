import { hashToken } from '../lib/security.js'
import { pool } from '../db/pool.js'

export async function requireUser(req, res, next) {
  const sessionToken = req.cookies[process.env.SESSION_COOKIE_NAME || 'merkato_session']
  if (!sessionToken) return res.status(401).json({ error: 'Authentication required.' })

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > now()`,
      [hashToken(sessionToken)],
    )
    if (!result.rowCount) return res.status(401).json({ error: 'Session expired. Please sign in again.' })
    req.user = result.rows[0]
    return next()
  } catch (error) {
    return next(error)
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' })
  return next()
}
