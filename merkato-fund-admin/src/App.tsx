import { useEffect, useState } from 'react'
import { AdminRecoveryPage } from './components/layout/AdminRecoveryPage'
import { LoginScreen } from './components/layout/LoginScreen'
import { PageRouter } from './components/layout/PageRouter'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { ConfirmDialog } from './components/ui/ConfirmDialog'
import type { Page } from './types/admin'
import { apiRequest, type AuthUser } from './lib/api'
import { CmsProvider } from './lib/cms'

type PendingDialog = { title: string; text: string; onConfirm?: () => void | Promise<void> }

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [page, setPage] = useState<Page>('Dashboard')
  const [editingContentId, setEditingContentId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [pendingDialog, setPendingDialog] = useState<PendingDialog | null>(null)

  useEffect(() => {
    apiRequest<{ user: AuthUser }>('/auth/me')
      .then(({ user: currentUser }) => {
        if (currentUser.role === 'admin') setUser(currentUser)
        else void apiRequest('/auth/logout', { method: 'POST' })
      })
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true))
  }, [])

  if (window.location.pathname === '/forgot-password' || window.location.pathname === '/reset-password') {
    return <AdminRecoveryPage reset={window.location.pathname === '/reset-password'} />
  }

  if (!authChecked) return <div className="auth-loading" role="status">Checking secure session…</div>
  if (!user) return <LoginScreen onLogin={setUser} />

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }

  const navigateTo = (nextPage: Page) => {
    if (nextPage === 'Upload Information') setEditingContentId(null)
    setPage(nextPage)
    setMenuOpen(false)
  }

  const editContent = (id: string) => {
    setEditingContentId(id)
    setPage('Upload Information')
    setMenuOpen(false)
  }

  const notify = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(''), 2200)
  }

  const askForConfirmation = (title: string, text: string, onConfirm?: () => void | Promise<void>) => setPendingDialog({ title, text, onConfirm })

  const confirmDialog = async () => {
    if (!pendingDialog) return
    const action = pendingDialog.onConfirm
    const title = pendingDialog.title
    setPendingDialog(null)
    try {
      await action?.()
      notify(title.includes('Publish') ? 'Changes published' : action ? 'Change saved' : 'Content deleted')
    } catch (actionError) {
      notify(actionError instanceof Error ? actionError.message : 'The requested action failed.')
    }
  }

  return <CmsProvider><div className="app">
    <Sidebar page={page} setPage={navigateTo} onLogout={() => void logout()} open={menuOpen} user={user} />
    <div className="main">
      <Topbar page={page} onMenu={() => setMenuOpen(!menuOpen)} />
      <main className="content"><PageRouter page={page} go={navigateTo} notify={notify} confirm={askForConfirmation} editContent={editContent} editingContentId={editingContentId} /></main>
    </div>
    {toastMessage && <div className="toast"><span>✓</span><div><strong>{toastMessage}</strong><small>The public website workflow has been updated.</small></div></div>}
    {pendingDialog && <ConfirmDialog {...pendingDialog} close={() => setPendingDialog(null)} confirm={confirmDialog} />}
  </div></CmsProvider>
}