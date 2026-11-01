export type Page =
  | 'Dashboard'
  | 'Content Management'
  | 'Upload Information'
  | 'Slider Management'
  | 'YouTube Videos'
  | 'Financial Information'
  | 'About & FAQs'

export type PageChangeHandler = (page: Page) => void
export type NotifyHandler = (message: string) => void
export type ConfirmHandler = (title: string, text: string, onConfirm?: () => void | Promise<void>) => void

export type ContentRow = readonly [title: string, category: string, updatedAt: string, status: 'Published' | 'Draft' | 'Review']