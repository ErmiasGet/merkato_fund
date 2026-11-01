import { useState, type FormEvent } from 'react'
import { apiRequest } from '../../lib/api'
import { Button } from '../ui/Button'

export function AdminRecoveryPage({ reset }: { reset: boolean }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      const result = await apiRequest<{ message: string }>(reset ? '/auth/reset-password' : '/auth/forgot-password', {
        method: 'POST',
        body: reset
          ? { token: new URLSearchParams(window.location.search).get('token'), password: form.get('password') }
          : { email: form.get('email') },
      })
      setMessage(result.message)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to continue.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page">
    <a className="auth-brand" href="/" aria-label="Merkato Fund home"><span className="auth-brand-mark">M</span><span>MERKATO <strong>FUND</strong></span></a>
    <section className="auth-card">
      <div className="auth-card-mark" aria-hidden="true">M</div>
      <p className="auth-eyebrow">{reset ? 'PASSWORD RESET' : 'ACCOUNT RECOVERY'}</p>
      <h1>{reset ? 'Choose a new password' : 'Forgot password?'}</h1>
      <p className="auth-subtitle">{reset ? 'Reset links expire after a short time and can only be used once.' : 'Enter your administrator email address. We will send a reset link if it is associated with an account.'}</p>
      <form onSubmit={submit} className="auth-form">
        {reset ? <label className="auth-field">New password<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label> : <label className="auth-field">Email address<input name="email" type="email" autoComplete="email" required /></label>}
        {error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-success" role="status">{message}</p>}
        <Button type="submit" kind="primary" disabled={busy || Boolean(message)}>{busy ? 'Please wait…' : reset ? 'Update password' : 'Send reset link'}</Button>
      </form>
      <a href="/login" className="auth-back">Back to administrator sign in</a>
    </section>
  </main>
}
