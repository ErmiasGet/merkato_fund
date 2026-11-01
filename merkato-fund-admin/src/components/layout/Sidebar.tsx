import { navigation } from '../../data/adminContent'
import type { AuthUser } from '../../lib/api'
import type { Page, PageChangeHandler } from '../../types/admin'
import { Logo } from '../ui/Logo'

export function Sidebar({ page, setPage, onLogout, open, user }: { page: Page; setPage: PageChangeHandler; onLogout: () => void; open: boolean; user: AuthUser }) {
  const activeIndex = navigation.findIndex((item) => item.page === page)

  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <Logo />
    <div className="site-label"><small>WEBSITE</small><strong>Public content</strong><span>merkatofund.et</span></div>
    <nav>{navigation.map((item, index) => <button key={item.label} className={index === activeIndex ? 'active' : ''} onClick={() => setPage(item.page)}><span>{item.icon}</span>{item.label}</button>)}</nav>
    <div className="account"><div className="avatar">{user.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><strong>{user.fullName}</strong><span>Website Administrator</span></div></div>
    <button className="logout" onClick={onLogout}><span>↪</span> Logout</button>
  </aside>
}