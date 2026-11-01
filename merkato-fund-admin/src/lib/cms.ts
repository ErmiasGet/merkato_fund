import { apiRequest } from './api'
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'

export type CmsResource = 'content' | 'slides' | 'videos' | 'financialTerms'
export type PublicationStatus = 'Draft' | 'Published' | 'Review' | 'Changed'

export type ContentItem = {
  id: string
  title: string
  category: string
  summary: string
  body: string
  imageUrl: string
  status: 'Draft' | 'Published' | 'Review'
  updatedAt: string
}

export type SlideItem = {
  id: string
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  primaryLabel: string
  primaryUrl: string
  secondaryLabel: string
  secondaryUrl: string
  displayOrder: number
  isActive: boolean
}

export type VideoItem = {
  id: string
  title: string
  description: string
  youtubeUrl: string
  status: 'Draft' | 'Published'
  displayOrder: number
}

export type FinancialTerm = {
  id: string
  title: string
  amount: string
  unit: string
  description: string
  effectiveDate: string | null
  status: 'Draft' | 'Published' | 'Changed'
}

export type SiteSetting = {
  key: string
  value: unknown
  status: 'Draft' | 'Published'
  updated_at: string
}

export type CmsRecordMap = {
  content: ContentItem
  slides: SlideItem
  videos: VideoItem
  financialTerms: FinancialTerm
}

export async function listAdminRecords<Resource extends CmsResource>(resource: Resource) {
  const result = await apiRequest<{ items: CmsRecordMap[Resource][] }>(`/admin/${resource}`)
  return result.items
}

export async function createAdminRecord<Resource extends CmsResource>(resource: Resource, record: Omit<CmsRecordMap[Resource], 'id' | 'updatedAt'>) {
  const result = await apiRequest<{ item: CmsRecordMap[Resource] }>(`/admin/${resource}`, { method: 'POST', body: record })
  return result.item
}

export async function updateAdminRecord<Resource extends CmsResource>(resource: Resource, id: string, record: Omit<CmsRecordMap[Resource], 'id' | 'updatedAt'>) {
  const result = await apiRequest<{ item: CmsRecordMap[Resource] }>(`/admin/${resource}/${id}`, { method: 'PUT', body: record })
  return result.item
}

export async function deleteAdminRecord(resource: CmsResource, id: string) {
  await apiRequest<void>(`/admin/${resource}/${id}`, { method: 'DELETE' })
}

export async function listAdminSettings() {
  const result = await apiRequest<{ settings: SiteSetting[] }>('/admin/site-settings')
  return result.settings
}

export async function saveAdminSetting(key: string, value: unknown, status: 'Draft' | 'Published' = 'Draft') {
  const result = await apiRequest<{ setting: SiteSetting }>(`/admin/site-settings/${key}`, { method: 'PUT', body: { value, status } })
  return result.setting
}

type CmsState = {
  content: ContentItem[]
  slides: SlideItem[]
  videos: VideoItem[]
  financialTerms: FinancialTerm[]
  settings: SiteSetting[]
  loading: boolean
  error: string
  reload: () => Promise<void>
  setContent: (items: ContentItem[]) => void
  setSlides: (items: SlideItem[]) => void
  setVideos: (items: VideoItem[]) => void
  setFinancialTerms: (items: FinancialTerm[]) => void
  setSettings: (items: SiteSetting[]) => void
}

const CmsContext = createContext<CmsState | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [slides, setSlides] = useState<SlideItem[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [financialTerms, setFinancialTerms] = useState<FinancialTerm[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const [nextContent, nextSlides, nextVideos, nextTerms, nextSettings] = await Promise.all([
        listAdminRecords('content'),
        listAdminRecords('slides'),
        listAdminRecords('videos'),
        listAdminRecords('financialTerms'),
        listAdminSettings(),
      ])
      setContent(nextContent)
      setSlides(nextSlides)
      setVideos(nextVideos)
      setFinancialTerms(nextTerms)
      setSettings(nextSettings)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load website data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData)
  }, [])

  const reload = async () => {
    setLoading(true)
    setError('')
    await loadData()
  }
  return createElement(CmsContext.Provider, { value: { content, slides, videos, financialTerms, settings, loading, error, reload, setContent, setSlides, setVideos, setFinancialTerms, setSettings } }, children)
}

export function useCms() {
  const value = useContext(CmsContext)
  if (!value) throw new Error('useCms must be used within CmsProvider.')
  return value
}