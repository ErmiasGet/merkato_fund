import { useState } from 'react'
import { deleteAdminRecord, useCms } from '../../lib/cms'
import type { ConfirmHandler, PageChangeHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'

export function ContentManagementPage({ go, confirm, editContent }: { go: PageChangeHandler; confirm: ConfirmHandler; editContent: (id: string) => void }) {
  const { content, loading, error, reload } = useCms()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [actionError, setActionError] = useState('')
  const rows = content.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || item.status === status))

  const remove = async (id: string) => {
    setActionError('')
    try {
      await deleteAdminRecord('content', id)
      await reload()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete content.')
    }
  }

  return <>
    <PageTitle title="Manage Website Content" subtitle="Create, edit, publish, and organize information on the public website."><Button kind="primary" onClick={() => go('Upload Information')}>＋ Add new information</Button></PageTitle>
    <article className="panel table-panel">
      <div className="filters"><label>⌕<input placeholder="Search content by title…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-select"><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Draft</option><option>Published</option><option>Review</option></select></label><span>{rows.length} content items</span></div>
      {(error || actionError) && <p className="auth-error" role="alert">{actionError || error}</p>}
      {loading && <p role="status">Loading content…</p>}
      <div className="table-wrap"><table><thead><tr><th>Content title</th><th>Category</th><th>Last updated</th><th>Publication status</th><th>Actions</th></tr></thead><tbody>
        {rows.map((item, index) => <tr key={item.id}><td><div className="content-title"><span>{['▤', '⌁', '◇', '○', '?'][index % 5]}</span><div><strong>{item.title}</strong><small>/content/{item.title.toLowerCase().replaceAll(' ', '-')}</small></div></div></td><td>{item.category}</td><td>{new Date(item.updatedAt).toLocaleString()}</td><td><Badge tone={item.status === 'Published' ? 'success' : item.status === 'Draft' ? 'neutral' : 'warning'}>{item.status}</Badge></td><td><div className="row-actions"><button onClick={() => editContent(item.id)}>Edit</button><button onClick={() => window.open(`/content/${item.id}`, '_blank', 'noopener,noreferrer')}>Preview</button><button className="more" onClick={() => confirm('Delete this content?', `Permanently remove “${item.title}”?`, () => remove(item.id))}>Delete</button></div></td></tr>)}
        {!loading && rows.length === 0 && <tr><td colSpan={5}>No content matches these filters.</td></tr>}
      </tbody></table></div>
      <div className="pagination"><span>Showing {rows.length} of {content.length}</span><div /></div>
    </article>
  </>
}