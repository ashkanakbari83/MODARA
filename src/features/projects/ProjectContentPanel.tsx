import { Clapperboard, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ContentItem, ContentStatus } from '@/data/models'
import { contentRepository } from '@/data/repositories/contentRepository'
import { useLiveData } from '@/data/useLiveData'
import { ContentCard } from '@/features/content/ContentCard'
import { sortContent } from '@/features/content/contentFilters'
import { StatusChangeDialog } from '@/features/content/StatusChangeDialog'
import { todayIso } from '@/lib/jalali'
import { messages as m } from '@/locales'
import styles from './ProjectDetailPage.module.css'

interface ProjectContentPanelProps {
  projectId: string
  projectName: string
}

/** "Content" tab of a project: its items, with quick access to the board. */
export function ProjectContentPanel({ projectId, projectName }: ProjectContentPanelProps) {
  const copy = m.content.projectTab
  const [changing, setChanging] = useState<ContentItem | null>(null)
  const { data, error } = useLiveData(() => contentRepository.listByProject(projectId), [projectId])
  const today = todayIso()

  async function confirmStatusChange(toStatus: ContentStatus, note: string) {
    if (!changing) return
    await contentRepository.changeStatus(changing.id, toStatus, note)
    setChanging(null)
  }

  if (error) {
    return (
      <p className={styles.message} role="alert">
        {m.data.loadFailed}
      </p>
    )
  }
  if (!data) {
    return (
      <p className={styles.message} role="status">
        {m.data.loading}
      </p>
    )
  }

  const newPath = `/content/new?project=${projectId}`

  if (data.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState icon={Clapperboard} title={m.content.emptyTitle} description={copy.empty}>
          <ButtonLink to={newPath}>
            <Plus size={18} aria-hidden="true" />
            {copy.newContent}
          </ButtonLink>
        </EmptyState>
      </Card>
    )
  }

  return (
    <>
      <div className={styles.contentActions}>
        <ButtonLink to={newPath}>
          <Plus size={18} aria-hidden="true" />
          {copy.newContent}
        </ButtonLink>
        <Link to={`/content?view=board&project=${projectId}`} className={styles.boardLink}>
          {copy.openBoard}
        </Link>
      </div>
      <ul className={styles.contentGrid}>
        {sortContent(data).map((item) => (
          <li key={item.id}>
            <ContentCard
              item={item}
              projectName={projectName}
              today={today}
              onChangeStatus={setChanging}
            />
          </li>
        ))}
      </ul>
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
