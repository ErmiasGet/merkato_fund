import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { pool } from './pool.js'

try {
  const migrationUrl = new URL('./migrations/001_initial.sql', import.meta.url)
  const migration = await readFile(fileURLToPath(migrationUrl), 'utf8')
  await pool.query(migration)
  console.log('Database migration applied.')
} catch (error) {
  console.error('Database migration failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
