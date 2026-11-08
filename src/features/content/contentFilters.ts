import type { ContentItem } from '@/data/models'
import { addDays } from '@/lib/format'
import { dateToIso, isoToDate } from '@/lib/jalali'
import { normalizeDigits } from '@/lib/numbers'
import { FINISHED_STATUSES } from './contentMeta'

export type DeadlineFilter = 'all' | 'overdue' | 'week' | 'none'

export interface ContentFilters {
  /** "" means "any" for every text filter. */
  projectId: string
  contentType: string
  priority: string
  assignee: string
  status: string
  deadline: DeadlineFilter
  search: string
}

export const EMPTY_FILTERS: ContentFilters = {
  projectId: '',
  contentType: '',
  priority: '',
  assignee: '',
  status: '',
  deadline: 'all',
  search: '',
}

/** Earliest of the three real deadlines (editing, review, publishing), or null. */
export function earliestDeadline(item: ContentItem): string | null {
  const dates = [item.editingDeadline, item.reviewDeadline, item.publishDate].filter(
    (date): date is string => Boolean(date),
  )
  return dates.length > 0 ? dates.reduce((min, date) => (date < min ? date : min)) : null
}

export function isOverdue(item: ContentItem, today: string): boolean {
  const deadline = earliestDeadline(item)
  return deadline !== null && deadline < today && !FINISHED_STATUSES.includes(item.status)
}

export function matchesFilters(item: ContentItem, filters: ContentFilters, today: string): boolean {
  if (filters.projectId && item.projectId !== filters.projectId) return false
  if (filters.contentType && item.contentType !== filters.contentType) return false
  if (filters.priority && item.priority !== filters.priority) return false
  if (filters.assignee && item.assignee !== filters.assignee) return false
  if (filters.status && item.status !== filters.status) return false

  const deadline = earliestDeadline(item)
  if (filters.deadline === 'none' && deadline !== null) return false
  if (filters.deadline === 'overdue' && !isOverdue(item, today)) return false
  if (filters.deadline === 'week') {
    const limit = dateToIso(addDays(isoToDate(today), 7))
    if (deadline === null || deadline < today || deadline > limit) return false
  }

  const query = normalizeDigits(filters.search.trim()).toLowerCase()
  if (query) {
    const haystack = normalizeDigits([item.title, item.topic, item.assignee].join(' ')).toLowerCase()
    if (!haystack.includes(query)) return false
  }
  return true
}

/** Soonest deadline first (items without one last), then most recently edited. */
export function sortContent(items: readonly ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => {
    const da = earliestDeadline(a)
    const db = earliestDeadline(b)
    if (da !== db) {
      if (da === null) return 1
      if (db === null) return -1
      return da.localeCompare(db)
    }
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}
