import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './OrbitRing.module.css'

const SIZE = 132
const STROKE = 10

interface OrbitRingProps {
  /** Share of the ring that is filled, 0..1 (values above 1 are capped). */
  progress: number
  isOver: boolean
  /** Spoken description of the ring (the center text is not read separately). */
  label: string
  children?: ReactNode
}

/** Circular progress drawn as an orbit: the saffron planet marks where the fill ends. */
export function OrbitRing({ progress, isOver, label, children }: OrbitRingProps) {
  const clamped = Math.min(Math.max(progress, 0), 1)
  const center = SIZE / 2
  const radius = center - STROKE
  const circumference = 2 * Math.PI * radius
  const angle = clamped * 2 * Math.PI - Math.PI / 2
  const planetX = center + radius * Math.cos(angle)
  const planetY = center + radius * Math.sin(angle)

  return (
    <div className={styles.ring} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false">
        <circle className={styles.track} cx={center} cy={center} r={radius} />
        {clamped > 0 ? (
          <circle
            className={cn(styles.arc, isOver && styles.arcOver)}
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={`${circumference * clamped} ${circumference}`}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ) : null}
        <circle className={styles.planet} cx={planetX} cy={planetY} r={7} />
      </svg>
      <div className={styles.center}>{children}</div>
    </div>
  )
}
