import { Copy, Hourglass, Pencil } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import type { ContentItem, ContentStatus, ContentStatusChange } from '@/data/models'
import { contentRepository } from '@/data/repositories/contentRepository'
import { projectRepository } from '@/data/repositories/projectRepository'
import { useLiveData } from '@/data/useLiveData'
import { formatDuration, formatIsoDate, formatJalaliDateTime } from '@/lib/format'
import { messages as m } from '@/locales'
import { contentTypeLabel, PRIORITY_TONE, STATUS_TONE } from './contentMeta'
import { StatusChangeDialog } from './StatusChangeDialog'
import styles from './ContentDetailPage.module.css'

const detail = m.content.detail
const form = m.content.form

function dateRows(item: ContentItem): Array<{ label: string; value: string | null }> {
  const format = (iso: string | null) => (iso ? formatIsoDate(iso) : null)
  return [
    { label: form.filming, value: format(item.filmingDate) },
    { label: form.rawFootage, value: format(item.rawFootageDate) },
    { label: form.editingDeadline, value: format(item.editingDeadline) },
    { label: form.reviewDeadline, value: format(item.reviewDeadline) },
    { label: form.publishDate, value: format(item.publishDate) },
  ]
}

function TextBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className={styles.block}>
      <h3 className={styles.blockLabel}>{label}</h3>
      <p className={styles.blockText}>{value}</p>
    </div>
  )
}

function HistoryEntry({ entry }: { entry: ContentStatusChange }) {
  const labels = m.content.statuses
  return (
    <li className={styles.historyItem}>
      <p className={styles.historyWhat}>
        {entry.fromStatus === null ? (
          <>
            {detail.historyCreated}{' '}
            <Badge tone={STATUS_TONE[entry.toStatus]}>{labels[entry.toStatus]}</Badge>
          </>
        ) : (
          <>
            {detail.from} <Badge tone={STATUS_TONE[entry.fromStatus]}>{labels[entry.fromStatus]}</Badge>{' '}
            {detail.to} <Badge tone={STATUS_TONE[entry.toStatus]}>{labels[entry.toStatus]}</Badge>
          </>
        )}
      </p>
      <p className={styles.historyWhen}>{formatJalaliDateTime(entry.changedAt)}</p>
      {entry.note ? <p className={styles.historyNote}>{entry.note}</p> : null}
    </li>
  )
}

interface ContentDetailProps {
  item: ContentItem
  projectName: string | undefined
  history: readonly ContentStatusChange[]
}

function ContentDetail({ item, projectName, history }: ContentDetailProps) {
  const navigate = useNavigate()
  const [changingStatus, setChangingStatus] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionFailed, setActionFailed] = useState(false)

  const cancelDelete = useCallback(() => setConfirmingDelete(false), [])
  const closeStatusDialog = useCallback(() => setChangingStatus(false), [])

  async function confirmStatusChange(toStatus: ContentStatus, note: string) {
    await contentRepository.changeStatus(item.id, toStatus, note)
    setChangingStatus(false)
  }

  async function duplicate() {
    setActionFailed(false)
    setBusy(true)
    try {
      const copy = await contentRepository.duplicate(
        item.id,
        `${item.title} (${detail.duplicateSuffix})`,
      )
      navigate(`/content/${copy.id}`)
    } catch {
      setActionFailed(true)
      setBusy(false)
    }
  }

  async function confirmDelete() {
    setActionFailed(false)
    setBusy(true)
    try {
      await contentRepository.remove(item.id)
      navigate('/content')
    } catch {
      setActionFailed(true)
      setBusy(false)
      setConfirmingDelete(false)
    }
  }

  const notSet = <span className={styles.muted}>{detail.notSet}</span>

  return (
    <>
      <PageHeader
        title={item.title}
        actions={
          <>
            <ButtonLink to={`/content/${item.id}/edit`} variant="secondary">
              <Pencil size={18} aria-hidden="true" />
              {m.form.edit}
            </ButtonLink>
            <Button
              variant="secondary"
              onClick={duplicate}
              disabled={busy}
              title={detail.duplicateNote}
            >
              <Copy size={18} aria-hidden="true" />
              {detail.duplicate}
            </Button>
            <Button variant="danger" onClick={() => setConfirmingDelete(true)} disabled={busy}>
              {m.form.delete}
            </Button>
          </>
        }
      />

      {actionFailed ? (
        <p className={styles.errorNotice} role="alert">
          {m.form.actionFailed}
        </p>
      ) : null}

      <div className={styles.layout}>
        <div className={styles.main}>
          <Card padding="lg">
            <div className={styles.statusRow}>
              <div>
                <p className={styles.statusLabel}>{detail.status}</p>
                <Badge tone={STATUS_TONE[item.status]}>{m.content.statuses[item.status]}</Badge>
              </div>
              <Button onClick={() => setChangingStatus(true)}>{detail.changeStatus}</Button>
            </div>
          </Card>

          <Card padding="lg">
            <dl className={styles.facts}>
              <div>
                <dt>{detail.project}</dt>
                <dd>
                  {projectName ? (
                    <Link to={`/projects/${item.projectId}`} className={styles.link}>
                      {projectName}
                    </Link>
                  ) : (
                    notSet
                  )}
                </dd>
              </div>
              <div>
                <dt>{detail.type}</dt>
                <dd>{contentTypeLabel(item)}</dd>
              </div>
              <div>
                <dt>{detail.priority}</dt>
                <dd>
                  <Badge tone={PRIORITY_TONE[item.priority]}>
                    {m.content.priorities[item.priority]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>{detail.assignee}</dt>
                <dd>{item.assignee || notSet}</dd>
              </div>
              <div>
                <dt>{detail.estimated}</dt>
                <dd>{item.estimatedMinutes > 0 ? formatDuration(item.estimatedMinutes) : notSet}</dd>
              </div>
              <div>
                <dt>{detail.actual}</dt>
                <dd>{item.actualMinutes > 0 ? formatDuration(item.actualMinutes) : notSet}</dd>
              </div>
              <div>
                <dt>{form.topic}</dt>
                <dd>{item.topic || notSet}</dd>
              </div>
              <div>
                <dt>{form.audience}</dt>
                <dd>{item.targetAudience || notSet}</dd>
              </div>
            </dl>
          </Card>

          <Card padding="lg">
            <h2 className={styles.sectionTitle}>{detail.sections.dates}</h2>
            <dl className={styles.facts}>
              {dateRows(item).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value ?? notSet}</dd>
                </div>
              ))}
              <div>
                <dt>{detail.publicationUrl}</dt>
                <dd>
                  {item.publicationUrl ? (
                    <a
                      href={item.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className={styles.link}
                    >
                      {item.publicationUrl}
                    </a>
                  ) : (
                    notSet
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          <Card padding="lg">
            <h2 className={styles.sectionTitle}>{detail.sections.creative}</h2>
            <TextBlock label={form.description} value={item.description} />
            <TextBlock label={form.objective} value={item.objective} />
            <TextBlock label={form.hook} value={item.hook} />
            <TextBlock label={form.script} value={item.script} />
            <TextBlock label={form.caption} value={item.caption} />
            <TextBlock label={form.cta} value={item.callToAction} />
            <TextBlock label={form.hashtags} value={item.hashtags} />
            {item.referenceLinks.length > 0 ? (
              <div className={styles.block}>
                <h3 className={styles.blockLabel}>{form.links}</h3>
                <ul className={styles.links}>
                  {item.referenceLinks.map((link) => (
                    <li key={link}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className={styles.link}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <TextBlock label={form.notes} value={item.notes} />
          </Card>
        </div>

        <aside className={styles.side} aria-labelledby="content-history-title">
          <Card padding="lg">
            <h2 id="content-history-title" className={styles.sectionTitle}>
              {detail.history}
            </h2>
            <ol className={styles.history}>
              {history.map((entry) => (
                <HistoryEntry key={entry.id} entry={entry} />
              ))}
            </ol>
          </Card>
        </aside>
      </div>

      {changingStatus ? (
        <StatusChangeDialog
          item={item}
          onClose={closeStatusDialog}
          onConfirm={confirmStatusChange}
        />
      ) : null}

      <ConfirmDialog
        open={confirmingDelete}
        title={detail.deleteTitle}
        description={detail.deleteBody.replace('{name}', item.title)}
        confirmLabel={detail.deleteConfirm}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export function ContentDetailPage() {
  const { contentId = '' } = useParams()
  const { data, error } = useLiveData(async () => {
    const item = await contentRepository.getById(contentId)
    if (!item) return { item: undefined, projectName: undefined, history: [] }
    const [project, history] = await Promise.all([
      projectRepository.getById(item.projectId),
      contentRepository.historyFor(item.id),
    ])
    return { item, projectName: project?.name, history }
  }, [contentId])

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
  if (!data.item) {
    return (
      <Card padding="lg">
        <EmptyState icon={Hourglass} title={detail.notFoundTitle} description={detail.notFoundBody}>
          <ButtonLink to="/content">{detail.back}</ButtonLink>
        </EmptyState>
      </Card>
    )
  }

  return (
    <ContentDetail
      key={data.item.id}
      item={data.item}
      projectName={data.projectName}
      history={data.history}
    />
  )
}
