import type {
  ContentInput,
  ContentStatus,
  ContentType,
  Priority,
} from '@/data/models'
import { formatHoursForInput } from '@/lib/format'
import { parseNumberInput } from '@/lib/numbers'
import { messages as m } from '@/locales'

/** Editable copy of a content item. Numbers and link lists stay as text while typing. */
export interface ContentFormState {
  projectId: string
  title: string
  contentType: ContentType
  customTypeName: string
  description: string
  objective: string
  topic: string
  targetAudience: string
  hook: string
  script: string
  caption: string
  callToAction: string
  hashtags: string
  referenceLinks: string
  assignee: string
  estimatedHours: string
  actualHours: string
  priority: Priority
  /** Initial status, used only when creating. Editing never changes the status. */
  status: ContentStatus
  filmingDate: string
  rawFootageDate: string
  editingDeadline: string
  reviewDeadline: string
  publishDate: string
  publicationUrl: string
  notes: string
}

export type ContentFormErrors = Record<string, string>

export function emptyContentInput(projectId = ''): ContentInput {
  return {
    projectId,
    title: '',
    contentType: 'reel',
    customTypeName: '',
    description: '',
    objective: '',
    topic: '',
    targetAudience: '',
    hook: '',
    script: '',
    caption: '',
    callToAction: '',
    hashtags: '',
    referenceLinks: [],
    assignee: '',
    estimatedMinutes: 0,
    actualMinutes: 0,
    priority: 'medium',
    filmingDate: null,
    rawFootageDate: null,
    editingDeadline: null,
    reviewDeadline: null,
    publishDate: null,
    publicationUrl: '',
    notes: '',
  }
}

export function toContentFormState(
  input: ContentInput,
  status: ContentStatus = 'idea',
): ContentFormState {
  return {
    projectId: input.projectId,
    title: input.title,
    contentType: input.contentType,
    customTypeName: input.customTypeName,
    description: input.description,
    objective: input.objective,
    topic: input.topic,
    targetAudience: input.targetAudience,
    hook: input.hook,
    script: input.script,
    caption: input.caption,
    callToAction: input.callToAction,
    hashtags: input.hashtags,
    referenceLinks: input.referenceLinks.join('\n'),
    assignee: input.assignee,
    estimatedHours: formatHoursForInput(input.estimatedMinutes),
    actualHours: formatHoursForInput(input.actualMinutes),
    priority: input.priority,
    status,
    filmingDate: input.filmingDate ?? '',
    rawFootageDate: input.rawFootageDate ?? '',
    editingDeadline: input.editingDeadline ?? '',
    reviewDeadline: input.reviewDeadline ?? '',
    publishDate: input.publishDate ?? '',
    publicationUrl: input.publicationUrl,
    notes: input.notes,
  }
}

const URL_PATTERN = /^https?:\/\/\S+$/i

function hoursToMinutes(hours: number | null): number {
  return hours === null ? 0 : Math.round(hours * 60)
}

/** Validates the form. Returns the cleaned input (and initial status) when valid. */
export function parseContentForm(state: ContentFormState): {
  input: ContentInput | null
  status: ContentStatus
  errors: ContentFormErrors
} {
  const errors: ContentFormErrors = {}
  const copy = m.content.form.errors

  const title = state.title.trim()
  if (!title) errors.title = copy.titleRequired
  if (!state.projectId) errors.projectId = copy.projectRequired

  const customTypeName = state.customTypeName.trim()
  if (state.contentType === 'custom' && !customTypeName) {
    errors.customTypeName = copy.customTypeRequired
  }

  const estimated = parseNumberInput(state.estimatedHours)
  const actual = parseNumberInput(state.actualHours)
  if (Number.isNaN(estimated)) errors.estimatedHours = copy.invalidNumber
  if (Number.isNaN(actual)) errors.actualHours = copy.invalidNumber

  const publicationUrl = state.publicationUrl.trim()
  if (publicationUrl && !URL_PATTERN.test(publicationUrl)) errors.publicationUrl = copy.invalidUrl

  const referenceLinks = state.referenceLinks
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  if (referenceLinks.some((link) => !URL_PATTERN.test(link))) errors.referenceLinks = copy.invalidUrl

  if (Object.keys(errors).length > 0) return { input: null, status: state.status, errors }

  return {
    errors,
    status: state.status,
    input: {
      projectId: state.projectId,
      title,
      contentType: state.contentType,
      customTypeName: state.contentType === 'custom' ? customTypeName : '',
      description: state.description.trim(),
      objective: state.objective.trim(),
      topic: state.topic.trim(),
      targetAudience: state.targetAudience.trim(),
      hook: state.hook.trim(),
      script: state.script.trim(),
      caption: state.caption.trim(),
      callToAction: state.callToAction.trim(),
      hashtags: state.hashtags.trim(),
      referenceLinks,
      assignee: state.assignee.trim(),
      estimatedMinutes: hoursToMinutes(estimated),
      actualMinutes: hoursToMinutes(actual),
      priority: state.priority,
      filmingDate: state.filmingDate || null,
      rawFootageDate: state.rawFootageDate || null,
      editingDeadline: state.editingDeadline || null,
      reviewDeadline: state.reviewDeadline || null,
      publishDate: state.publishDate || null,
      publicationUrl,
      notes: state.notes.trim(),
    },
  }
}
