import { useEffect, useState } from 'react'

export function useLanguageCache(cacheKey: string) {
  const [translations, setTranslations] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(cacheKey)
      return saved ? JSON.parse(saved) as Record<string, string> : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(translations))
    } catch {
      // Translation still works for the current session if browser storage is full or disabled.
    }
  }, [cacheKey, translations])

  return [translations, setTranslations] as const
}
