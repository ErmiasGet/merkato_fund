import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { useSiteData } from '../../lib/useSiteData'
import { useLanguage } from '../../lib/useLanguage'
import { LanguageSelector } from '../ui/LanguageSelector'

const copyrightYear = new Date().getFullYear()

export function SiteFooter() {
  const { settings } = useSiteData()
  const { t } = useLanguage()
  const contact = settings.contact && typeof settings.contact === 'object' ? settings.contact as Record<string, string> : {}

  return <>
    <section className="social-connect" id="connect">
      <div className="container social-connect-inner">
        <div className="social-connect-copy">
          <p className="eyebrow">{t('Stay connected')}</p>
          <h2>{t('Connect With Merkato Fund')}</h2>
          <p>{t('Follow our official channels for verified updates, announcements, and information from Merkato Fund.')}</p>
        </div>
        <p className="social-placeholder-note">{t('Official profile links will be added after verification.')}</p>
      </div>
    </section>
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand"><Logo light/><p>{t('A financial opportunity platform built around clarity, accountability, and responsible participation.')}</p></div>
          <nav className="footer-column" aria-label={t('Explore Merkato Fund')}><h4>{t('Explore')}</h4><a href="#about-us">{t('About Merkato Fund')}</a><a href="#how-it-works">{t('How It Works')}</a><a href="#transparency">{t('Financial Terms')}</a><a href="#faqs">{t('Frequently Asked Questions')}</a></nav>
          <nav className="footer-column" aria-label={t('Resources')}><h4>{t('Resources')}</h4><a href="#media-center">{t('Media Center')}</a><a href="#privacy">{t('Privacy Policy')}</a><a href="#terms">{t('Terms & Conditions')}</a><a href="#risk">{t('Risk Disclosure')}</a></nav>
          <div className="footer-column footer-contact"><h4>{t('Contact')}</h4><span>{contact.address || t('Office address to be confirmed')}</span><span>{contact.phone ? `${t('Phone:')} ${contact.phone}` : t('Phone: To be confirmed')}</span>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <span>{t('Email: To be confirmed')}</span>}<LanguageSelector compact /></div>
        </div>
        <div className="footer-disclaimer"><Icon name="shield"/><p>{t('Financial participation involves obligations and risks. Review the official program terms and verify the organization\'s authorization before committing funds.')}</p></div>
        <div className="footer-bottom"><span>© {copyrightYear} {t('Merkato Fund. All rights reserved.')}</span><span>{t('Business registration & regulatory details: To be verified')}</span></div>
      </div>
    </footer>
  </>
}