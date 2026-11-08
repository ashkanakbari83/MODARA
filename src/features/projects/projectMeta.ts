import type { BadgeTone } from '@/components/ui/Badge'
import type { ProjectStatus } from '@/data/models'

export const STATUS_TONE: Record<ProjectStatus, BadgeTone> = {
  active: 'success',
  paused: 'warning',
  completed: 'info',
  archived: 'neutral',
}

/** Marker color for a project: its first brand color, or a neutral fallback. */
export function projectColor(brandColors: readonly string[]): string {
  return brandColors[0] ?? 'var(--color-chart-neutral)'
}
