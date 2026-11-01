const apiUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')).replace(/\/$/, '')

export type AuthUser = { id: string; email: string; fullName: string; role: 'participant' | 'admin' }

type ApiOptions = Omit<RequestInit, 'body'> & { body?: unknown }

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiUrl}/api${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new Error(`Cannot reach the Merkato API at ${apiUrl}. Start the API and check VITE_API_URL and the API's CORS settings.`)
  }
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error || 'The request could not be completed.')
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
