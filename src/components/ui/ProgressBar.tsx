import { cn } from '@/lib/cn'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max?: number
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  /** Accessible name describing what is being measured. */
  label: string
}

export function ProgressBar({ value, max = 100, tone = 'primary', label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(Math.max(value, 0), max)}
    >
      <div className={cn(styles.fill, styles[tone])} style={{ inlineSize: `${percent}%` }} />
    </div>
  )
}
