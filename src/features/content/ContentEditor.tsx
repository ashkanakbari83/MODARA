import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SelectField, TextAreaField, TextField } from '@/components/ui/FormFields'
import type { SelectOption } from '@/components/ui/FormFields'
import { JalaliDateField } from '@/components/ui/JalaliDateField'
import { CONTENT_STATUSES, CONTENT_TYPES, PRIORITIES } from '@/data/models'
import type {
  ContentInput,
  ContentStatus,
  ContentType,
  Priority,
} from '@/data/models'
import { messages as m } from '@/locales'
import { parseContentForm, toContentFormState } from './contentFormModel'
import type { ContentFormErrors, ContentFormState } from './contentFormModel'
import styles from './ContentEditor.module.css'

const copy = m.content.form

const TYPE_OPTIONS: SelectOption[] = CONTENT_TYPES.map((value) => ({
  value,
  label: m.content.types[value],
}))
const PRIORITY_OPTIONS: SelectOption[] = PRIORITIES.map((value) => ({
  value,
  label: m.content.priorities[value],
}))
const STATUS_OPTIONS: SelectOption[] = CONTENT_STATUSES.map((value) => ({
  value,
  label: m.content.statuses[value],
}))

interface ContentEditorProps {
  projects: ReadonlyArray<{ id: string; name: string; archived: boolean }>
  initial: ContentInput
  initialStatus?: ContentStatus
  /** Creating lets the user pick the first status; editing never changes it. */
  showStatus: boolean
  submitLabel: string
  onSubmit: (input: ContentInput, status: ContentStatus) => Promise<void>
  onCancel: () => void
}

export function ContentEditor({
  projects,
  initial,
  initialStatus = 'idea',
  showStatus,
  submitLabel,
  onSubmit,
  onCancel,
}: ContentEditorProps) {
  const [state, setState] = useState<ContentFormState>(() =>
    toContentFormState(initial, initialStatus),
  )
  const [errors, setErrors] = useState<ContentFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  function setField<K extends keyof ContentFormState>(key: K, value: ContentFormState[K]) {
    setState((previous) => ({ ...previous, [key]: value }))
  }

  const projectOptions: SelectOption[] = [
    { value: '', label: copy.projectChoose },
    ...projects
      .filter((project) => !project.archived || project.id === state.projectId)
      .map((project) => ({ value: project.id, label: project.name })),
  ]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const result = parseContentForm(state)
    setErrors(result.errors)
    setSaveFailed(false)

    if (!result.input) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }

    setSaving(true)
    try {
      await onSubmit(result.input, result.status)
    } catch {
      setSaveFailed(true)
      setSaving(false)
      requestAnimationFrame(() => summaryRef.current?.focus())
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {hasErrors || saveFailed ? (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1}>
          {saveFailed ? m.form.saveFailed : m.form.fixErrors}
        </div>
      ) : null}

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.basics}</h2>
        <div className={styles.grid}>
          <SelectField
            label={copy.project}
            value={state.projectId}
            options={projectOptions}
            error={errors.projectId}
            onChange={(value) => setField('projectId', value)}
          />
          <TextField
            label={copy.title}
            required
            value={state.title}
            error={errors.title}
            onChange={(value) => setField('title', value)}
          />
          <SelectField
            label={copy.type}
            value={state.contentType}
            options={TYPE_OPTIONS}
            onChange={(value) => setField('contentType', value as ContentType)}
          />
          {state.contentType === 'custom' ? (
            <TextField
              label={copy.customType}
              required
              value={state.customTypeName}
              error={errors.customTypeName}
              onChange={(value) => setField('customTypeName', value)}
            />
          ) : null}
          <SelectField
            label={copy.priority}
            value={state.priority}
            options={PRIORITY_OPTIONS}
            onChange={(value) => setField('priority', value as Priority)}
          />
          {showStatus ? (
            <SelectField
              label={copy.initialStatus}
              hint={copy.initialStatusHint}
              value={state.status}
              options={STATUS_OPTIONS}
              onChange={(value) => setField('status', value as ContentStatus)}
            />
          ) : null}
          <TextField
            label={copy.topic}
            value={state.topic}
            onChange={(value) => setField('topic', value)}
          />
          <TextField
            label={copy.audience}
            value={state.targetAudience}
            onChange={(value) => setField('targetAudience', value)}
          />
        </div>
        <TextAreaField
          label={copy.description}
          rows={3}
          value={state.description}
          onChange={(value) => setField('description', value)}
        />
        <TextAreaField
          label={copy.objective}
          rows={2}
          value={state.objective}
          onChange={(value) => setField('objective', value)}
        />
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.creative}</h2>
        <TextAreaField
          label={copy.hook}
          rows={2}
          value={state.hook}
          onChange={(value) => setField('hook', value)}
        />
        <TextAreaField
          label={copy.script}
          rows={8}
          value={state.script}
          onChange={(value) => setField('script', value)}
        />
        <TextAreaField
          label={copy.caption}
          rows={4}
          value={state.caption}
          onChange={(value) => setField('caption', value)}
        />
        <div className={styles.grid}>
          <TextField
            label={copy.cta}
            value={state.callToAction}
            onChange={(value) => setField('callToAction', value)}
          />
          <TextField
            label={copy.hashtags}
            value={state.hashtags}
            onChange={(value) => setField('hashtags', value)}
          />
        </div>
        <TextAreaField
          label={copy.links}
          hint={copy.linksHint}
          rows={3}
          value={state.referenceLinks}
          error={errors.referenceLinks}
          onChange={(value) => setField('referenceLinks', value)}
        />
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.production}</h2>
        <div className={styles.grid}>
          <TextField
            label={copy.assignee}
            value={state.assignee}
            onChange={(value) => setField('assignee', value)}
          />
          <span aria-hidden="true" className={styles.spacer} />
          <TextField
            label={copy.estimated}
            inputMode="decimal"
            dir="ltr"
            value={state.estimatedHours}
            error={errors.estimatedHours}
            onChange={(value) => setField('estimatedHours', value)}
          />
          <TextField
            label={copy.actual}
            inputMode="decimal"
            dir="ltr"
            value={state.actualHours}
            error={errors.actualHours}
            onChange={(value) => setField('actualHours', value)}
          />
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.dates}</h2>
        <p className={styles.sectionHint}>{copy.datesHint}</p>
        <div className={styles.grid}>
          <JalaliDateField
            label={copy.filming}
            value={state.filmingDate}
            onChange={(value) => setField('filmingDate', value)}
          />
          <JalaliDateField
            label={copy.rawFootage}
            value={state.rawFootageDate}
            onChange={(value) => setField('rawFootageDate', value)}
          />
          <JalaliDateField
            label={copy.editingDeadline}
            value={state.editingDeadline}
            onChange={(value) => setField('editingDeadline', value)}
          />
          <JalaliDateField
            label={copy.reviewDeadline}
            value={state.reviewDeadline}
            onChange={(value) => setField('reviewDeadline', value)}
          />
          <JalaliDateField
            label={copy.publishDate}
            value={state.publishDate}
            onChange={(value) => setField('publishDate', value)}
          />
        </div>
      </Card>

      <Card as="section" padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>{copy.sections.publication}</h2>
        <TextField
          label={copy.publicationUrl}
          type="url"
          inputMode="url"
          dir="ltr"
          autoComplete="off"
          value={state.publicationUrl}
          error={errors.publicationUrl}
          onChange={(value) => setField('publicationUrl', value)}
        />
        <TextAreaField
          label={copy.notes}
          rows={4}
          value={state.notes}
          onChange={(value) => setField('notes', value)}
        />
      </Card>

      <div className={styles.actions}>
        <Button type="submit" disabled={saving}>
          {saving ? m.form.saving : submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          {m.form.cancel}
        </Button>
      </div>
    </form>
  )
}
