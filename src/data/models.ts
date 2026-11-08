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
