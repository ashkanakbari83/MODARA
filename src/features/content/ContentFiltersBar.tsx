import { Search } from 'lucide-react'
import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { SelectField } from '@/components/ui/FormFields'
import type { SelectOption } from '@/components/ui/FormFields'
import { CONTENT_STATUSES, CONTENT_TYPES, PRIORITIES } from '@/data/models'
import { formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import { EMPTY_FILTERS } from './contentFilters'
import type { ContentFilters, DeadlineFilter } from './contentFilters'
import styles from './ContentFiltersBar.module.css'

const copy = m.content.filters

const TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: copy.allTypes },
  ...CONTENT_TYPES.map((value) => ({ value, label: m.content.types[value] })),
]
const PRIORITY_OPTIONS: SelectOption[] = [
  { value: '', label: copy.allPriorities },
  ...PRIORITIES.map((value) => ({ value, label: m.content.priorities[value] })),
]
const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: copy.allStatuses },
  ...CONTENT_STATUSES.map((value) => ({ value, label: m.content.statuses[value] })),
]
const DEADLINE_OPTIONS: SelectOption[] = (['all', 'overdue', 'week', 'none'] as const).map(
  (value) => ({ value, label: copy.deadlines[value] }),
)

interface ContentFiltersBarProps {
  filters: ContentFilters
  onChange: (changes: Partial<ContentFilters>) => void
  projects: ReadonlyArray<{ id: string; name: string }>
  assignees: readonly string[]
  /** The status filter only makes sense in the list view (the board has columns). */
  showStatus: boolean
  resultCount: number
}

export function ContentFiltersBar({
  filters,
  onChange,
  projects,
  assignees,
  showStatus,
  resultCount,
}: ContentFiltersBarProps) {
  const searchId = useId()
  const projectOptions: SelectOption[] = [
    { value: '', label: copy.allProjects },
    ...projects.map((project) => ({ value: project.id, label: project.name })),
  ]
  const assigneeOptions: SelectOption[] = [
    { value: '', label: copy.allAssignees },
    ...assignees.map((name) => ({ value: name, label: name })),
  ]
  const isFiltered = (Object.keys(EMPTY_FILTERS) as Array<keyof ContentFilters>).some(
    (key) => filters[key] !== EMPTY_FILTERS[key],
  )

  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <label htmlFor={searchId} className="visually-hidden">
          {copy.search}
        </label>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          id={searchId}
          type="search"
          className={styles.searchInput}
          placeholder={copy.searchPlaceholder}
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </div>

      <div className={styles.grid}>
        <SelectField
          label={copy.project}
          value={filters.projectId}
          options={projectOptions}
          onChange={(value) => onChange({ projectId: value })}
        />
        <SelectField
          label={copy.type}
          value={filters.contentType}
          options={TYPE_OPTIONS}
          onChange={(value) => onChange({ contentType: value })}
        />
        <SelectField
          label={copy.priority}
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(value) => onChange({ priority: value })}
        />
        <SelectField
          label={copy.assignee}
          value={filters.assignee}
          options={assigneeOptions}
          onChange={(value) => onChange({ assignee: value })}
        />
        <SelectField
          label={copy.deadline}
          value={filters.deadline}
          options={DEADLINE_OPTIONS}
          onChange={(value) => onChange({ deadline: value as DeadlineFilter })}
        />
        {showStatus ? (
          <SelectField
            label={copy.status}
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) => onChange({ status: value })}
          />
        ) : null}
      </div>

      <div className={styles.footer}>
        <p className={styles.count} role="status">
          {formatNumber(resultCount)} {m.content.resultCount}
        </p>
        {isFiltered ? (
          <Button variant="ghost" onClick={() => onChange({ ...EMPTY_FILTERS })}>
            {copy.clear}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
