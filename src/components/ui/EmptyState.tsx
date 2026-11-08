import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: ReactNode
  /** Optional actions (links or buttons). */
  children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, badge, children }: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <span className={styles.icon}>
        <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
      </span>
      {badge ? <div>{badge}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {children ? <div className={styles.actions}>{children}</div> : null}
    </div>
  )
}
