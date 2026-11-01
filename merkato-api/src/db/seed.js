import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from './pool.js'

const seedContent = [
  ['Building productive capital together', 'Homepage', 'Learn about responsible participation and productive-capital opportunities.', 'Published'],
  ['How Merkato Fund works', 'How It Works', 'Understand participation, eligibility, and the proposed process.', 'Published'],
  ['Participation requirements', 'Financial information', 'Review the proposed participation requirements.', 'Draft'],
  ['Our mission and vision', 'About Us', 'Learn about the organization and its purpose.', 'Published'],
]

const seedSlides = [
  ['Financial opportunity', 'Your Ambition. Your Future. Your Opportunity.', 'Discover a structured financial opportunity designed to help eligible participants pursue business growth and long-term economic stability.', 'https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?auto=format&fit=crop&w=2000&q=88', 'Explore the Fund', '/the-fund', 'How It Works', '/how-it-works', 0],
  ['Empowering businesses', 'Small Contributions. Bigger Ambitions.', 'Explore how a structured contribution model can support business aspirations, subject to eligibility and fund conditions.', 'https://images.unsplash.com/photo-1572793792870-22f51f2f7e75?auto=format&fit=crop&w=2000&q=88', 'Understand the Model', '/the-fund', 'Learn More', '/about-us', 1],
  ['Building a stronger future', 'Invest in Your Vision.', 'Understand the requirements, responsibilities, and opportunities before making your financial decision.', 'https://images.unsplash.com/photo-1705993235926-d274cca24ff5?auto=format&fit=crop&w=2000&q=88', 'View Requirements', '/transparency', 'Contact Us', '/contact', 2],
]

const seedTerms = [
  ['Initial daily contribution', '50 Birr', 'Before qualifying payout'],
  ['Daily obligation after payout', '500 Birr', 'Following qualifying payout'],
  ['Administrative fee', '50 Birr', 'Timing and recurrence to be verified'],
  ['Stated monthly obligation', '15,000 Birr', 'Based on a 30-day month'],
  ['Required reserve', '7,500 Birr', 'Proposed replenishment every 15 days'],
]

try {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const contentCount = await client.query('SELECT count(*)::int AS count FROM content_items')
    if (!contentCount.rows[0].count) {
      for (const [title, category, summary, status] of seedContent) {
        await client.query('INSERT INTO content_items (title, category, summary, status) VALUES ($1, $2, $3, $4)', [title, category, summary, status])
      }
    }
    const slideCount = await client.query('SELECT count(*)::int AS count FROM slides')
    if (!slideCount.rows[0].count) {
      for (const [eyebrow, title, description, image, primaryLabel, primaryUrl, secondaryLabel, secondaryUrl, order] of seedSlides) {
        await client.query('INSERT INTO slides (eyebrow, title, description, image_url, primary_label, primary_url, secondary_label, secondary_url, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [eyebrow, title, description, image, primaryLabel, primaryUrl, secondaryLabel, secondaryUrl, order])
      }
    }
    const termsCount = await client.query('SELECT count(*)::int AS count FROM financial_terms')
    if (!termsCount.rows[0].count) {
      for (const [title, amount, description] of seedTerms) {
        await client.query('INSERT INTO financial_terms (title, amount, description, status) VALUES ($1, $2, $3, \'Published\')', [title, amount, description])
      }
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword && adminPassword.length >= 16) {
    const hash = await bcrypt.hash(adminPassword, 12)
    const result = await pool.query(
      `INSERT INTO users (email, full_name, password_hash, role)
       VALUES ($1, 'Merkato Administrator', $2, 'admin')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [adminEmail, hash],
    )
    if (result.rowCount) console.log(`Initial administrator created for ${adminEmail}.`)
  } else {
    console.warn('Admin bootstrap skipped: configure ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters.')
  }
  console.log('Initial CMS content seeded.')
} catch (error) {
  console.error('Database seed failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
