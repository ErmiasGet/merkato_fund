import { useContext } from 'react'
import { SiteDataContext } from './siteDataContext'

export function useSiteData() {
  return useContext(SiteDataContext)
}