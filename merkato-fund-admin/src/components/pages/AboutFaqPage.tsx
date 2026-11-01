import { useState } from 'react'
import { saveAdminSetting, useCms } from '../../lib/cms'
import type { ConfirmHandler, NotifyHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'
import { PanelHead } from '../ui/PanelHead'

type AboutTab = 'About Us' | 'FAQs' | 'Contact Information'

export function AboutFaqPage({ notify, confirm }: { notify: NotifyHandler; confirm: ConfirmHandler }) {
  const [activeTab, setActiveTab] = useState<AboutTab>('About Us')
  const { settings, loading, reload } = useCms()
  const tabs: AboutTab[] = ['About Us', 'FAQs', 'Contact Information']

  return <>
    <PageTitle title="About Us & FAQs" subtitle="Maintain organization information, public answers, and official contact details." />
    <div className="tabs">{tabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>
    {loading && <p role="status">Loading saved website settings…</p>}
    {!loading && activeTab === 'About Us' && <AboutEditor settings={settings} save={async (value, status) => { await saveAdminSetting('about', value, status); await reload(); notify(status === 'Published' ? 'About information published' : 'About information saved as draft') }} confirm={confirm} />}
    {!loading && activeTab === 'FAQs' && <FaqEditor confirm={confirm} settings={settings} save={async (value, status) => { await saveAdminSetting('faqs', value, status); await reload(); notify(status === 'Published' ? 'FAQs published' : 'FAQs saved as draft') }} />}
    {!loading && activeTab === 'Contact Information' && <ContactEditor settings={settings} save={async (value, status) => { await saveAdminSetting('contact', value, status); await reload(); notify(status === 'Published' ? 'Contact information published' : 'Contact information saved as draft') }} confirm={confirm} />}
  </>
}

function AboutEditor({ settings, save, confirm }: { settings: { key: string; value: unknown }[]; save: (value: unknown, status: 'Draft' | 'Published') => Promise<void>; confirm: ConfirmHandler }) {
  const value = (settings.find((setting) => setting.key === 'about')?.value ?? {}) as Record<string, string>
  const [error, setError] = useState('')
  const submit = async (form: HTMLFormElement, status: 'Draft' | 'Published') => {
    const data = new FormData(form)
    try { await save({ title: data.get('title'), body: data.get('body'), mission: data.get('mission'), vision: data.get('vision') }, status); setError('') }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save about information.') }
  }
  return <div className="editor-grid"><article className="panel form-card"><PanelHead title="Organization story" /><form id="about-form" className="form-body" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget, 'Draft') }}>{error && <p className="auth-error" role="alert">{error}</p>}<label className="field">Page heading<input name="title" defaultValue={value.title ?? 'About Merkato Fund'} /></label><label className="field">About us content<textarea className="long" name="body" defaultValue={value.body ?? ''} /></label><label className="field">Mission<input name="mission" defaultValue={value.mission ?? ''} /></label><label className="field">Vision<input name="vision" defaultValue={value.vision ?? ''} /></label><div className="save-row"><Button type="submit">Save as draft</Button><Button type="button" kind="primary" onClick={() => confirm('Publish About information?', 'This will make the organization story visible on the public website.', () => { const form = document.getElementById('about-form'); if (form instanceof HTMLFormElement) void submit(form, 'Published') })}>Publish</Button></div></form></article><article className="panel preview-card about-preview"><PanelHead title="Public preview" /><div className="about-visual">MF</div><div className="preview-copy"><Badge tone="gold">ABOUT US</Badge><h3>{value.title ?? 'About Merkato Fund'}</h3><p>{value.body ?? 'Save an about description to update the public website.'}</p></div></article></div>
}

function FaqEditor({ confirm, settings, save }: { confirm: ConfirmHandler; settings: { key: string; value: unknown }[]; save: (value: unknown, status: 'Draft' | 'Published') => Promise<void> }) {
  const initialFaqs = settings.find((setting) => setting.key === 'faqs')?.value
  const [faqs, setFaqs] = useState(Array.isArray(initialFaqs) ? initialFaqs as { question: string; answer: string }[] : [{ question: 'What is Merkato Fund?', answer: '' }])
  const [error, setError] = useState('')
  const persist = async (nextFaqs: typeof faqs, status: 'Draft' | 'Published') => { setFaqs(nextFaqs); try { await save(nextFaqs, status); setError('') } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save FAQs.') } }
  return <article className="panel faq-list"><PanelHead title="Frequently asked questions" action="＋ Add question" onAction={() => setFaqs((current) => [...current, { question: '', answer: '' }])} />{error && <p className="auth-error" role="alert">{error}</p>}{faqs.map((faq, index) => <div key={`${index}-${faq.question}`}><b>{index + 1}</b><div><label className="field">Question<input value={faq.question} onChange={(event) => setFaqs((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, question: event.target.value } : item))} /></label><label className="field">Answer<textarea value={faq.answer} onChange={(event) => setFaqs((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, answer: event.target.value } : item))} /></label></div><Button onClick={() => void persist(faqs, 'Draft')}>Save draft</Button><Button kind="primary" onClick={() => confirm('Publish FAQs?', 'This will make the saved FAQ list visible on the public website.', () => persist(faqs, 'Published'))}>Publish</Button><Button onClick={() => confirm('Delete this FAQ?', 'This question and answer will be removed from the editable list.', () => persist(faqs.filter((_, itemIndex) => itemIndex !== index), 'Draft'))}>Remove</Button></div>)}</article>
}

function ContactEditor({ settings, save, confirm }: { settings: { key: string; value: unknown }[]; save: (value: unknown, status: 'Draft' | 'Published') => Promise<void>; confirm: ConfirmHandler }) {
  const value = (settings.find((setting) => setting.key === 'contact')?.value ?? {}) as Record<string, string>
  const [error, setError] = useState('')
  const submit = async (form: HTMLFormElement, status: 'Draft' | 'Published') => { const data = new FormData(form); try { await save({ email: data.get('email'), phone: data.get('phone'), address: data.get('address'), hours: data.get('hours') }, status); setError('') } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Unable to save contact details.') } }
  return <article className="panel contact-form"><PanelHead title="Official contact information" /><form id="contact-form" className="form-body two-fields" onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget, 'Draft') }}>{error && <p className="auth-error" role="alert">{error}</p>}<label className="field">Public email<input name="email" type="email" defaultValue={value.email ?? ''} /></label><label className="field">Phone number<input name="phone" defaultValue={value.phone ?? ''} /></label><label className="field">Office address<input name="address" defaultValue={value.address ?? ''} /></label><label className="field">Business hours<input name="hours" defaultValue={value.hours ?? ''} /></label><div className="save-row"><Button type="submit">Save as draft</Button><Button type="button" kind="primary" onClick={() => confirm('Publish contact information?', 'This will make the contact details visible on the public website.', () => { const form = document.getElementById('contact-form'); if (form instanceof HTMLFormElement) void submit(form, 'Published') })}>Publish</Button></div></form></article>
}