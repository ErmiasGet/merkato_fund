import type { ReactNode } from 'react'

export type IconName = 'arrow' | 'check' | 'chevron' | 'document' | 'info' | 'menu' | 'play' | 'shield' | 'sun' | 'user' | 'wallet' | 'x'

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  document: <><path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  play: <path d="m9 7 8 5-8 5z"/>,
  shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
  sun: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></>,
  wallet: <><path d="M4 6h15v13H4z"/><path d="M4 9h15M15 13h4"/></>,
  x: <><path d="m6 6 12 12M18 6 6 18"/></>,
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>
}