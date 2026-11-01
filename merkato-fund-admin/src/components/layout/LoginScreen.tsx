import { useState, type FormEvent } from 'react'
import { apiRequest, type AuthUser } from '../../lib/api'
import { Button } from '../ui/Button'

export function LoginScreen({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      const result = await apiRequest<{ user: AuthUser }>('/auth/login', { method: 'POST', body: { email: form.get('email'), password: form.get('password') } })
      if (result.user.role !== 'admin') {
        await apiRequest('/auth/logout', { method: 'POST' })
        throw new Error('This account does not have administrator access.')
      }
      onLogin(result.user)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page">
    <a className="auth-brand" href="/" aria-label="Merkato Fund home"><span className="auth-brand-mark">M</span><span>MERKATO <strong>FUND</strong></span></a>
    <section className="auth-card">
      <div className="auth-card-mark" aria-hidden="true">M</div>
      <p className="auth-eyebrow">ADMINISTRATOR ACCESS</p>
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Sign in to manage Merkato Fund website content.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">Email address<input name="email" type="email" autoComplete="username" required /></label>
        <label className="auth-field">Password<div className="auth-password"><input name="password" type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" required /><button type="button" onClick={() => setPasswordVisible(!passwordVisible)} aria-label={passwordVisible ? 'Hide password' : 'Show password'}>{passwordVisible ? 'Hide' : 'Show'}</button></div></label>
        <div className="auth-form-row"><label><input type="checkbox" /> Remember me</label><a href="/forgot-password">Forgot password?</a></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Button type="submit" kind="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'}</Button>
      </form>
      <p className="auth-secure-note"><span aria-hidden="true">✓</span> Authorized administrator access only</p>
      <a href="/" className="auth-back">Return to website</a>
    </section>
  </main>
}