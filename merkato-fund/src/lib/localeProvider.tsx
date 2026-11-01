import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { apiRequest } from './api'
import { LocaleContext, type Language } from './localeContext'
import { allTranslationSources } from '../data/translationSources'
import { useLanguageCache } from './useLanguageCache'

const cacheKey = 'merkato-fund-amharic-cache-v1'
const maxBatchTexts = 80
const maxBatchCharacters = 24_000
const maxTextCharacters = 4500
const reviewedAmharic: Record<string, string> = {
  'Birr': 'ብር',
  'Members': 'አባላት',
  'Initial daily contribution': 'የመጀመሪያ ዕለታዊ መዋጮ',
  'Daily obligation after payout': 'ክፍያ ከተቀበሉ በኋላ የዕለት ግዴታ',
  'Administrative fee': 'የአስተዳደር ክፍያ',
  'Stated monthly obligation': 'የተገለጸው ወርሃዊ ግዴታ',
  'Required reserve': 'የሚያስፈልግ መያዣ ገንዘብ',
  'Before qualifying payout': 'ብቁ የክፍያ ውጤት ከመኖሩ በፊት',
  'Following qualifying payout': 'ብቁ የክፍያ ውጤት ከተከተለ በኋላ',
  'Timing and recurrence to be verified': 'ጊዜውና የመደጋገሙ ሁኔታ መረጋገጥ አለበት',
  'Based on 100,000 members': 'በ100,000 አባላት ላይ የተመሠረተ',
  'Selected members per day': 'በየቀኑ የሚመረጡ አባላት',
  'Proposed payout per winner': 'ለእያንዳንዱ አሸናፊ የታቀደ ክፍያ',
  'Total for five winners': 'ለአምስት አሸናፊዎች ጠቅላላ',
  'Important:': 'አስፈላጊ:',
  'These figures represent proposed program assumptions, not verified financial results. Actual participation, collection, and payouts depend on official terms and verified operating arrangements.': 'እነዚህ ቁጥሮች የፕሮግራሙን የታቀዱ ግምቶች ያመለክታሉ፤ የተረጋገጡ የፋይናንስ ውጤቶች አይደሉም። ትክክለኛው ተሳትፎ፣ ገንዘብ መሰብሰብና ክፍያ በይፋዊ ውሎችና በተረጋገጡ የአሠራር ስምምነቶች ላይ ይመረኮዛሉ።',
  'This illustration excludes any applicable fees, reserves, penalties, or additional costs.': 'ይህ ማብራሪያ ሊኖሩ የሚችሉ ክፍያዎችን፣ መያዣዎችን፣ ቅጣቶችን ወይም ተጨማሪ ወጪዎችን አያካትትም።',
  'The proposed rules mention a 7,500 Birr reserve replenished every 15 days. Official documentation should explain who holds the funds, how they are used, and the refund and withdrawal conditions.': 'የታቀዱት ደንቦች በየ15 ቀኑ የሚሞላ 7,500 ብር መያዣ ይጠቅሳሉ። ገንዘቡን ማን እንደሚይዘው፣ እንዴት እንደሚጠቀምበት፣ እንዲመለስ የሚያስችሉ ሁኔታዎችንና የማውጣት ሂደቱን ይፋዊ ሰነዶች ማብራራት አለባቸው።',
  'Financial participation involves obligations and risks. Review the official program terms and verify the organization\'s authorization before committing funds.': 'በፋይናንስ ተሳትፎ ግዴታዎችና አደጋዎች አሉ። ገንዘብ ከማዋጣትዎ በፊት ይፋዊ የፕሮግራሙን ውሎች ይመርምሩ እና የድርጅቱን ፈቃድ ያረጋግጡ።',
  'Do not send money based solely on promotional claims.': 'በማስታወቂያ ቃል ብቻ ተመርኩዘው ገንዘብ አይላኩ።',
  'Choose a new password': 'አዲስ የይለፍ ቃል ይምረጡ',
  'Email Address': 'የኢሜይል አድራሻ',
  'Password': 'የይለፍ ቃል',
  'New Password': 'አዲስ የይለፍ ቃል',
  'EN': 'EN',
  'አማርኛ': 'አማርኛ',
  'Language selection': 'የቋንቋ ምርጫ',
  'Merkato Fund social media': 'የመርካቶ ፈንድ ማህበራዊ ሚዲያ',
  'Amharic translation is temporarily unavailable. Please try again.': 'የአማርኛ ትርጉም ለጊዜው አይገኝም። እባክዎ እንደገና ይሞክሩ።',
  'Translation service is temporarily unavailable.': 'የትርጉም አገልግሎቱ ለጊዜው አይገኝም።',
  'Cannot reach the Merkato API at http://localhost:4000. Start the API and check VITE_API_URL and the API\'s CORS settings.': 'ከመርካቶ ኤፒአይ ጋር መገናኘት አልተቻለም። ኤፒአይውን ያስጀምሩ እና የVITE_API_URL እና CORS ቅንብሮችን ያረጋግጡ።',
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => localStorage.getItem('merkato-fund-language') === 'am' ? 'am' : 'en')
  const [switching, setSwitching] = useState(() => localStorage.getItem('merkato-fund-language') === 'am')
  const [error, setError] = useState('')
  const [registeredTexts, setRegisteredTexts] = useState<string[]>([])
  const [translations, setTranslations] = useLanguageCache(cacheKey)
  const translatedSources = useRef(new Set([...Object.keys(translations), ...Object.keys(reviewedAmharic)]))
  const activeLanguage = useRef(language)
  const translationInFlight = useRef<Promise<void> | null>(null)
  const initialRestoreStarted = useRef(false)

  const translateTexts = useCallback(async (texts: string[]) => {
    if (translationInFlight.current) await translationInFlight.current
    const missingTexts = [...new Set(texts.filter((text) => text.trim() && !translatedSources.current.has(text)))]
    if (!missingTexts.length) return
    const updates: Record<string, string> = {}
    const sourceParts = new Map<string, string[]>()
    const translationUnits: string[] = []
    for (const source of missingTexts) {
      const parts: string[] = []
      let remaining = source
      while (remaining.length > maxTextCharacters) {
        let splitAt = remaining.lastIndexOf(' ', maxTextCharacters)
        if (splitAt < maxTextCharacters * 0.6) splitAt = maxTextCharacters
        parts.push(remaining.slice(0, splitAt).trim())
        remaining = remaining.slice(splitAt).trimStart()
      }
      parts.push(remaining)
      sourceParts.set(source, parts)
      translationUnits.push(...parts)
    }
    const batches: string[][] = []
    let batch: string[] = []
    let batchCharacters = 0
    for (const text of translationUnits) {
      if (batch.length >= maxBatchTexts || batchCharacters + text.length > maxBatchCharacters) {
        batches.push(batch)
        batch = []
        batchCharacters = 0
      }
      batch.push(text)
      batchCharacters += text.length
    }
    if (batch.length) batches.push(batch)
    const task = (async () => {
      for (let index = 0; index < batches.length; index += 2) {
        const pair = batches.slice(index, index + 2)
        const results = await Promise.all(pair.map((chunk) => apiRequest<{ translations: string[] }>('/translate', { method: 'POST', body: { texts: chunk } })))
        pair.forEach((chunk, batchIndex) => chunk.forEach((source, textIndex) => { updates[source] = results[batchIndex].translations[textIndex] ?? source }))
      }
      for (const [source, parts] of sourceParts) updates[source] = parts.map((part) => updates[part] ?? part).join(' ')
      missingTexts.forEach((source) => translatedSources.current.add(source))
      setTranslations((current) => ({ ...current, ...updates }))
    })()
    translationInFlight.current = task
    try {
      await task
    } finally {
      translationInFlight.current = null
    }
  }, [setTranslations])

  const registerTexts = useCallback((texts: string[]) => {
    setRegisteredTexts((current) => {
      const seen = new Set(current)
      const next = [...current]
      for (const text of texts) if (text.trim() && !seen.has(text)) { seen.add(text); next.push(text) }
      return next
    })
  }, [])

  const prepareTexts = useCallback(async (texts: string[]) => {
    if (activeLanguage.current !== 'am') return
    setSwitching(true)
    try {
      await translateTexts(texts)
    } catch (translationError) {
      setError(translationError instanceof Error ? translationError.message : 'ትርጉሙን መጫን አልተቻለም።')
      activeLanguage.current = 'en'
      setLanguageState('en')
      localStorage.setItem('merkato-fund-language', 'en')
    } finally {
      setSwitching(false)
    }
  }, [translateTexts])

  const setLanguage = useCallback(async (nextLanguage: Language) => {
    if (nextLanguage === language && !switching) return
    setError('')
    if (nextLanguage === 'am') {
      setSwitching(true)
      setLanguageState('am')
      activeLanguage.current = 'am'
      localStorage.setItem('merkato-fund-language', 'am')
      return
    }
    setLanguageState('en')
    activeLanguage.current = 'en'
    localStorage.setItem('merkato-fund-language', 'en')
    setSwitching(false)
  }, [language, switching])

  useEffect(() => {
    activeLanguage.current = language
    document.documentElement.lang = language === 'am' ? 'am' : 'en'
    document.documentElement.classList.toggle('locale-amharic', language === 'am')
  }, [language])

  useEffect(() => {
    if (language !== 'am' || !switching || initialRestoreStarted.current) return
    initialRestoreStarted.current = true
    translateTexts([...allTranslationSources, ...registeredTexts])
      .then(() => {
        localStorage.setItem('merkato-fund-language', 'am')
      })
      .catch((translationError: unknown) => {
        setError(translationError instanceof Error ? translationError.message : 'ትርጉሙን መጫን አልተቻለም።')
        setLanguageState('en')
        localStorage.setItem('merkato-fund-language', 'en')
      })
      .finally(() => setSwitching(false))
  }, [language, registeredTexts, switching, translateTexts])

  useEffect(() => {
    if (language !== 'am' || switching || !initialRestoreStarted.current) return
    const missingTexts = registeredTexts.filter((text) => !translatedSources.current.has(text))
    if (!missingTexts.length) return
    setSwitching(true)
    translateTexts(missingTexts)
      .catch((translationError: unknown) => setError(translationError instanceof Error ? translationError.message : 'ትርጉሙን መጫን አልተቻለም።'))
      .finally(() => setSwitching(false))
  }, [language, registeredTexts, switching, translateTexts])

  const t = useCallback((source: string) => language === 'en' ? source : reviewedAmharic[source] ?? translations[source] ?? source, [language, translations])

  return <LocaleContext.Provider value={{ language, switching, error, setLanguage, t, translateTexts, prepareTexts, registerTexts }}>{children}</LocaleContext.Provider>
}
