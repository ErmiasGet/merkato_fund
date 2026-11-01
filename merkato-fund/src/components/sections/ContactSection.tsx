import { Icon } from '../ui/Icon'
import { useSiteData } from '../../lib/useSiteData'
import { useLanguage } from '../../lib/useLanguage'

export function ContactSection() {
  const { settings } = useSiteData()
  const { t } = useLanguage()
  const contact = settings.contact && typeof settings.contact === 'object' ? settings.contact as Record<string, string> : {}

  return <section id="contact" className="pre-footer">
    <div className="container"><p className="eyebrow">{t('Take the next informed step')}</p><h2>{t('Ready to Understand')}<br/>{t('the Opportunity?')}</h2><p>{t('Start by reviewing the full financial conditions, eligibility requirements, and participant responsibilities.')}</p><div className="button-row"><a className="button" href="#transparency">{t('Review Full Terms')} <Icon name="arrow"/></a><a className="button button-outline-light" href={contact.email ? `mailto:${contact.email}` : '#contact'}>{t('Contact Us')}</a></div>{contact.phone && <p>{t('Phone:')} {contact.phone}</p>}{contact.address && <p>{t('Office:')} {contact.address}</p>}{contact.hours && <p>{t('Hours:')} {contact.hours}</p>}</div>
  </section>
}