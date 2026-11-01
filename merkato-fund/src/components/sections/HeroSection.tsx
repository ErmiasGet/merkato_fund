import { useEffect, useState } from 'react'
import { slides } from '../../data/siteContent'
import { Icon } from '../ui/Icon'
import { useSiteData } from '../../lib/useSiteData'
import { useLanguage } from '../../lib/useLanguage'
export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const { slides: apiSlides } = useSiteData()
  const { t } = useLanguage()
  const activeSlides = apiSlides.filter((slide) => slide.isActive).map((slide) => ({ eyebrow: slide.eyebrow, title: slide.title, text: slide.description, primary: slide.primaryLabel, secondary: slide.secondaryLabel, image: slide.imageUrl }))
  const shownSlides = activeSlides.length ? activeSlides : slides

  useEffect(() => {
    if (paused) return
    const intervalId = window.setInterval(() => setActiveSlide((current) => (current + 1) % shownSlides.length), 6500)
    return () => window.clearInterval(intervalId)
  }, [paused, shownSlides.length])

  const moveSlide = (direction: number) => setActiveSlide((current) => (current + direction + shownSlides.length) % shownSlides.length)
  const slide = shownSlides[activeSlide % shownSlides.length]

  return <section id="home" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {shownSlides.map((item, index) => <div key={`${item.title}-${index}`} className={`hero-slide ${activeSlide % shownSlides.length === index ? 'active' : ''}`} aria-hidden={activeSlide % shownSlides.length !== index}>
      <img src={item.image} alt="" />
    </div>)}
    <div className="hero-shade" />
    <div className="container hero-content">
      <p className="eyebrow light">{t(slide.eyebrow)}</p>
      <h1>{t(slide.title)}</h1>
      <p className="hero-copy">{t(slide.text)}</p>
      <div className="button-row"><a className="button" href="#the-fund">{t(slide.primary)}<Icon name="arrow"/></a><a className="button button-outline" href="#how-it-works">{t(slide.secondary)}</a></div>
    </div>
    <div className="hero-controls">
      <button onClick={() => moveSlide(-1)} aria-label={t('Previous slide')}>←</button>
      <div className="dots">{shownSlides.map((item, index) => <button key={`${item.title}-dot`} className={activeSlide % shownSlides.length === index ? 'active' : ''} onClick={() => setActiveSlide(index)} aria-label={`${t('Go to slide')} ${index + 1}`} aria-current={activeSlide % shownSlides.length === index}/>)}</div>
      <button onClick={() => moveSlide(1)} aria-label={t('Next slide')}>→</button>
    </div>
    <div className="hero-trust"><span><Icon name="shield" size={18}/> {t('Clear financial terms')}</span><span><Icon name="check" size={18}/> {t('Informed participation')}</span><span><Icon name="document" size={18}/> {t('Verified conditions')}</span></div>
  </section>
}