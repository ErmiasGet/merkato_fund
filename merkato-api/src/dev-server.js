import 'dotenv/config'
import app, { ensureDatabaseReady } from './expressApp.js'
import { pool } from './db/pool.js'

const port = Number(process.env.PORT || 4000)

async function start() {
  try {
    await ensureDatabaseReady()
  } catch (error) {
    console.error(`Merkato API startup blocked: ${error.message}`)
    if (error.code === '28P01') console.error('The database rejected the credentials. Copy the full Supabase PostgreSQL connection URI from Project Settings > Database > Connect into merkato-api/.env as DATABASE_URL.')
    else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') console.error('Check the database host, network access, and DATABASE_SSL setting in merkato-api/.env.')
    await pool.end()
    process.exitCode = 1
    return
  }

  const server = app.listen(port, () => console.log(`Merkato API ready at http://localhost:${port} (database connected)`))

  async function shutdown() {
    server.close(async () => {
      await pool.end()
      process.exit(0)
    })
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

void start()
