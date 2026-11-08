import { Hourglass, Pencil } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { TabPanel, Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import type { Project } from '@/data/models'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import { messages as m } from '@/locales'
import { ProjectContentPanel } from './ProjectContentPanel'
import { ProjectOverviewPanel } from './ProjectOverviewPanel'
import { projectColor, STATUS_TONE } from './projectMeta'
import styles from './ProjectDetailPage.module.css'

const ID_PREFIX = 'project'
const TAB_IDS = [
  'overview',
  'content',
  'calendar',
  'tasks',
  'stories',
  'files',
  'finance',
  'analytics',
  'notes',
] as const
type TabId = (typeof TAB_IDS)[number]

const TABS: TabItem[] = TAB_IDS.map((id) => ({ id, label: m.projects.detail.tabs[id] }))

function ProjectDetail({ project }: { project: Project }) {
  const detail = m.projects.detail
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabId>('overview')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionFailed, setActionFailed] = useState(false)
  const archived = project.status === 'archived'

  const cancelDelete = useCallback(() => setConfirmingDelete(false), [])

  async function toggleArchive() {
    setActionFailed(false)
    setBusy(true)
    try {
      await projectRepository.setStatus(project.id, archived ? 'active' : 'archived')
    } catch {
      setActionFailed(true)
    } finally {
      setBusy(false)
    }
  }

  async function confirmDelete() {
    setActionFailed(false)
    setBusy(true)
    try {
      await projectRepository.remove(project.id)
      navigate('/projects')
    } catch {
      setActionFailed(true)
      setBusy(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description={[project.brandName, project.category].filter(Boolean).join(' – ') || undefined}
        actions={
          <>
            <ButtonLink to={`/projects/${project.id}/edit`} variant="secondary">
              <Pencil size={18} aria-hidden="true" />
              {m.form.edit}
            </ButtonLink>
            <Button variant="secondary" onClick={toggleArchive} disabled={busy}>
              {archived ? m.form.restore : m.form.archive}
            </Button>
            <Button variant="danger" onClick={() => setConfirmingDelete(true)} disabled={busy}>
              {m.form.delete}
            </Button>
          </>
        }
      />

      <div className={styles.statusRow}>
        <span
          className={styles.dot}
          style={{ backgroundColor: projectColor(project.brandColors) }}
          aria-hidden="true"
        />
        <Badge tone={STATUS_TONE[project.status]}>{m.projects.status[project.status]}</Badge>
      </div>

      {archived ? (
        <p className={styles.notice} role="note">
          {detail.archivedNotice}
        </p>
      ) : null}
      {actionFailed ? (
        <p className={styles.errorNotice} role="alert">
          {m.form.actionFailed}
        </p>
      ) : null}

      <Tabs
        label={detail.tabsLabel}
        idPrefix={ID_PREFIX}
        tabs={TABS}
        value={tab}
        onChange={(id) => setTab(id as TabId)}
      />

      <TabPanel idPrefix={ID_PREFIX} id={tab}>
        {tab === 'overview' ? (
          <ProjectOverviewPanel project={project} />
        ) : tab === 'content' ? (
          <ProjectContentPanel projectId={project.id} projectName={project.name} />
        ) : tab === 'notes' ? (
          <Card padding="lg">
            {project.notes ? (
              <p className={styles.notes}>{project.notes}</p>
            ) : (
              <p className={styles.muted}>{detail.notesEmpty}</p>
            )}
          </Card>
        ) : (
          <Card padding="lg">
            <EmptyState
              icon={Hourglass}
              title={detail.tabs[tab]}
              description={detail.tabPending}
            />
          </Card>
        )}
      </TabPanel>

      <ConfirmDialog
        open={confirmingDelete}
        title={detail.deleteTitle}
        description={detail.deleteBody.replace('{name}', project.name)}
        confirmLabel={detail.deleteConfirm}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()
  const { data, error } = useLiveData(
    async () => ({ project: await projectRepository.getById(projectId) }),
    [projectId],
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
  if (!data.project) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={Hourglass}
          title={m.projects.detail.notFoundTitle}
          description={m.projects.detail.notFoundBody}
        >
          <ButtonLink to="/projects">{m.projects.detail.back}</ButtonLink>
        </EmptyState>
      </Card>
    )
  }

  return <ProjectDetail key={data.project.id} project={data.project} />
}
