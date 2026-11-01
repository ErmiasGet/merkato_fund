import { createContext } from 'react'

export type Language = 'en' | 'am'

export type LocaleContextValue = {
  language: Language
  switching: boolean
  error: string
  setLanguage: (language: Language) => Promise<void>
  t: (source: string) => string
  translateTexts: (texts: string[]) => Promise<void>
  prepareTexts: (texts: string[]) => Promise<void>
  registerTexts: (texts: string[]) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
