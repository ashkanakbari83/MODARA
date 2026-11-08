import { ChevronLeft, Circle, CircleCheck, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { SectionCard } from '@/components/ui/SectionCard'
import { cn } from '@/lib/cn'
import { formatDuration } from '@/lib/format'
import { messages as m } from '@/locales'
import type { DashboardTask, TaskStatus } from '../types'
import styles from '../dashboard.module.css'

const STATUS_ICON: Record<TaskStatus, LucideIcon> = {
  done: CircleCheck,
  'in-progress': Clock,
  planned: Circle,
}

const STATUS_CLASS: Record<TaskStatus, string> = {
  done: styles.statusDone,
  'in-progress': styles.statusProgress,
  planned: styles.statusPlanned,
}

interface TodayCardProps {
  tasks: readonly DashboardTask[]
}

export function TodayCard({ tasks }: TodayCardProps) {
  const copy = m.dashboard.today

  return (
    <SectionCard
      title={copy.title}
      action={
        <Link to="/today" className={styles.cardLink}>
          {copy.viewAll}
          <ChevronLeft size={16} className="icon-forward" aria-hidden="true" />
        </Link>
      }
    >
      {tasks.length === 0 ? (
        <p className={styles.empty}>{copy.empty}</p>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => {
            const Icon = STATUS_ICON[task.status]
            return (
              <li key={task.id} className={styles.row}>
                <Icon size={20} className={STATUS_CLASS[task.status]} aria-hidden="true" />
                <div className={styles.rowMain}>
                  <span className={cn(styles.rowTitle, task.status === 'done' && styles.rowDone)}>
                    <span className="visually-hidden">{copy.status[task.status]}: </span>
                    {task.title}
                  </span>
                  <span className={styles.rowSub}>
                    <span>{task.projectName}</span>
                  </span>
                </div>
                <div className={styles.rowEnd}>
                  {task.priority === 'high' ? <Badge tone="danger">{copy.priorityHigh}</Badge> : null}
                  <span>{formatDuration(task.estimateMinutes)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
