import { businessStories, images, mediaItems, metrics, principles } from '../../data/siteContent'
import { Icon } from '../ui/Icon'
import { useSiteData } from '../../lib/useSiteData'
import { useLanguage } from '../../lib/useLanguage'

export function BusinessSection() {
  const { t } = useLanguage()
  return <section id="business" className="section business">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow">{t('Build what matters')}</p><h2>{t('What Would You Build With')}<br/>{t('the Right Opportunity?')}</h2></div><p>{t('Thoughtful capital can open practical pathways for established and emerging businesses.')}</p></div>
      <div className="editorial-grid">{businessStories.map(([title, text, image], index) => <article className={`editorial-card card-${index + 1}`} key={title}><img src={image} alt="" loading="lazy"/><div><span>0{index + 1}</span><h3>{t(title)}</h3><p>{t(text)}</p><a href="#contact">{t('Explore Your Goals')} <Icon name="arrow" size={17}/></a></div></article>)}</div>
    </div>
  </section>
}

export function MediaSection({ onPlayVideo }: { onPlayVideo: () => void }) {
  const { videos: apiVideos } = useSiteData()
  const { t } = useLanguage()
  const shownVideos = apiVideos.length ? apiVideos.map((item) => [item.title, item.description || 'Merkato Fund video', item.youtubeUrl] as const) : mediaItems

  return <section id="media-center" className="section media">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow">{t('Media center')}</p><h2>{t('Merkato Fund in Focus')}</h2></div><p>{t('Educational content designed to make the model, responsibilities, and risks easier to understand.')}</p></div>
      <div className="media-grid">
        <article className="featured-video">
          <button className="video-thumb" onClick={onPlayVideo} aria-label={t('Play introduction video')}><img src={images.street} alt={t('Addis Ababa city street')} loading="lazy"/><span className="play"><Icon name="play" size={28}/></span><small>{t('Featured video · 04:18')}</small></button>
          <p className="video-category">{t('Program introduction')}</p><h3>{t('Introduction to Merkato Fund')}</h3><p>{t('A clear overview of the proposed model, who it is designed for, and what to review before participating.')}</p><div className="video-meta"><span>{t('Demonstration content')}</span><button onClick={onPlayVideo}>{t('Watch on YouTube')} <Icon name="arrow" size={17}/></button></div>
        </article>
        <div className="playlist">
          {shownVideos.map(([title, date, image], index) => <button className="playlist-item" key={title} onClick={() => apiVideos.length ? window.open(String(image), '_blank', 'noopener,noreferrer') : onPlayVideo()}><span className="mini-thumb"><img src={apiVideos.length ? images.street : image} alt="" loading="lazy"/><i><Icon name="play" size={16}/></i></span><span><strong>{t(title)}</strong><small>{t(date || `Video ${index + 1}`)}</small></span></button>)}
          <button className="button button-dark">{t('View All Videos')} <Icon name="arrow"/></button>
        </div>
      </div>
      <p className="media-disclaimer">{t('Video entries are editable demonstration placeholders and are not represented as verified official content.')}</p>
    </div>
  </section>
}

export function AboutSection() {
  const { content, settings } = useSiteData()
  const { t } = useLanguage()
  const aboutContent = content.find((item) => item.category.toLowerCase() === 'about us')
  const aboutSetting = settings.about && typeof settings.about === 'object' ? settings.about as Record<string, string> : {}

  return <section id="about-us" className="section about">
    <div className="about-image"><img src={images.office} alt={t('Ethiopian professional in a business setting')} loading="lazy"/><div className="image-label"><span>{t('Our purpose')}</span><strong>{t('Informed opportunity.')}<br/>{t('Responsible participation.')}</strong></div></div>
    <div className="about-copy">
      <p className="eyebrow">{t('About Merkato Fund')}</p><h2>{t(aboutSetting.title || aboutContent?.title || 'A Clearer Approach to Financial Opportunity')}</h2><p className="lead">{t(aboutSetting.body || aboutContent?.body || aboutContent?.summary || 'We believe financial participation should begin with understanding—not urgency. Every obligation, condition, and risk should be communicated clearly.')}</p>
      <div className="principles">{principles.map(([title, text]) => <div key={title}><h3>{t(title)}</h3><p>{t(text)}</p></div>)}</div>
    </div>
  </section>
}

export function PublishedContentSection() {
  const { content } = useSiteData()
  const { t } = useLanguage()
  if (!content.length) return null

  return <section className="section business">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow">{t('Latest updates')}</p><h2>{t('News from Merkato Fund')}</h2></div><p>{t('Published information from the Merkato Fund team.')}</p></div>
      <div className="editorial-grid">{content.map((item, index) => <article className={`editorial-card card-${(index % 3) + 1}`} key={item.id}>{item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}<div><span>{t(item.category)}</span><h3>{t(item.title)}</h3><p>{t(item.summary)}</p>{item.body && <details><summary>{t('Read more')}</summary><p>{t(item.body)}</p></details>}</div></article>)}</div>
    </div>
  </section>
}

export function MetricsSection() {
  const { t } = useLanguage()
  return <section className="metrics">
    <div className="container">{metrics.map((label) => <div key={label}><strong>{t('Data to be verified')}</strong><span>{t(label)}</span></div>)}</div>
    <p>{t('Official partner logos, registration, and licensing details will appear here only after independent verification.')}</p>
  </section>
}