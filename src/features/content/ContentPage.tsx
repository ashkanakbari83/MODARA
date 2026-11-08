import { Clapperboard, FolderKanban, Plus } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { contentRepository } from '@/data/repositories/contentRepository'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import type { ContentItem, ContentStatus } from '@/data/models'
import { todayIso } from '@/lib/jalali'
import { messages as m } from '@/locales'
import { ContentBoard } from './ContentBoard'
import { ContentCard } from './ContentCard'
import { ContentFiltersBar } from './ContentFiltersBar'
import { EMPTY_FILTERS, matchesFilters, sortContent } from './contentFilters'
import type { ContentFilters } from './contentFilters'
import { StatusChangeDialog } from './StatusChangeDialog'
import styles from './ContentPage.module.css'

type View = 'list' | 'board'

/** Global content page: list or production board, filtered. `?project=` and `?view=` live in the URL. */
export function ContentPage() {
  const [params, setParams] = useSearchParams()
  const view: View = params.get('view') === 'board' ? 'board' : 'list'
  const projectId = params.get('project') ?? ''
  const [localFilters, setLocalFilters] = useState<ContentFilters>(EMPTY_FILTERS)
  const [changing, setChanging] = useState<ContentItem | null>(null)

  const { data, error } = useLiveData(
    async () => ({
      contents: await contentRepository.list(),
      projects: await projectRepository.list(),
    }),
    [],
  )

  const filters: ContentFilters = { ...localFilters, projectId }
  const today = todayIso()

  function updateFilters(changes: Partial<ContentFilters>) {
    const { projectId: nextProject, ...rest } = changes
    if (Object.keys(rest).length > 0) setLocalFilters((previous) => ({ ...previous, ...rest }))
    if (nextProject !== undefined) {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (nextProject) next.set('project', nextProject)
          else next.delete('project')
          return next
        },
        { replace: true },
      )
    }
  }

  function setView(next: View) {
    setParams(
      (previous) => {
        const nextParams = new URLSearchParams(previous)
        if (next === 'board') nextParams.set('view', 'board')
        else nextParams.delete('view')
        return nextParams
      },
      { replace: true },
    )
  }

  async function confirmStatusChange(toStatus: ContentStatus, note: string) {
    if (!changing) return
    await contentRepository.changeStatus(changing.id, toStatus, note)
    setChanging(null)
  }

  const newContentPath = projectId ? `/content/new?project=${projectId}` : '/content/new'
  const header = (
    <PageHeader
      title={m.content.title}
      description={m.content.description}
      actions={
        data && data.projects.length > 0 ? (
          <ButtonLink to={newContentPath}>
            <Plus size={18} aria-hidden="true" />
            {m.content.newContent}
          </ButtonLink>
        ) : undefined
      }
    />
  )

  if (error) {
    return (
      <>
        {header}
        <p className={styles.message} role="alert">
          {m.data.loadFailed}
        </p>
      </>
    )
  }
  if (!data) {
    return (
      <>
        {header}
        <p className={styles.message} role="status">
          {m.data.loading}
        </p>
      </>
    )
  }

  if (data.projects.length === 0) {
    return (
      <>
        {header}
        <Card padding="lg">
          <EmptyState
            icon={FolderKanban}
            title={m.content.needProjectTitle}
            description={m.content.needProjectBody}
          >
            <ButtonLink to="/projects/new">{m.content.needProjectAction}</ButtonLink>
          </EmptyState>
        </Card>
      </>
    )
  }

  if (data.contents.length === 0) {
    return (
      <>
        {header}
        <Card padding="lg">
          <EmptyState
            icon={Clapperboard}
            title={m.content.emptyTitle}
            description={m.content.emptyBody}
          >
            <ButtonLink to={newContentPath}>
              <Plus size={18} aria-hidden="true" />
              {m.content.newContent}
            </ButtonLink>
          </EmptyState>
        </Card>
      </>
    )
  }

  const projectNames: Record<string, string> = {}
  for (const project of data.projects) projectNames[project.id] = project.name
  const assignees = Array.from(
    new Set(data.contents.map((item) => item.assignee).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, 'fa'))

  const effective: ContentFilters = view === 'board' ? { ...filters, status: '' } : filters
  const visible = sortContent(
    data.contents.filter((item) => matchesFilters(item, effective, today)),
  )

  return (
    <>
      {header}

      <div className={styles.viewSwitch} role="group" aria-label={m.content.views.label}>
        {(['list', 'board'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={styles.viewButton}
            aria-pressed={view === value}
            onClick={() => setView(value)}
          >
            {m.content.views[value]}
          </button>
        ))}
      </div>

      <ContentFiltersBar
        filters={filters}
        onChange={updateFilters}
        projects={data.projects}
        assignees={assignees}
        showStatus={view === 'list'}
        resultCount={visible.length}
      />

      {view === 'board' ? <p className={styles.hint}>{m.content.board.hint}</p> : null}

      {visible.length === 0 ? (
        <p className={styles.message}>{m.content.noResults}</p>
      ) : view === 'board' ? (
        <ContentBoard
          items={visible}
          projectNames={projectNames}
          today={today}
          onChangeStatus={setChanging}
        />
      ) : (
        <ul className={styles.grid}>
          {visible.map((item) => (
            <li key={item.id}>
              <ContentCard
                item={item}
                projectName={projectNames[item.projectId]}
                today={today}
                onChangeStatus={setChanging}
              />
            </li>
          ))}
        </ul>
      )}

      {changing ? (
        <StatusChangeDialog
          key={changing.id}
          item={changing}
          onClose={() => setChanging(null)}
          onConfirm={confirmStatusChange}
        />
      ) : null}
    </>
  )
}
