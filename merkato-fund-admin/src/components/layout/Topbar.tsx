import type { Page } from '../../types/admin'
import { Badge } from '../ui/Badge'

export function Topbar({ page, onMenu }: { page: Page; onMenu: () => void }) {
  return <header className="topbar">
    <button className="menu" onClick={onMenu} aria-label="Open navigation">☰</button>
    <div className="breadcrumbs"><span>Website CMS</span><b>/</b><strong>{page}</strong></div>
    <div className="top-actions"><Badge tone="success">Website online</Badge><button className="preview-site">↗ View public website</button><div className="avatar">AB</div></div>
  </header>
}