import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ContentItem } from '@/data/models'
import { formatIsoDate } from '@/lib/format'
import { messages as m } from '@/locales'
import { earliestDeadline, isOverdue } from './contentFilters'
import { contentTypeLabel, PRIORITY_TONE, STATUS_TONE } from './contentMeta'
import styles from './ContentCard.module.css'

interface ContentCardProps {
  item: ContentItem
  projectName?: string
  /** "YYYY-MM-DD", used to flag overdue items. */
  today: string
  /** Show the status badge (hidden on the board, where the column is the status). */
  showStatus?: boolean
  /** When given, the card shows a "change status" button. */
  onChangeStatus?: (item: ContentItem) => void
}

export function ContentCard({
  item,
  projectName,
  today,
  showStatus = true,
  onChangeStatus,
}: ContentCardProps) {
  const copy = m.content.card
  const deadline = earliestDeadline(item)
  const overdue = isOverdue(item, today)

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>
        <Link to={`/content/${item.id}`} className={styles.titleLink}>
          {item.title}
        </Link>
      </h3>
      {projectName ? <p className={styles.project}>{projectName}</p> : null}

      <div className={styles.badges}>
        <Badge tone="primary">{contentTypeLabel(item)}</Badge>
        <Badge tone={PRIORITY_TONE[item.priority]}>{m.content.priorities[item.priority]}</Badge>
        {showStatus ? (
          <Badge tone={STATUS_TONE[item.status]}>{m.content.statuses[item.status]}</Badge>
        ) : null}
      </div>

      <p className={styles.deadline}>
        <span className={styles.deadlineLabel}>{copy.deadline}: </span>
        {deadline ? formatIsoDate(deadline) : <span className={styles.muted}>{copy.noDeadline}</span>}
        {overdue ? <Badge tone="danger">{copy.overdue}</Badge> : null}
      </p>
      {item.assignee ? <p className={styles.assignee}>{item.assignee}</p> : null}

      {onChangeStatus ? (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onChangeStatus(item)}>
            {copy.changeStatus}
          </Button>
        </div>
      ) : null}
    </article>
  )
}
