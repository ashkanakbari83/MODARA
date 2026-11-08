import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './ButtonLink.module.css'

interface ButtonLinkProps {
  to: string
  children: ReactNode
}

/** A router link styled as a primary button. */
export function ButtonLink({ to, children }: ButtonLinkProps) {
  return (
    <Link to={to} className={styles.link}>
      {children}
    </Link>
  )
}
