import { useState } from 'react'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { AboutSection, BusinessSection, MediaSection, MetricsSection, PublishedContentSection } from './components/sections/StorySections'
import { ContactSection } from './components/sections/ContactSection'
import { FaqSection } from './components/sections/FaqSection'
import { HeroSection } from './components/sections/HeroSection'
import { OpportunitySection, ProcessSection, TransparencySection } from './components/sections/FundSections'
import { VideoModal } from './components/ui/VideoModal'
import AccountPage from './components/auth/AccountPage'
import { SiteDataProvider } from './lib/siteData'
import { LocaleProvider } from './lib/localeProvider'
import { useLanguage } from './lib/useLanguage'
import { SocialLinks } from './components/ui/SocialLinks'

function AppContent() {
  const [videoOpen, setVideoOpen] = useState(false)
  const { language, switching, error, t } = useLanguage()

  if (['/login', '/signup', '/forgot-password', '/reset-password'].includes(window.location.pathname)) {
    return <><AccountPage />{switching && <LanguageLoading language={language} />}</>
  }

  return <SiteDataProvider><div className="site">
    <SiteHeader />
    <aside className="social-rail" aria-label={t('Merkato Fund social media')}>
      <SocialLinks variant="featured" />
    </aside>
    <main>
      <HeroSection />
      <OpportunitySection />
      <ProcessSection />
      <TransparencySection />
      <BusinessSection />
      <MediaSection onPlayVideo={() => setVideoOpen(true)} />
      <PublishedContentSection />
      <AboutSection />
      <MetricsSection />
      <FaqSection />
      <ContactSection />
    </main>
    <SiteFooter />
    {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    {switching && <LanguageLoading language={language} />}
    {error && <div className="locale-error" role="status">{t('Amharic translation is temporarily unavailable. Please try again.')}</div>}
  </div></SiteDataProvider>
}

function LanguageLoading({ language }: { language: 'en' | 'am' }) {
  return <div className="locale-loading" role="status" aria-live="polite">{language === 'am' ? 'ትርጉም በመጫን ላይ…' : 'Loading translation…'}</div>
}

export default function App() {
  return <LocaleProvider><AppContent /></LocaleProvider>
}