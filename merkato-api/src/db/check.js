import 'dotenv/config'

const requiredTables = ['users', 'sessions', 'password_resets', 'content_items', 'slides', 'videos', 'financial_terms', 'site_settings', 'audit_log']

if (!process.env.DATABASE_URL) {
  console.error('Database check failed: DATABASE_URL is missing. Set it in merkato-api/.env using the PostgreSQL URI from Supabase Project Settings > Database > Connect.')
  process.exitCode = 1
} else {
  const { pool } = await import('./pool.js')
try {
  const connection = await pool.query('SELECT current_database() AS database, current_user AS username')
  const tables = await pool.query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_name = ANY($2::text[])',
    ['public', requiredTables],
  )
  const existingTables = new Set(tables.rows.map((row) => row.table_name))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))
  if (missingTables.length) {
    throw new Error(`Connected to database "${connection.rows[0].database}", but schema is incomplete. Run npm run db:migrate. Missing: ${missingTables.join(', ')}`)
  }
  console.log(`Database connected; schema ready in "${connection.rows[0].database}".`)
} catch (error) {
  console.error('Database check failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
}