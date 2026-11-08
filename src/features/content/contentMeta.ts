import type { BadgeTone } from '@/components/ui/Badge'
import type { ContentItem, ContentStatus, Priority } from '@/data/models'
import { messages as m } from '@/locales'

export const STATUS_TONE: Record<ContentStatus, BadgeTone> = {
  idea: 'neutral',
  'script-writing': 'info',
  'script-approval-pending': 'warning',
  'script-approved': 'success',
  'filming-planned': 'info',
  'waiting-raw-footage': 'warning',
  'raw-footage-received': 'success',
  editing: 'primary',
  'internal-review': 'warning',
  'client-review': 'warning',
  'revision-required': 'danger',
  'final-approval': 'success',
  scheduled: 'info',
  published: 'success',
  archived: 'neutral',
}

export const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

/** Statuses after which a passed date no longer counts as overdue. */
export const FINISHED_STATUSES: readonly ContentStatus[] = ['published', 'archived']

export function contentTypeLabel(item: Pick<ContentItem, 'contentType' | 'customTypeName'>): string {
  return item.contentType === 'custom' && item.customTypeName
    ? item.customTypeName
    : m.content.types[item.contentType]
}
