import nodemailer from 'nodemailer'

function createTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD
  if (!host || !user || !password) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass: password },
  })
}

export async function sendPasswordResetEmail(email, token) {
  const transport = createTransport()
  if (!transport) throw new Error('Password reset email is not configured.')

  const resetUrl = new URL('/reset-password', process.env.ADMIN_SITE_URL || process.env.PUBLIC_SITE_URL || 'http://localhost:5174')
  resetUrl.searchParams.set('token', token)

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Reset your Merkato Fund password',
    text: `Use this link within ${process.env.PASSWORD_RESET_TTL_MINUTES || 30} minutes to reset your password: ${resetUrl}`,
    html: `<p>Use the link below to reset your Merkato Fund password. It expires in ${process.env.PASSWORD_RESET_TTL_MINUTES || 30} minutes.</p><p><a href="${resetUrl}">Reset password</a></p>`,
  })
}
