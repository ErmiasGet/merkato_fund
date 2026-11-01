import type { ReactNode } from 'react'
import { socialLinks, type SocialPlatform } from '../../data/socialLinks'
import { useLanguage } from '../../lib/useLanguage'

const brandMarks: Record<SocialPlatform, ReactNode> = {
  facebook: <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.8v8h3.7Z" fill="currentColor" stroke="none" />,
  telegram: <path d="m21 4-3.2 16-6-4.5-3.2 2.8.6-5.8L18 6.2 7.3 11.6 3 10.1 21 4Z" fill="currentColor" stroke="none" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
  tiktok: <path d="M14 3v10.2a3.3 3.3 0 1 1-2.7-3.2V7.2a6.2 6.2 0 1 0 5.7 6.2V8.1c1.3 1 2.9 1.5 4.5 1.5V6.4c-3.2 0-5.6-1.7-6.2-3.4H14Z" fill="currentColor" stroke="none" />,
  youtube: <><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" fill="currentColor" stroke="none"/><path d="m10 15 5-3-5-3v6Z" fill="var(--social-icon-cutout, #fffdf7)" stroke="none" /></>,
  linkedin: <><path d="M5 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM3.4 10h3.2v10H3.4zM9 10h3.1v1.4c.5-.9 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.8V20h-3.2v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V20H9z" fill="currentColor" stroke="none" /></>,
  x: <path d="M18.9 3H22l-6.8 7.8L23.2 21h-6.3L12 14.8 6.6 21H3.4l7.3-8.4L2.8 3h6.5l4.4 5.8L18.9 3Zm-1.1 16h1.7L8.3 4.9H6.5L17.8 19Z" fill="currentColor" stroke="none" />,
}

export function SocialLinks({ variant = 'compact' }: { variant?: 'compact' | 'featured' }) {
  const { t } = useLanguage()
  return <div className={`social-links social-links-${variant}`} aria-label={t('Merkato Fund social media')}>
    {socialLinks.map(({ platform, label, url }) => {
      const translatedLabel = t(label)
      const content = <><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{brandMarks[platform]}</svg>{variant === 'featured' && <span>{translatedLabel}</span>}</>
      const className = `social-link social-link-${platform}${url ? '' : ' is-placeholder'}`
      return url
        ? <a key={platform} className={className} href={url} target="_blank" rel="noopener noreferrer" aria-label={t(`Connect With Merkato Fund on ${label}`)} title={t(`Follow us on ${label}`)}>{content}</a>
        : <span key={platform} className={className} role="img" aria-label={t(`${label}: official account link to be added`)} title={t('Official profile URL will be added after verification.')}>{content}</span>
    })}
  </div>
}
