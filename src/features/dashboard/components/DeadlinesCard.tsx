import { Eye, Scissors, Send, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/ui/SectionCard'
import { cn } from '@/lib/cn'
import { formatJalaliShort, formatRelativeDay } from '@/lib/format'
import { messages as m } from '@/locales'
import type { DeadlineItem, DeadlineKind } from '../types'
import styles from '../dashboard.module.css'

const KIND_ICON: Record<DeadlineKind, LucideIcon> = {
  filming: Video,
  editing: Scissors,
  review: Eye,
  publishing: Send,
}

const KIND_CLASS: Record<DeadlineKind, string> = {
  filming: styles.kindFilming,
  editing: styles.kindEditing,
  review: styles.kindReview,
  publishing: styles.kindPublishing,
}

interface DeadlinesCardProps {
  deadlines: readonly DeadlineItem[]
}

export function DeadlinesCard({ deadlines }: DeadlinesCardProps) {
  const copy = m.dashboard.deadlines

  return (
    <SectionCard title={copy.title}>
      {deadlines.length === 0 ? (
        <p className={styles.empty}>{copy.empty}</p>
      ) : (
        <ul className={styles.list}>
          {deadlines.map((item) => {
            const Icon = KIND_ICON[item.kind]
            return (
              <li key={item.id} className={styles.row}>
                <span className={cn(styles.kindChip, KIND_CLASS[item.kind])}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{item.title}</span>
                  <span className={styles.rowSub}>
                    <span>{copy.kinds[item.kind]}</span>
                    <span>{item.projectName}</span>
                  </span>
                </div>
                <div className={styles.rowEnd}>
                  <span className={cn(styles.dayLabel, item.dayOffset <= 1 && styles.dayUrgent)}>
                    {formatRelativeDay(item.dayOffset)}
                  </span>
                  <span>{formatJalaliShort(item.date)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
