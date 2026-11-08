import { FolderKanban } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Project } from '@/data/models'
import { contentRepository } from '@/data/repositories/contentRepository'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import { messages as m } from '@/locales'
import { ContentEditor } from './ContentEditor'
import { emptyContentInput } from './contentFormModel'
import styles from './ContentPage.module.css'

function toProjectOptions(projects: readonly Project[]) {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    archived: project.status === 'archived',
  }))
}

function CreateContent() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const presetProject = params.get('project') ?? ''
  const { data, error } = useLiveData(() => projectRepository.list(), [])

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
  if (data.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={FolderKanban}
          title={m.content.needProjectTitle}
          description={m.content.needProjectBody}
        >
          <ButtonLink to="/projects/new">{m.content.needProjectAction}</ButtonLink>
        </EmptyState>
      </Card>
    )
  }

  const presetIsValid = data.some((project) => project.id === presetProject)

  return (
    <>
      <PageHeader title={m.content.form.createTitle} />
      <ContentEditor
        projects={toProjectOptions(data)}
        initial={emptyContentInput(presetIsValid ? presetProject : '')}
        showStatus
        submitLabel={m.form.save}
        onSubmit={async (input, status) => {
          const item = await contentRepository.create(input, status)
          navigate(`/content/${item.id}`)
        }}
        onCancel={() => navigate(presetIsValid ? `/projects/${presetProject}` : '/content')}
      />
    </>
  )
}

function EditContent({ contentId }: { contentId: string }) {
  const navigate = useNavigate()
  const { data, error } = useLiveData(
    async () => ({
      item: await contentRepository.getById(contentId),
      projects: await projectRepository.list(),
    }),
    [contentId],
  )

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
  const { item, projects } = data
  if (!item) {
    return (
      <p className={styles.message} role="alert">
        {m.content.detail.notFoundBody}
      </p>
    )
  }

  return (
    <>
      <PageHeader title={m.content.form.editTitle} description={item.title} />
      <ContentEditor
        key={item.id}
        projects={toProjectOptions(projects)}
        initial={item}
        initialStatus={item.status}
        showStatus={false}
        submitLabel={m.form.save}
        onSubmit={async (input) => {
          await contentRepository.update(item.id, input)
          navigate(`/content/${item.id}`)
        }}
        onCancel={() => navigate(`/content/${item.id}`)}
      />
    </>
  )
}

/** One page for both "new content" and "edit content". */
export function ContentFormPage() {
  const { contentId } = useParams()
  return contentId ? <EditContent contentId={contentId} /> : <CreateContent />
}
