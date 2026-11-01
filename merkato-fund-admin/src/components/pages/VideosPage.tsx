import { useState, type FormEvent } from 'react'
import { createAdminRecord, deleteAdminRecord, useCms } from '../../lib/cms'
import type { ConfirmHandler, NotifyHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'
import { PanelHead } from '../ui/PanelHead'

export function VideosPage({ notify, confirm }: { notify: NotifyHandler; confirm: ConfirmHandler }) {
  const { videos, loading, error, reload } = useCms()
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const addVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setActionError('')
    try {
      await createAdminRecord('videos', { title: videoTitle, description: videoDescription, youtubeUrl: videoUrl, status: 'Published', displayOrder: videos.length })
      await reload()
      setVideoTitle('')
      setVideoDescription('')
      setVideoUrl('')
      notify('Video published on the public website')
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : 'Unable to save video.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <PageTitle title="YouTube Videos" subtitle="Add and manage videos displayed on the Merkato Fund website." />
    <div className="video-grid">
      <article className="panel form-card"><PanelHead title="Add YouTube video" /><form className="form-body" onSubmit={(event) => void addVideo(event)}>{(error || actionError) && <p className="auth-error" role="alert">{actionError || error}</p>}<label className="field">YouTube video URL<input type="url" required value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label><label className="field">Video title<input required maxLength={200} value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} /></label><label className="field">Short description<textarea maxLength={2000} value={videoDescription} onChange={(event) => setVideoDescription(event.target.value)} /></label><div className="save-row"><Button type="submit" kind="primary" disabled={busy}>{busy ? 'Publishing…' : 'Publish video'}</Button></div></form></article>
      <article className="panel video-preview"><PanelHead title="Video preview" /><div className="video-frame"><span>▶</span><small>{videoUrl ? 'YOUTUBE URL PROVIDED' : 'ADD A VIDEO URL'}</small></div><div><h3>{videoTitle || 'Video title preview'}</h3><p>{videoDescription || 'Video description preview.'}</p></div></article>
    </div>
    <h2 className="section-title">Videos <Badge>{videos.length} videos</Badge></h2>
    {loading && <p role="status">Loading videos…</p>}
    <div className="video-cards">{videos.map((item, index) => <article className="panel" key={item.id}><div className={`video-thumb v${index % 3}`}><span>▶</span></div><div><h3>{item.title}</h3><p>{item.description}</p><Badge tone={item.status === 'Published' ? 'success' : 'neutral'}>{item.status}</Badge><div><a href={item.youtubeUrl} target="_blank" rel="noreferrer">Preview</a><button onClick={() => confirm('Remove this video?', `Remove “${item.title}” from the website?`, async () => { await deleteAdminRecord('videos', item.id); await reload() })}>Delete</button></div></div></article>)}</div>
  </>
}