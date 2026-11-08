import { FlaskConical } from 'lucide-react'
import { messages as m } from '@/locales'
import styles from '../dashboard.module.css'

/** Shown whenever the dashboard is rendering sample data instead of real records. */
export function SampleDataNotice() {
  return (
    <aside className={styles.notice} role="note">
      <FlaskConical size={20} aria-hidden="true" />
      <div>
        <p className={styles.noticeTitle}>{m.dashboard.sample.title}</p>
        <p>{m.dashboard.sample.body}</p>
      </div>
    </aside>
  )
}
