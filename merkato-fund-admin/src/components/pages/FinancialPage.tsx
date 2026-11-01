import { useState } from 'react'
import { createAdminRecord, updateAdminRecord, useCms } from '../../lib/cms'
import type { ConfirmHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'

export function FinancialPage({ confirm }: { confirm: ConfirmHandler }) {
  const { financialTerms, loading, error, reload } = useCms()
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  const saveTerms = async (status: 'Draft' | 'Published') => {
    setSaving(true)
    setActionError('')
    try {
      const fields = Array.from(document.querySelectorAll<HTMLElement>('[data-term-id]'))
      for (const field of fields) {
        const id = field.dataset.termId
        const title = field.querySelector<HTMLInputElement>('[name="title"]')?.value ?? ''
        const description = field.querySelector<HTMLTextAreaElement>('[name="description"]')?.value ?? ''
        const amount = field.querySelector<HTMLInputElement>('[name="amount"]')?.value ?? ''
        const unit = field.querySelector<HTMLInputElement>('[name="unit"]')?.value ?? 'Birr'
        const effectiveDate = field.querySelector<HTMLInputElement>('[name="effectiveDate"]')?.value || null
        const payload = { title, amount, unit, description, effectiveDate, status }
        if (id) await updateAdminRecord('financialTerms', id, payload)
        else await createAdminRecord('financialTerms', payload)
      }
      await reload()
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to save financial terms.')
      throw saveError
    } finally {
      setSaving(false)
    }
  }

  return <>
    <PageTitle title="Financial Information" subtitle="Edit the financial terms shown publicly. Values remain unverified until officially approved."><Button disabled={saving} onClick={() => void saveTerms('Draft')}>Save all as draft</Button><Button kind="primary" disabled={saving} onClick={() => confirm('Publish financial changes?', 'Confirm that these values match the officially approved financial policy.', () => saveTerms('Published'))}>{saving ? 'Saving…' : 'Review &amp; publish'}</Button></PageTitle>
    {(error || actionError) && <p className="auth-error" role="alert">{actionError || error}</p>}
    <div className="policy-warning"><span>!</span><div><strong>Official approval required</strong><p>These values are editable website content and must not be treated as verified policy until they are formally approved and published.</p></div><Badge tone="warning">Pending confirmation</Badge></div>
    {loading && <p role="status">Loading financial terms…</p>}
    <article className="panel terms"><div className="terms-head"><span>Financial term</span><span>Public value</span><span>Effective date</span><span>Status</span></div>{financialTerms.map((term) => <div className="term" key={term.id} data-term-id={term.id}><div><label className="field">Title<input name="title" defaultValue={term.title} /></label><label className="field">Description<textarea name="description" defaultValue={term.description} /></label></div><div className="value-field"><input name="amount" defaultValue={term.amount} aria-label="Amount" /><input name="unit" defaultValue={term.unit} aria-label="Unit" /></div><input name="effectiveDate" type="date" defaultValue={term.effectiveDate ?? ''} aria-label="Effective date" /><Badge tone={term.status === 'Published' ? 'success' : 'warning'}>{term.status}</Badge></div>)}</article>
  </>
}