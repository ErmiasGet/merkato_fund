import type { ContentRow, Page } from '../types/admin'

export const navigation: { label: string; page: Page; icon: string }[] = [
  { label: 'Dashboard', page: 'Dashboard', icon: '⌂' },
  { label: 'Manage Website Content', page: 'Content Management', icon: '▤' },
  { label: 'Image Slider', page: 'Slider Management', icon: '▧' },
  { label: 'YouTube Videos', page: 'YouTube Videos', icon: '▷' },
  { label: 'About Us', page: 'About & FAQs', icon: '○' },
  { label: 'How It Works', page: 'Content Management', icon: '⌁' },
  { label: 'Financial Information', page: 'Financial Information', icon: '◇' },
  { label: 'FAQs', page: 'About & FAQs', icon: '?' },
  { label: 'Contact Information', page: 'About & FAQs', icon: '✉' },
]

export const contentRows: ContentRow[] = [
  ['Building productive capital together', 'Homepage', '18 Jun 2025, 10:32', 'Published'],
  ['How Merkato Fund works', 'How It Works', '17 Jun 2025, 16:08', 'Published'],
  ['Participation requirements', 'Financial information', '17 Jun 2025, 09:44', 'Draft'],
  ['Our mission and vision', 'About Us', '14 Jun 2025, 12:10', 'Published'],
  ['Frequently asked questions', 'FAQ', '12 Jun 2025, 08:25', 'Review'],
]

export const financialTerms = [
  ['Initial daily contribution', '50', 'Birr', 'The initial daily contribution before an approved payout applies.'],
  ['Post-payout daily obligation', '500', 'Birr', 'The daily obligation after payout, where approved terms apply.'],
  ['Administrative fee', '50', 'Birr', 'Administrative fee; frequency must be stated in approved rules.'],
  ['Monthly obligation', '15,000', 'Birr', 'Equivalent obligation calculated over a 30-day period.'],
  ['Required reserve', '7,500', 'Birr', 'Proposed reserve requirement, where officially applicable.'],
] as const

export const aboutFaqQuestions = [
  'What is Merkato Fund?',
  'How does participation work?',
  'What information do I need to provide?',
  'Where can I find current financial terms?',
]

export const publishedVideos = [
  'Welcome to Merkato Fund',
  'How participation works',
  'Building productive capital',
]