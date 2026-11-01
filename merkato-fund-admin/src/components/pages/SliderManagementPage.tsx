import { useState, type FormEvent } from 'react'
import { createAdminRecord, updateAdminRecord, useCms } from '../../lib/cms'
import type { NotifyHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'
import { PanelHead } from '../ui/PanelHead'

export function SliderManagementPage({ notify }: { notify: NotifyHandler }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const { slides, loading, error, reload } = useCms()
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const slide = slides[activeSlide]

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = {
      eyebrow: String(form.get('eyebrow') ?? ''),
      title: String(form.get('title') ?? ''),
      description: String(form.get('description') ?? ''),
      imageUrl: String(form.get('imageUrl') ?? ''),
      primaryLabel: String(form.get('primaryLabel') ?? ''),
      primaryUrl: String(form.get('primaryUrl') ?? ''),
      secondaryLabel: String(form.get('secondaryLabel') ?? ''),
      secondaryUrl: String(form.get('secondaryUrl') ?? ''),
      displayOrder: Number(form.get('displayOrder') ?? 0),
      isActive: form.get('isActive') === 'on',
    }
    setSaving(true)
    setActionError('')
    try {
      if (slide) await updateAdminRecord('slides', slide.id, payload)
      else await createAdminRecord('slides', payload)
      await reload()
      notify(slide ? 'Slide saved' : 'Slide added')
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to save slide.')
    } finally {
      setSaving(false)
    }
  }

  return <>
    <PageTitle title="Homepage Slider" subtitle="Manage the images and messages displayed at the top of the homepage."><Button kind="primary" onClick={() => setActiveSlide(slides.length)}>＋ Add new slide</Button></PageTitle>
    <div className="slider-grid">
      <article className="panel slides"><PanelHead title="Homepage slides" />{loading && <p>Loading slides…</p>}{error && <p className="auth-error" role="alert">{error}</p>}{slides.map((item, index) => <button className={activeSlide === index ? 'selected' : ''} onClick={() => setActiveSlide(index)} key={item.id}><span className={`slide-thumb t${index % 3}`}>MF</span><div><strong>{item.title}</strong><small>Display order {item.displayOrder + 1}</small></div><Badge tone={item.isActive ? 'success' : 'neutral'}>{item.isActive ? 'Active' : 'Inactive'}</Badge></button>)}{slides.length === 0 && !loading && <p>No slides yet. Create the first slide.</p>}</article>
      <article className="panel slide-editor"><PanelHead title={slide ? 'Edit slide' : 'New slide'} /><form className="form-body" onSubmit={(event) => void save(event)}>
        {actionError && <p className="auth-error" role="alert">{actionError}</p>}
        <div className="two-fields"><label className="field">Eyebrow<input name="eyebrow" defaultValue={slide?.eyebrow ?? ''} /></label><label className="field">Display order<input name="displayOrder" type="number" min="0" defaultValue={slide?.displayOrder ?? slides.length} /></label></div>
        <label className="field">Slide title<input name="title" required maxLength={200} defaultValue={slide?.title ?? ''} /></label>
        <label className="field">Image URL<input name="imageUrl" type="url" maxLength={2000} defaultValue={slide?.imageUrl ?? ''} placeholder="https://" /></label>
        <label className="field">Description<textarea name="description" maxLength={2000} defaultValue={slide?.description ?? ''} /></label>
        <div className="two-fields"><label className="field">Primary button<input name="primaryLabel" maxLength={100} defaultValue={slide?.primaryLabel ?? 'Learn more'} /></label><label className="field">Primary URL<input name="primaryUrl" maxLength={500} defaultValue={slide?.primaryUrl ?? '/the-fund'} /></label></div>
        <div className="two-fields"><label className="field">Secondary button<input name="secondaryLabel" maxLength={100} defaultValue={slide?.secondaryLabel ?? ''} /></label><label className="field">Secondary URL<input name="secondaryUrl" maxLength={500} defaultValue={slide?.secondaryUrl ?? ''} /></label></div>
        <label className="toggle-row"><span><strong>Active slide</strong><small>Display this slide on the homepage</small></span><input name="isActive" type="checkbox" defaultChecked={slide?.isActive ?? true} /></label>
        <div className="save-row"><Button type="submit" kind="primary" disabled={saving}>{saving ? 'Saving…' : 'Save slide'}</Button></div>
      </form></article>
    </div>
    <article className="panel live-preview"><PanelHead title="Live preview" /><div className="hero-preview">{slide?.imageUrl && <img src={slide.imageUrl} alt="" /> }<div><Badge tone="gold">{slide?.eyebrow || 'MERKATO FUND'}</Badge><h2>{slide?.title || 'Your homepage slide preview'}</h2><p>{slide?.description || 'Slide description preview.'}</p><button>{slide?.primaryLabel || 'Learn more'} →</button></div><span>MF</span></div></article>
  </>
}