import type { ReactNode } from 'react'

export function PageTitle({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{children && <div className="title-actions">{children}</div>}</div>
}