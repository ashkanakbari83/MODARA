import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import styles from './ButtonLink.module.css'

interface ButtonLinkProps {
  to: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

/** A router link styled as a button. */
export function ButtonLink({ to, variant = 'primary', children }: ButtonLinkProps) {
  return (
    <Link to={to} className={cn(styles.link, styles[variant])}>
      {children}
    </Link>
  )
}
