import { useState, type FormEvent } from 'react'
import { createAdminRecord, updateAdminRecord, useCms } from '../../lib/cms'
import type { NotifyHandler, PageChangeHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'
import { PanelHead } from '../ui/PanelHead'

export function ContentEditorPage({ go, notify, contentId }: { go: PageChangeHandler; notify: NotifyHandler; contentId: string | null }) {
  const { content, reload } = useCms()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const item = content.find((record) => record.id === contentId)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const status = submitter instanceof HTMLButtonElement ? submitter.value : 'Draft'
    const publicationStatus: 'Draft' | 'Published' = status === 'Published' ? 'Published' : 'Draft'
    const payload = {
      title: String(form.get('title') ?? ''),
      category: String(form.get('category') ?? ''),
      summary: String(form.get('summary') ?? ''),
      body: String(form.get('body') ?? ''),
      imageUrl: String(form.get('imageUrl') ?? ''),
      status: publicationStatus,
    }
    try {
      if (item) await updateAdminRecord('content', item.id, payload)
      else await createAdminRecord('content', payload)
      await reload()
      notify(publicationStatus === 'Published' ? 'Content published on the public website' : item ? 'Content updated' : 'Draft saved')
      go('Content Management')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save content.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <PageTitle title={item ? 'Edit Website Content' : 'Upload Information'} subtitle="Create or edit content to display on the public website."><Button onClick={() => go('Content Management')}>Cancel</Button><Button type="submit" form="content-editor" name="status" value="Draft" disabled={busy}>Save as draft</Button><Button type="submit" form="content-editor" name="status" value="Published" kind="primary" disabled={busy}>Publish</Button></PageTitle>
    <div className="editor-grid">
      <article className="panel form-card"><PanelHead title="Content details" /><form id="content-editor" className="form-body" onSubmit={(event) => void submit(event)}>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <label className="field">Content title<input name="title" required maxLength={200} defaultValue={item?.title ?? ''} /></label>
        <label className="field">Category<select name="category" required defaultValue={item?.category ?? 'Homepage'}><option>Homepage</option><option>How It Works</option><option>About Us</option><option>News</option><option>Financial information</option><option>FAQ</option></select></label>
        <label className="field">Short description<textarea name="summary" maxLength={1000} defaultValue={item?.summary ?? ''} /></label>
        <label className="field">Main content<textarea className="rich" name="body" maxLength={100000} defaultValue={item?.body ?? ''} /></label>
        <label className="field">Featured image URL<input name="imageUrl" type="url" maxLength={2000} placeholder="https://" defaultValue={item?.imageUrl ?? ''} /></label>
      </form></article>
      <aside>
        <article className="panel settings-card"><PanelHead title="Publishing" /><div className="form-body"><p>Published content becomes available to the public site through its published-data API.</p><div className="visibility"><span>Administrator review</span><small>Drafts remain private until published.</small></div></div></article>
        <article className="panel preview-card"><PanelHead title="Preview" /><div className="preview-image">MF</div><div className="preview-copy"><Badge tone="gold">MERKATO FUND</Badge><p>Complete the content fields and save to add it to the website content list.</p></div></article>
      </aside>
    </div>
  </>
}