import { CONTENT_STATUSES } from '@/data/models'
import type { ContentItem, ContentStatus } from '@/data/models'
import { formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import { ContentCard } from './ContentCard'
import { sortContent } from './contentFilters'
import styles from './ContentBoard.module.css'

interface ContentBoardProps {
  items: readonly ContentItem[]
  projectNames: Record<string, string>
  today: string
  onChangeStatus: (item: ContentItem) => void
}

/**
 * Production board: one column per workflow status. Cards move only when the user
 * chooses a new status; there is no automatic movement. Below 1024px the columns
 * stack as a list and empty columns are hidden.
 */
export function ContentBoard({ items, projectNames, today, onChangeStatus }: ContentBoardProps) {
  const byStatus = new Map<ContentStatus, ContentItem[]>()
  for (const status of CONTENT_STATUSES) byStatus.set(status, [])
  for (const item of sortContent(items)) byStatus.get(item.status)?.push(item)

  return (
    <div className={styles.scroller}>
      <div className={styles.board} role="group" aria-label={m.content.board.label}>
        {CONTENT_STATUSES.map((status) => {
          const column = byStatus.get(status) ?? []
          return (
            <section
              key={status}
              className={styles.column}
              data-empty={column.length === 0}
              aria-label={m.content.statuses[status]}
            >
              <header className={styles.columnHeader}>
                <h3 className={styles.columnTitle}>{m.content.statuses[status]}</h3>
                <span className={styles.count}>{formatNumber(column.length)}</span>
              </header>
              {column.length === 0 ? (
                <p className={styles.empty}>{m.content.card.columnEmpty}</p>
              ) : (
                <ul className={styles.cards}>
                  {column.map((item) => (
                    <li key={item.id}>
                      <ContentCard
                        item={item}
                        projectName={projectNames[item.projectId]}
                        today={today}
                        showStatus={false}
                        onChangeStatus={onChangeStatus}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
