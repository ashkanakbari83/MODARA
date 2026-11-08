import { useId } from 'react'
import type { ReactNode } from 'react'
import { Card } from './Card'
import styles from './SectionCard.module.css'

interface SectionCardProps {
  title: string
  /** Optional element (usually a link) shown at the end of the header. */
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** A card with a labelled heading row, used for dashboard sections. */
export function SectionCard({ title, action, className, children }: SectionCardProps) {
  const headingId = useId()

  return (
    <Card as="section" labelledBy={headingId} className={className}>
      <div className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </Card>
  )
}
