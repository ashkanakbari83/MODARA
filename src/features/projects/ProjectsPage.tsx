import { FolderKanban, Plus, Search } from 'lucide-react'
import { useId, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import type { Project, ProjectStatus } from '@/data/models'
import { normalizeDigits } from '@/lib/numbers'
import { messages as m } from '@/locales'
import { ProjectCard } from './ProjectCard'
import styles from './ProjectsPage.module.css'

type Filter = ProjectStatus | 'all'

const FILTERS: readonly Filter[] = ['active', 'paused', 'completed', 'archived', 'all']

function matches(project: Project, query: string): boolean {
  if (!query) return true
  const haystack = normalizeDigits(
    [project.name, project.brandName, project.category].join(' '),
  ).toLowerCase()
  return haystack.includes(query)
}

export function ProjectsPage() {
  const copy = m.projects
  const searchId = useId()
  const [filter, setFilter] = useState<Filter>('active')
  const [search, setSearch] = useState('')
  const { data: projects, error } = useLiveData(() => projectRepository.list(), [])

  const query = normalizeDigits(search.trim()).toLowerCase()
  const visible = (projects ?? []).filter(
    (project) => (filter === 'all' || project.status === filter) && matches(project, query),
  )

  return (
    <>
      <PageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <ButtonLink to="/projects/new">
            <Plus size={18} aria-hidden="true" />
            {copy.newProject}
          </ButtonLink>
        }
      />

      {error ? (
        <p className={styles.message} role="alert">
          {m.data.loadFailed}
        </p>
      ) : projects === undefined ? (
        <p className={styles.message} role="status">
          {m.data.loading}
        </p>
      ) : projects.length === 0 ? (
        <Card padding="lg">
          <EmptyState icon={FolderKanban} title={copy.emptyTitle} description={copy.emptyBody}>
            <ButtonLink to="/projects/new">
              <Plus size={18} aria-hidden="true" />
              {copy.newProject}
            </ButtonLink>
          </EmptyState>
        </Card>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div className={styles.search}>
              <label htmlFor={searchId} className="visually-hidden">
                {copy.searchLabel}
              </label>
              <Search size={18} className={styles.searchIcon} aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                className={styles.searchInput}
                placeholder={copy.searchPlaceholder}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className={styles.filters} role="group" aria-label={copy.filterLabel}>
              {FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {copy.filters[value]}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className={styles.message}>{copy.noResults}</p>
          ) : (
            <ul className={styles.grid}>
              {visible.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
