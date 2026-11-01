import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonKind = 'primary' | 'secondary' | 'danger'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  children: ReactNode
  kind?: ButtonKind
}

export function Button({ children, kind = 'secondary', ...props }: ButtonProps) {
  return <button className={`button ${kind}`} {...props}>{children}</button>
}