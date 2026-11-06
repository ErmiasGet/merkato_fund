import { useState } from 'react'
import { navigation } from '../../data/siteContent'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { LanguageSelector } from '../ui/LanguageSelector'
import { useLanguage } from '../../lib/useLanguage'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()
  const onHomePage = window.location.pathname === '/' || window.location.pathname === ''
  const sectionHref = (item: string) => {
    const id = item.toLowerCase().replaceAll(' ', '-')
    return item === 'Home' ? (onHomePage ? '#home' : '/') : `${onHomePage ? '' : '/'}#${id}`
  }

  return <header className="header">
    <div className="header-inner">
      <Logo href={onHomePage ? '#home' : '/'} />
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label={t('Primary navigation')}>
        {navigation.map((item) => <a key={item} href={sectionHref(item)} onClick={() => setMenuOpen(false)}>{t(item)}</a>)}
        <div className="mobile-actions"><LanguageSelector compact /></div>
      </nav>
      <div className="header-actions"><LanguageSelector /></div>
      <button className="menu-button" aria-label={menuOpen ? t('Close menu') : t('Open menu')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'x' : 'menu'}/></button>
    </div>
  </header>
}