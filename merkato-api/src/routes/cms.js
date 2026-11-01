import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { requireAdmin, requireUser } from '../middleware/auth.js'

export const cmsRouter = Router()

const recordSchemas = {
  content: z.object({ title: z.string().trim().min(1).max(200), category: z.string().trim().min(1).max(80), summary: z.string().max(1000).default(''), body: z.string().max(100_000).default(''), imageUrl: z.string().max(2000).default(''), status: z.enum(['Draft', 'Published', 'Review']).default('Draft') }),
  slides: z.object({ eyebrow: z.string().max(200).default(''), title: z.string().trim().min(1).max(200), description: z.string().max(2000).default(''), imageUrl: z.string().max(2000).default(''), primaryLabel: z.string().max(100).default('Learn more'), primaryUrl: z.string().max(500).default('/the-fund'), secondaryLabel: z.string().max(100).default(''), secondaryUrl: z.string().max(500).default(''), displayOrder: z.number().int().min(0).default(0), isActive: z.boolean().default(true) }),
  videos: z.object({ title: z.string().trim().min(1).max(200), description: z.string().max(2000).default(''), youtubeUrl: z.string().url().max(2000), status: z.enum(['Draft', 'Published']).default('Draft'), displayOrder: z.number().int().min(0).default(0) }),
  financialTerms: z.object({ title: z.string().trim().min(1).max(200), amount: z.string().max(100), unit: z.string().max(50).default('Birr'), description: z.string().max(2000).default(''), effectiveDate: z.string().date().nullable().optional(), status: z.enum(['Draft', 'Published', 'Changed']).default('Draft') }),
}

const resourceConfig = {
  content: { table: 'content_items', columns: ['title', 'category', 'summary', 'body', 'image_url', 'status'], keys: ['title', 'category', 'summary', 'body', 'imageUrl', 'status'], order: 'updated_at DESC' },
  slides: { table: 'slides', columns: ['eyebrow', 'title', 'description', 'image_url', 'primary_label', 'primary_url', 'secondary_label', 'secondary_url', 'display_order', 'is_active'], keys: ['eyebrow', 'title', 'description', 'imageUrl', 'primaryLabel', 'primaryUrl', 'secondaryLabel', 'secondaryUrl', 'displayOrder', 'isActive'], order: 'display_order ASC' },
  videos: { table: 'videos', columns: ['title', 'description', 'youtube_url', 'status', 'display_order'], keys: ['title', 'description', 'youtubeUrl', 'status', 'displayOrder'], order: 'display_order ASC' },
  financialTerms: { table: 'financial_terms', columns: ['title', 'amount', 'unit', 'description', 'effective_date', 'status'], keys: ['title', 'amount', 'unit', 'description', 'effectiveDate', 'status'], order: 'updated_at DESC' },
}

function mapRecord(row) {
  const result = { id: row.id }
  for (const [key, value] of Object.entries(row)) {
    if (key === 'id') continue
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = value
  }
  return result
}

for (const [resource, config] of Object.entries(resourceConfig)) {
  cmsRouter.get(`/admin/${resource}`, requireUser, requireAdmin, async (_req, res, next) => {
    try {
      const result = await pool.query(`SELECT * FROM ${config.table} ORDER BY ${config.order}`)
      return res.json({ items: result.rows.map(mapRecord) })
    } catch (error) {
      return next(error)
    }
  })

  cmsRouter.post(`/admin/${resource}`, requireUser, requireAdmin, async (req, res, next) => {
    const parsed = recordSchemas[resource].safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid record.' })
    try {
      const values = config.keys.map((key) => parsed.data[key])
      const placeholders = values.map((_, index) => `$${index + 1}`)
      const result = await pool.query(
        `INSERT INTO ${config.table} (${config.columns.join(', ')}, updated_at${resource === 'content' ? ', updated_by' : ''})
         VALUES (${placeholders.join(', ')}, now()${resource === 'content' ? `, $${values.length + 1}` : ''}) RETURNING *`,
        resource === 'content' ? [...values, req.user.id] : values,
      )
      await pool.query('INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)', [req.user.id, 'create', resource, result.rows[0].id])
      return res.status(201).json({ item: mapRecord(result.rows[0]) })
    } catch (error) {
      return next(error)
    }
  })

  cmsRouter.put(`/admin/${resource}/:id`, requireUser, requireAdmin, async (req, res, next) => {
    const parsed = recordSchemas[resource].safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid record.' })
    try {
      const values = config.keys.map((key) => parsed.data[key])
      const assignments = config.columns.map((column, index) => `${column} = $${index + 1}`)
      assignments.push('updated_at = now()')
      if (resource === 'content') assignments.push(`updated_by = $${values.length + 1}`)
      const result = await pool.query(
        `UPDATE ${config.table} SET ${assignments.join(', ')} WHERE id = $${values.length + (resource === 'content' ? 2 : 1)} RETURNING *`,
        resource === 'content' ? [...values, req.user.id, req.params.id] : [...values, req.params.id],
      )
      if (!result.rowCount) return res.status(404).json({ error: 'Record not found.' })
      await pool.query('INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)', [req.user.id, 'update', resource, req.params.id])
      return res.json({ item: mapRecord(result.rows[0]) })
    } catch (error) {
      return next(error)
    }
  })

  cmsRouter.delete(`/admin/${resource}/:id`, requireUser, requireAdmin, async (req, res, next) => {
    try {
      const result = await pool.query(`DELETE FROM ${config.table} WHERE id = $1 RETURNING id`, [req.params.id])
      if (!result.rowCount) return res.status(404).json({ error: 'Record not found.' })
      await pool.query('INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)', [req.user.id, 'delete', resource, req.params.id])
      return res.status(204).end()
    } catch (error) {
      return next(error)
    }
  })
}

cmsRouter.get('/admin/site-settings', requireUser, requireAdmin, async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT key, value, status, updated_at FROM site_settings ORDER BY key')
    return res.json({ settings: result.rows })
  } catch (error) {
    return next(error)
  }
})

cmsRouter.put('/admin/site-settings/:key', requireUser, requireAdmin, async (req, res, next) => {
  const parsed = z.object({ value: z.unknown(), status: z.enum(['Draft', 'Published']).default('Draft') }).safeParse(req.body)
  if (!parsed.success || !/^[a-z][a-z0-9_-]{1,63}$/.test(req.params.key)) return res.status(400).json({ error: 'Invalid site setting.' })
  try {
    const result = await pool.query(
      `INSERT INTO site_settings (key, value, status) VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, status = EXCLUDED.status, updated_at = now()
       RETURNING key, value, status, updated_at`,
      [req.params.key, JSON.stringify(parsed.data.value), parsed.data.status],
    )
    await pool.query('INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)', [req.user.id, 'update', 'site_settings', req.params.key])
    return res.json({ setting: result.rows[0] })
  } catch (error) {
    return next(error)
  }
})

cmsRouter.get('/public/site-data', async (_req, res, next) => {
  try {
    const [content, slides, videos, terms, settings] = await Promise.all([
      pool.query("SELECT * FROM content_items WHERE status = 'Published' ORDER BY updated_at DESC"),
      pool.query('SELECT * FROM slides WHERE is_active = true ORDER BY display_order ASC'),
      pool.query("SELECT * FROM videos WHERE status = 'Published' ORDER BY display_order ASC"),
      pool.query("SELECT * FROM financial_terms WHERE status IN ('Published', 'Changed') ORDER BY updated_at DESC"),
      pool.query("SELECT key, value FROM site_settings WHERE status = 'Published' ORDER BY key"),
    ])
    return res.json({
      content: content.rows.map(mapRecord),
      slides: slides.rows.map(mapRecord),
      videos: videos.rows.map(mapRecord),
      financialTerms: terms.rows.map(mapRecord),
      settings: Object.fromEntries(settings.rows.map((row) => [row.key, row.value])),
    })
  } catch (error) {
    return next(error)
  }
})
