import type { ConfirmHandler, NotifyHandler, Page, PageChangeHandler } from '../../types/admin'
import { AboutFaqPage } from '../pages/AboutFaqPage'
import { ContentEditorPage } from '../pages/ContentEditorPage'
import { ContentManagementPage } from '../pages/ContentManagementPage'
import { DashboardPage } from '../pages/DashboardPage'
import { FinancialPage } from '../pages/FinancialPage'
import { SliderManagementPage } from '../pages/SliderManagementPage'
import { VideosPage } from '../pages/VideosPage'

export function PageRouter({ page, go, notify, confirm, editContent, editingContentId }: {
  page: Page
  go: PageChangeHandler
  notify: NotifyHandler
  confirm: ConfirmHandler
  editContent: (id: string) => void
  editingContentId: string | null
}) {
  switch (page) {
    case 'Dashboard':
      return <DashboardPage go={go} />
    case 'Content Management':
      return <ContentManagementPage go={go} confirm={confirm} editContent={editContent} />
    case 'Upload Information':
      return <ContentEditorPage go={go} notify={notify} contentId={editingContentId} />
    case 'Slider Management':
      return <SliderManagementPage notify={notify} />
    case 'YouTube Videos':
      return <VideosPage notify={notify} confirm={confirm} />
    case 'Financial Information':
      return <FinancialPage confirm={confirm} />
    case 'About & FAQs':
      return <AboutFaqPage notify={notify} confirm={confirm} />
  }
}