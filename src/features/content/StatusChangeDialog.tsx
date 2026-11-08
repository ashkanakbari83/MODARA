import { useState } from 'react'
import type { FormEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField } from '@/components/ui/FormFields'
import type { SelectOption } from '@/components/ui/FormFields'
import { Modal } from '@/components/ui/Modal'
import { CONTENT_STATUSES } from '@/data/models'
import type { ContentItem, ContentStatus } from '@/data/models'
import { messages as m } from '@/locales'
import { STATUS_TONE } from './contentMeta'
import styles from './StatusChangeDialog.module.css'

const STATUS_OPTIONS: SelectOption[] = CONTENT_STATUSES.map((value) => ({
  value,
  label: m.content.statuses[value],
}))

interface StatusChangeDialogProps {
  item: ContentItem
  onClose: () => void
  /** Saves the change. The caller closes the dialog when it resolves. */
  onConfirm: (toStatus: ContentStatus, note: string) => Promise<void>
}

/** The only place where a person moves content to a new workflow status. */
export function StatusChangeDialog({ item, onClose, onConfirm }: StatusChangeDialogProps) {
  const copy = m.content.statusDialog
  const [toStatus, setToStatus] = useState<ContentStatus>(item.status)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const unchanged = toStatus === item.status

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (unchanged || busy) return
    setBusy(true)
    setFailed(false)
    try {
      await onConfirm(toStatus, note)
    } catch {
      setFailed(true)
      setBusy(false)
    }
  }

  return (
    <Modal title={copy.title} onClose={onClose} busy={busy}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.itemTitle}>{item.title}</p>
        <p className={styles.current}>
          {copy.current}: <Badge tone={STATUS_TONE[item.status]}>{m.content.statuses[item.status]}</Badge>
        </p>
        <SelectField
          label={copy.next}
          value={toStatus}
          options={STATUS_OPTIONS}
          error={unchanged ? copy.same : undefined}
          onChange={(value) => setToStatus(value as ContentStatus)}
        />
        <TextAreaField
          label={copy.note}
          hint={copy.noteHint}
          rows={3}
          value={note}
          onChange={setNote}
        />
        {failed ? (
          <p className={styles.failed} role="alert">
            {m.form.actionFailed}
          </p>
        ) : null}
        <div className={styles.actions}>
          <Button type="submit" disabled={busy || unchanged}>
            {busy ? m.form.saving : copy.confirm}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {m.form.cancel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
