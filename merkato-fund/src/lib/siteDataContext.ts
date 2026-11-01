import { createContext } from 'react'
import type { PublicSiteData } from './api'

export const SiteDataContext = createContext<PublicSiteData>({ content: [], slides: [], videos: [], financialTerms: [], settings: {} })