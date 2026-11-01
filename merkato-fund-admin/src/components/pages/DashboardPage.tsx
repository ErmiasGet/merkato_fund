import { useCms } from '../../lib/cms'
import type { PageChangeHandler } from '../../types/admin'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PageTitle } from '../ui/PageTitle'
import { PanelHead } from '../ui/PanelHead'
import { StatCard } from '../ui/StatCard'

export function DashboardPage({ go }: { go: PageChangeHandler }) {
  const { content, slides, videos, financialTerms, loading, error } = useCms()
  const publishedCount = content.filter((item) => item.status === 'Published').length
  const draftCount = content.filter((item) => item.status !== 'Published').length
  const recentContent = [...content].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)

  return <>
    <PageTitle title="Website Dashboard" subtitle="Manage the information currently displayed on the Merkato Fund public website."><Button kind="primary" onClick={() => go('Upload Information')}>＋ Upload new information</Button></PageTitle>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <div className="welcome"><div><Badge tone="gold">CONTENT ADMINISTRATION</Badge><h2>{loading ? 'Loading website content…' : `${content.length} website content items`}</h2><p>{draftCount} items are not currently published to the public website.</p></div><button onClick={() => go('Content Management')}>Review content →</button></div>
    <section className="stats"><StatCard label="Published content" value={String(publishedCount)} meta="Visible on public website" /><StatCard label="Draft content" value={String(draftCount)} meta="Not visible publicly" tone="warning" /><StatCard label="Homepage slides" value={String(slides.length)} meta={`${slides.filter((item) => item.isActive).length} active`} /><StatCard label="Media and terms" value={String(videos.length + financialTerms.length)} meta={`${videos.length} videos · ${financialTerms.length} terms`} /></section>
    <section className="dashboard-grid">
      <article className="panel recent"><PanelHead title="Recent updates" action="View all content" onAction={() => go('Content Management')} />
        {recentContent.map((item, index) => <div className="update" key={item.id}><div className={`update-icon u${index}`}>{['▤', '⌁', '◇', '○'][index]}</div><div><strong>{item.title}</strong><span>{item.category} · Updated {new Date(item.updatedAt).toLocaleDateString()}</span></div><Badge tone={item.status === 'Published' ? 'success' : item.status === 'Draft' ? 'neutral' : 'warning'}>{item.status}</Badge></div>)}
      </article>
      <article className="panel quick"><PanelHead title="Quick actions" />
        <button onClick={() => go('Upload Information')}><span>＋</span><div><strong>Add website information</strong><small>Create an article or page section</small></div><b>›</b></button>
        <button onClick={() => go('Slider Management')}><span>▧</span><div><strong>Update homepage slider</strong><small>Replace images and messages</small></div><b>›</b></button>
        <button onClick={() => go('YouTube Videos')}><span>▷</span><div><strong>Add a YouTube video</strong><small>Preview before publishing</small></div><b>›</b></button>
        <button onClick={() => go('Financial Information')}><span>◇</span><div><strong>Review financial terms</strong><small>Official approval required</small></div><b>›</b></button>
      </article>
    </section>
    <div className="info-banner"><span>i</span><div><strong>Publishing reminder</strong><p>Changes are not visible on the public website until you select Publish. Financial information requires an additional confirmation.</p></div></div>
  </>
}