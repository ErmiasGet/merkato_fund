import { useEffect, useState, type ReactNode } from 'react'
import { getPublicSiteData, type PublicSiteData } from './api'
import { SiteDataContext } from './siteDataContext'
import { useLanguage } from './useLanguage'

const emptySiteData: PublicSiteData = { content: [], slides: [], videos: [], financialTerms: [], settings: {} }

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState(emptySiteData)
  const { registerTexts, prepareTexts } = useLanguage()

  useEffect(() => {
    getPublicSiteData()
      .then(async (data) => {
        const dynamicTexts: string[] = []
        const collect = (value: unknown, key = '') => {
          if (typeof value === 'string') {
            if (['title', 'summary', 'body', 'category', 'description', 'eyebrow', 'primaryLabel', 'secondaryLabel', 'question', 'answer'].includes(key) && value.trim() && !/^https?:\/\//i.test(value)) dynamicTexts.push(value)
          } else if (Array.isArray(value)) value.forEach((item) => collect(item, key))
          else if (value && typeof value === 'object') Object.entries(value).forEach(([childKey, childValue]) => collect(childValue, childKey))
        }
        collect(data.content)
        collect(data.slides)
        collect(data.videos)
        collect(data.financialTerms)
        collect(data.settings.about)
        collect(data.settings.faqs)
        registerTexts(dynamicTexts)
        if (dynamicTexts.length) await prepareTexts(dynamicTexts)
        setSiteData(data)
      })
      .catch((error: unknown) => {
        console.error('Unable to fetch published Merkato Fund data from the API.', error)
        setSiteData(emptySiteData)
      })
  }, [prepareTexts, registerTexts])

  return <SiteDataContext.Provider value={siteData}>{children}</SiteDataContext.Provider>
}

