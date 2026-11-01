import { useLanguage } from '../../lib/useLanguage'

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, switching } = useLanguage()
  return <div className={`language-switcher${compact ? ' language-switcher-compact' : ''}`} role="group" aria-label={language === 'am' ? 'የቋንቋ ምርጫ' : 'Language selection'}>
    <button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} disabled={switching} onClick={() => void setLanguage('en')}>EN</button>
    <span aria-hidden="true">|</span>
    <button type="button" className={language === 'am' ? 'active' : ''} aria-pressed={language === 'am'} disabled={switching} onClick={() => void setLanguage('am')}>አማርኛ</button>
  </div>
}
