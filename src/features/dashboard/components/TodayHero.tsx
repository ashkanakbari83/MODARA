import { useId } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatDuration, formatJalaliLong, getGreetingKey } from '@/lib/format'
import { messages as m } from '@/locales'
import type { CapacitySummary } from '../types'
import styles from '../dashboard.module.css'
import { OrbitRing } from './OrbitRing'

interface TodayHeroProps {
  today: Date
  capacity: CapacitySummary
}

/** Page opener: greeting, Jalali date, and today's capacity drawn as an orbit. */
export function TodayHero({ today, capacity }: TodayHeroProps) {
  const titleId = useId()
  const { totalMinutes, plannedMinutes, completedMinutes, remainingMinutes } = capacity
  const { availableMinutes, overMinutes, isOver } = capacity
  const copy = m.dashboard.capacity

  const ringLabel = `${copy.title}: ${formatDuration(plannedMinutes)} ${copy.of} ${formatDuration(totalMinutes)}`

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.heroText}>
        <h1 id={titleId} className={styles.heroTitle}>
          {m.greeting[getGreetingKey(today)]}
        </h1>
        <p className={styles.heroDate}>{formatJalaliLong(today)}</p>
      </div>

      <div className={styles.heroCapacity}>
        <OrbitRing
          progress={totalMinutes > 0 ? plannedMinutes / totalMinutes : 0}
          isOver={isOver}
          label={ringLabel}
        >
          <span className={styles.ringValue}>
            {formatDuration(isOver ? overMinutes : availableMinutes)}
          </span>
          <span className={styles.ringCaption}>
            {isOver ? copy.overCaption : copy.available}
          </span>
        </OrbitRing>
        <div className={styles.capacityText}>
          <p className={styles.capacityTitle}>{copy.title}</p>
          <p className={styles.capacityPlanned}>{formatDuration(plannedMinutes)}</p>
          <p className={styles.capacityOf}>
            {copy.of} {formatDuration(totalMinutes)}
          </p>
          {isOver ? <Badge tone="danger">{copy.overBadge}</Badge> : null}
        </div>
      </div>

      <dl className={styles.heroMetrics}>
        <div className={styles.heroMetric}>
          <dt>{copy.completed}</dt>
          <dd>{formatDuration(completedMinutes)}</dd>
        </div>
        <div className={styles.heroMetric}>
          <dt>{copy.remaining}</dt>
          <dd>{formatDuration(remainingMinutes)}</dd>
        </div>
        <div className={styles.heroMetric}>
          <dt>{copy.available}</dt>
          <dd>{formatDuration(availableMinutes)}</dd>
        </div>
      </dl>

      {isOver ? (
        <p className={styles.overNote} role="status">
          {copy.overWarning}
        </p>
      ) : null}
    </section>
  )
}
