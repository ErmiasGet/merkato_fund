import type { ReactNode } from 'react'

export type IconName = 'arrow' | 'building' | 'chart' | 'check' | 'chevron' | 'compass' | 'document' | 'info' | 'layers' | 'menu' | 'network' | 'phone' | 'play' | 'shield' | 'spark' | 'sun' | 'user' | 'users' | 'wallet' | 'x'

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  building: <><path d="m3 9 9-5 9 5"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8"/><path d="M3 21h18M3 18h18"/></>,
  chart: <><path d="M4 20V6M4 20h17"/><path d="m7 16 4-5 4 3 5-7"/><path d="M17 7h3v3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></>,
  document: <><path d="M6 3h9l3 3v15H6z"/><path d="M9 11h6M9 15h6"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  network: <><circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="5" cy="18" r="1.8"/><circle cx="19" cy="18" r="1.8"/><path d="m6.5 7.2 4 3.2M17.5 7.2l-4 3.2M6.5 16.8l4-3.2M17.5 16.8l-4-3.2"/></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/></>,
  play: <path d="m9 7 8 5-8 5z"/>,
  shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
  spark: <path d="m12 3 2.2 5.3L20 10l-4.4 3.6L17 20l-5-3-5 3 1.4-6.4L4 10l5.8-1.7z"/>,
  sun: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></>,
  users: <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.8-4 3-6 6-6s5.2 2 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17 14c2.3.5 3.7 2.3 4 5"/></>,
  wallet: <><path d="M4 6h15v13H4z"/><path d="M4 9h15M15 13h4"/></>,
  x: <><path d="m6 6 12 12M18 6 6 18"/></>,
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>
}