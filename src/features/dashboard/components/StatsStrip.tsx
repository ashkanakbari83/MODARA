import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'
import { messages as m } from '@/locales'
import type { StatsSummary } from '../types'
import styles from '../dashboard.module.css'

interface StatsStripProps {
  stats: StatsSummary
}

/** Four headline counts in one bordered strip (one unit, not four separate cards). */
export function StatsStrip({ stats }: StatsStripProps) {
  const copy = m.dashboard.stats
  const items = [
    { id: 'activeProjects', value: stats.activeProjects, label: copy.activeProjects, alert: false },
    { id: 'openTasks', value: stats.openTasks, label: copy.openTasks, alert: false },
    {
      id: 'overdueTasks',
      value: stats.overdueTasks,
      label: copy.overdueTasks,
      alert: stats.overdueTasks > 0,
    },
    {
      id: 'awaitingReview',
      value: stats.awaitingReview,
      label: copy.awaitingReview,
      alert: false,
    },
  ]

  return (
    <ul className={styles.stats} aria-label={copy.summaryLabel}>
      {items.map((item) => (
        <li key={item.id} className={styles.statCell}>
          <span className={cn(styles.statValue, item.alert && styles.statAlert)}>
            {formatNumber(item.value)}
          </span>
          <span className={styles.statLabel}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
