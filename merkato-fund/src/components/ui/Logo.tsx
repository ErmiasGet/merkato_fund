import { useLanguage } from '../../lib/useLanguage'

export function Logo({ light = false, href = '#home' }: { light?: boolean; href?: string }) {
  const { t } = useLanguage()
  return <a href={href} className={`logo ${light ? 'logo-light' : ''}`} aria-label={t('Merkato Fund home')}>
    <svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="19" fill="#F4C430"/><path d="M10 27c3-8 7-12 11-15 0 6 4 10 11 14M12 30h20" fill="none" stroke="#111" strokeWidth="2.5"/><path d="M13 18h5M26 15h5" stroke="#111" strokeWidth="2.5"/></svg>
    <span>MERKATO <b>FUND</b></span>
  </a>
}