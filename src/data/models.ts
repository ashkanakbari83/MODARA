/**
 * Persistent data models.
 * Relations use stable string ids (never array positions or names).
 * Dates without a time are stored as civil Gregorian "YYYY-MM-DD" strings and
 * shown to the user as Jalali dates.
 */

export type ID = string
export type IsoDate = string
export type IsoDateTime = string

export const PROJECT_STATUSES = ['active', 'paused', 'completed', 'archived'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const CONTRACT_TYPES = ['monthly', 'per-project', 'per-content', 'other'] as const
export type ContractType = (typeof CONTRACT_TYPES)[number]

export const SERVICE_TYPES = [
  'video-production',
  'video-editing',
  'cover-design',
  'scriptwriting',
  'story-design',
  'content-planning',
  'publishing',
  'reporting',
  'custom',
] as const
export type ServiceType = (typeof SERVICE_TYPES)[number]

export interface ProjectService {
  id: ID
  serviceType: ServiceType
  /** Only used when serviceType is "custom". */
  customName: string
  quantity: number
  unit: string
  /** Agreed price for this line, in Toman. */
  priceToman: number
  /** Free text until team members are built. */
  responsible: string
  deliveryRequirements: string
}

export interface Project {
  id: ID
  name: string
  brandName: string
  description: string
  category: string
  brandColors: string[]
  contactPerson: string
  phone: string
  email: string
  instagram: string
  startDate: IsoDate | null
  contractEndDate: IsoDate | null
  monthlyBudgetToman: number
  contractType: ContractType
  status: ProjectStatus
  notes: string
  services: ProjectService[]
  /** Reserved for the team module. */
  teamMemberIds: ID[]
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export interface AppSettings {
  id: 'workspace'
  /** Daily working capacity in minutes. Default 5 hours. */
  dailyCapacityMinutes: number
  /** JavaScript weekday numbers: 0 = Sunday ... 6 = Saturday. */
  workingDays: number[]
  timeZone: string
  updatedAt: IsoDateTime
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'workspace',
  dailyCapacityMinutes: 300,
  workingDays: [6, 0, 1, 2, 3],
  timeZone: 'Asia/Tehran',
  updatedAt: '1970-01-01T00:00:00.000Z',
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/** Production workflow statuses, in pipeline order. Only the user changes them. */
export const CONTENT_STATUSES = [
  'idea',
  'script-writing',
  'script-approval-pending',
  'script-approved',
  'filming-planned',
  'waiting-raw-footage',
  'raw-footage-received',
  'editing',
  'internal-review',
  'client-review',
  'revision-required',
  'final-approval',
  'scheduled',
  'published',
  'archived',
] as const
export type ContentStatus = (typeof CONTENT_STATUSES)[number]

export const CONTENT_TYPES = [
  'reel',
  'story',
  'carousel',
  'static-post',
  'campaign',
  'website',
  'custom',
] as const
export type ContentType = (typeof CONTENT_TYPES)[number]

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type Priority = (typeof PRIORITIES)[number]

export interface ContentItem {
  id: ID
  projectId: ID
  title: string
  contentType: ContentType
  /** Only used when contentType is "custom". */
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
  referenceLinks: string[]
  /** Free text until team members are built. */
  assignee: string
  estimatedMinutes: number
  actualMinutes: number
  priority: Priority
  /** Changed only through contentRepository.changeStatus, never automatically. */
  status: ContentStatus
  /* The dates below are independent: none is derived from another. */
  filmingDate: IsoDate | null
  rawFootageDate: IsoDate | null
  editingDeadline: IsoDate | null
  reviewDeadline: IsoDate | null
  publishDate: IsoDate | null
  publicationUrl: string
  notes: string
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

/** Everything the edit form controls. Status is deliberately not part of it. */
export type ContentInput = Omit<ContentItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>

export interface ContentStatusChange {
  id: ID
  contentId: ID
  /** null for the entry that records the content's creation. */
  fromStatus: ContentStatus | null
  toStatus: ContentStatus
  note: string
  changedAt: IsoDateTime
}
