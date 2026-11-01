export type SocialPlatform = 'facebook' | 'telegram' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'x'

export type SocialLink = {
  platform: SocialPlatform
  label: string
  url: string | null
}

// Replace null values with verified official Merkato Fund profile URLs.
export const socialLinks: SocialLink[] = [
  { platform: 'facebook', label: 'Facebook', url: null },
  { platform: 'telegram', label: 'Telegram', url: 'https://t.me/merkatofund' },
  { platform: 'instagram', label: 'Instagram', url: null },
  { platform: 'tiktok', label: 'TikTok', url: null },
  { platform: 'youtube', label: 'YouTube', url: null },
  { platform: 'linkedin', label: 'LinkedIn', url: null },
  { platform: 'x', label: 'X', url: null },
]
