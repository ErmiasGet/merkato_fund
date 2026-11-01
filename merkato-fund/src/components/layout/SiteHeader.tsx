import { useState } from 'react'
import { navigation } from '../../data/siteContent'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { LanguageSelector } from '../ui/LanguageSelector'
import { useLanguage } from '../../lib/useLanguage'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useLanguage()

  return <header className="header">
    <div className="header-inner">
      <Logo />
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label={t('Primary navigation')}>
        {navigation.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{t(item)}</a>)}
        <div className="mobile-actions"><LanguageSelector compact /></div>
      </nav>
      <div className="header-actions"><LanguageSelector /></div>
      <button className="menu-button" aria-label={menuOpen ? t('Close menu') : t('Open menu')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'x' : 'menu'}/></button>
    </div>
  </header>
}