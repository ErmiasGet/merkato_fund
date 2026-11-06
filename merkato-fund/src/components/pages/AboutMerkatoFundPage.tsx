import { useEffect } from 'react'
import { aboutPageContent } from '../../data/aboutContent'
import { images } from '../../data/siteContent'
import { useLanguage } from '../../lib/useLanguage'
import { useScrollReveal } from '../../lib/useScrollReveal'
import { SiteDataProvider } from '../../lib/siteData'
import { SiteFooter } from '../layout/SiteFooter'
import { SiteHeader } from '../layout/SiteHeader'
import { Icon } from '../ui/Icon'
import { SocialLinks } from '../ui/SocialLinks'

function useAboutPageMeta() {
  const { t, language } = useLanguage()

  useEffect(() => {
    document.title = t(aboutPageContent.seo.title)

    const setMeta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', value)
    }

    const title = t(aboutPageContent.seo.title)
    const description = t(aboutPageContent.seo.description)
    const canonicalUrl = `${window.location.origin}/about`

    setMeta('name', 'description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Merkato Fund')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', images.market)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', images.market)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [language, t])
}

export function AboutMerkatoFundPage() {
  const { language, switching, error, t } = useLanguage()
  useScrollReveal()
  useAboutPageMeta()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <SiteDataProvider><div className="site about-site">
    <SiteHeader />
    <aside className="social-rail" aria-label={t('Merkato Fund social media')}>
      <SocialLinks variant="featured" />
    </aside>
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-media"><img src={images.market} alt={t(aboutPageContent.hero.imageAlt)} /></div>
        <div className="about-hero-shade" aria-hidden="true" />
        <div className="container about-hero-inner">
          <nav className="about-breadcrumb" aria-label={t('Breadcrumb')}>
            <a href="/">{t('Home')}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t(aboutPageContent.hero.breadcrumb)}</span>
          </nav>
          <p className="eyebrow light">{t(aboutPageContent.hero.eyebrow)}</p>
          <h1 id="about-hero-title">{t(aboutPageContent.hero.title)}</h1>
          <p className="about-hero-copy">{t(aboutPageContent.hero.subtitle)}</p>
          <div className="button-row">
            <a className="button" href="#how-it-works">{t(aboutPageContent.hero.primary)} <Icon name="arrow" /></a>
            <a className="button button-outline" href="/">{t(aboutPageContent.hero.secondary)}</a>
          </div>
          <div className="about-hero-tags" aria-label={t(aboutPageContent.hero.tagsLabel)}>
            {aboutPageContent.hero.tags.map((tag) => <span key={tag}>{t(tag)}</span>)}
          </div>
        </div>
      </section>

      <section id="story" className="section about-story" aria-labelledby="about-story-title">
        <div className="container about-story-grid">
          <div className="about-story-visual" data-reveal>
            <img src={images.street} alt={t(aboutPageContent.story.imageAlt)} loading="lazy" />
            <figure className="about-story-quote">
              <span aria-hidden="true">“</span>
              <blockquote>{t(aboutPageContent.story.quote)}</blockquote>
              <figcaption>{t(aboutPageContent.story.quoteLabel)}</figcaption>
            </figure>
          </div>
          <div className="about-story-copy" data-reveal>
            <p className="eyebrow">{t(aboutPageContent.story.eyebrow)}</p>
            <h2 id="about-story-title">{t(aboutPageContent.story.title)}</h2>
            <p className="about-lead">{t(aboutPageContent.story.intro)}</p>
            {aboutPageContent.story.paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
            <div className="about-story-pillars">
              {aboutPageContent.story.pillars.map((pillar) => <div key={pillar.title}>
                <h3>{t(pillar.title)}</h3>
                <p>{t(pillar.text)}</p>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="what-is-merkato-fund" className="section about-definition" aria-labelledby="about-definition-title">
        <div className="container">
          <div className="about-split-heading" data-reveal>
            <div>
              <p className="eyebrow">{t(aboutPageContent.definition.eyebrow)}</p>
              <h2 id="about-definition-title">{t(aboutPageContent.definition.title)}</h2>
            </div>
            <p className="about-lead">{t(aboutPageContent.definition.lead)}</p>
          </div>
          <div className="about-definition-grid">
            <div className="about-pillar-list">
              {aboutPageContent.definition.pillars.map((pillar, index) => <article className="about-pillar" key={pillar.title} data-reveal>
                <span className="about-pillar-icon"><Icon name={pillar.icon} size={22} /></span>
                <div>
                  <span className="about-pillar-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{t(pillar.title)}</h3>
                  <p>{t(pillar.text)}</p>
                </div>
              </article>)}
            </div>
            <aside className="about-aside" data-reveal>
              <p className="eyebrow">{t(aboutPageContent.definition.aside.label)}</p>
              <h3>{t(aboutPageContent.definition.aside.title)}</h3>
              <p>{t(aboutPageContent.definition.aside.body)}</p>
              <span className="about-aside-rule" aria-hidden="true" />
              <p className="about-aside-note">{t(aboutPageContent.definition.aside.ruleNote)}</p>
            </aside>
          </div>
          <p className="about-definition-body" data-reveal>{t(aboutPageContent.definition.body)}</p>
        </div>
      </section>

      <section id="financial-model" className="section about-model" aria-labelledby="about-model-title">
        <div className="container">
          <div className="about-section-head" data-reveal>
            <div>
              <p className="eyebrow">{t(aboutPageContent.model.eyebrow)}</p>
              <h2 id="about-model-title">{t(aboutPageContent.model.title)}</h2>
            </div>
            <p className="about-lead">{t(aboutPageContent.model.intro)}</p>
          </div>
          <div className="about-model-grid">
            {aboutPageContent.model.concepts.map((concept, index) => <article className="about-model-card" key={concept.title} data-reveal>
              <div className="about-model-top">
                <span className="about-model-icon"><Icon name={concept.icon} size={24} /></span>
                <span className="about-model-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{t(concept.title)}</h3>
              <ul>
                {concept.points.map((point) => <li key={point}><Icon name="check" size={16} /><span>{t(point)}</span></li>)}
              </ul>
            </article>)}
          </div>
          <div className="about-model-synthesis" data-reveal>
            <span className="about-synthesis-icon"><Icon name="layers" size={28} /></span>
            <div>
              <p className="eyebrow">{t(aboutPageContent.model.synthesisLabel)}</p>
              <h3>{t(aboutPageContent.model.synthesisTitle)}</h3>
              <p>{t(aboutPageContent.model.synthesisBody)}</p>
            </div>
          </div>
          <p className="about-model-note" data-reveal><Icon name="info" size={18} /><span>{t(aboutPageContent.model.caution)}</span></p>
        </div>
      </section>

      <section id="how-it-works" className="section about-process" aria-labelledby="about-process-title">
        <div className="container">
          <div className="about-process-head" data-reveal>
            <div>
              <p className="eyebrow light">{t(aboutPageContent.process.eyebrow)}</p>
              <h2 id="about-process-title">{t(aboutPageContent.process.title)}</h2>
            </div>
            <p className="about-process-intro">{t(aboutPageContent.process.intro)}</p>
          </div>
          <ol className="about-process-steps">
            {aboutPageContent.process.steps.map((step, index) => <li className="about-process-step" key={step.title} data-reveal>
              <span className="about-step-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{t(step.title)}</h3>
              <p>{t(step.text)}</p>
            </li>)}
          </ol>
          <div className="about-structure" data-reveal>
            <div className="about-structure-copy">
              <p className="eyebrow">{t(aboutPageContent.process.structure.eyebrow)}</p>
              <h3>{t(aboutPageContent.process.structure.title)}</h3>
              <p>{t(aboutPageContent.process.structure.body)}</p>
            </div>
            <div className="about-structure-figures">
              {aboutPageContent.process.structure.items.map((item) => <div className="about-figure" key={item.label}>
                <span>{t(item.label)}</span>
                <strong>{t(item.value)} <small>{t(item.unit)}</small></strong>
              </div>)}
            </div>
          </div>
          <div className="about-process-note" data-reveal><Icon name="shield" size={24} /><p>{t(aboutPageContent.process.disclaimer)}</p></div>
        </div>
      </section>

      <section id="technology" className="section about-tech" aria-labelledby="about-tech-title">
        <div className="container about-tech-grid">
          <div className="about-tech-copy" data-reveal>
            <p className="eyebrow">{t(aboutPageContent.technology.eyebrow)}</p>
            <h2 id="about-tech-title">{t(aboutPageContent.technology.title)}</h2>
            <p className="about-lead">{t(aboutPageContent.technology.intro)}</p>
            <div className="about-tech-list">
              {aboutPageContent.technology.points.map((point) => <div className="about-tech-item" key={point.title}>
                <span className="about-tech-icon"><Icon name={point.icon} size={20} /></span>
                <div><h3>{t(point.title)}</h3><p>{t(point.text)}</p></div>
              </div>)}
            </div>
            <p className="about-tech-note"><Icon name="info" size={16} /><span>{t(aboutPageContent.technology.note)}</span></p>
          </div>
          <div className="about-tech-visual" data-reveal>
            <div className="tech-network" role="img" aria-label={t(aboutPageContent.technology.visualAlt)}>
              <span className="tech-hub"><Icon name="network" size={30} /><b>{t(aboutPageContent.technology.hub)}</b></span>
              {aboutPageContent.technology.points.map((point, index) => <span className={`tech-chip tech-chip-${index + 1}`} key={point.short}>
                <Icon name={point.icon} size={16} />{t(point.short)}
              </span>)}
            </div>
            <p className="tech-caption">{t(aboutPageContent.technology.caption)}</p>
          </div>
        </div>
      </section>

      <section id="vision" className="section about-vision" aria-labelledby="about-vision-title">
        <div className="container">
          <div className="about-vision-head" data-reveal>
            <p className="eyebrow">{t(aboutPageContent.vision.eyebrow)}</p>
            <h2 id="about-vision-title">{t(aboutPageContent.vision.title)}</h2>
          </div>
          <div className="about-vision-body">
            <p className="about-vision-statement" data-reveal>{t(aboutPageContent.vision.lead)}</p>
            <div className="about-vision-copy" data-reveal>
              <p>{t(aboutPageContent.vision.body)}</p>
            </div>
          </div>
          <div className="about-vision-pillars">
            {aboutPageContent.vision.pillars.map((pillar) => <div key={pillar.title} data-reveal>
              <h3>{t(pillar.title)}</h3>
              <p>{t(pillar.text)}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-title">
        <div className="container about-cta-inner">
          <div className="about-cta-copy" data-reveal>
            <p className="eyebrow light">{t(aboutPageContent.cta.eyebrow)}</p>
            <h2 id="about-cta-title">{t(aboutPageContent.cta.title)}</h2>
            <p>{t(aboutPageContent.cta.body)}</p>
          </div>
          <div className="about-cta-actions" data-reveal>
            <a className="button" href="/">{t(aboutPageContent.cta.primary)} <Icon name="arrow" /></a>
            <a className="button button-outline" href="/signup">{t(aboutPageContent.cta.secondary)}</a>
            <p>{t(aboutPageContent.cta.note)}</p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
    {switching && <div className="locale-loading" role="status" aria-live="polite">{language === 'am' ? 'ትርጉም በመጫን ላይ…' : 'Loading translation…'}</div>}
    {error && <div className="locale-error" role="status">{t('Amharic translation is temporarily unavailable. Please try again.')}</div>}
  </div></SiteDataProvider>
}
