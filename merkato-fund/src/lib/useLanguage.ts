import { useContext } from 'react'
import { LocaleContext } from './localeContext'

export function useLanguage() {
  const locale = useContext(LocaleContext)
  if (!locale) throw new Error('useLanguage must be used within LocaleProvider.')
  return locale
}
