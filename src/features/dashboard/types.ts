export type TaskStatus = 'done' | 'in-progress' | 'planned'
export type TaskPriority = 'high' | 'medium' | 'low'
export type DeadlineKind = 'filming' | 'editing' | 'review' | 'publishing'
export type PipelineStageId =
  | 'planning'
  | 'production'
  | 'editing'
  | 'review'
  | 'scheduled'
  | 'published'
export type ProjectColorIndex = 1 | 2 | 3 | 4 | 5 | 6

/* ---------- Raw input (today this is sample data; later it comes from the database) ---------- */

export interface DashboardTask {
  id: string
  title: string
  projectName: string
  estimateMinutes: number
  status: TaskStatus
  priority: TaskPriority
}

export interface DashboardDeadlineInput {
  id: string
  title: string
  projectName: string
  kind: DeadlineKind
  /** Days from today. */
  dayOffset: number
}

export interface DashboardProjectInput {
  id: string
  name: string
  category: string
  colorIndex: ProjectColorIndex
  contentPublished: number
  contentTarget: number
  openTasks: number
  overdueTasks: number
  nextDeadline: { title: string; dayOffset: number } | null
  monthlyValueToman: number
}

export interface DashboardInput {
  dailyCapacityMinutes: number
  todayTasks: readonly DashboardTask[]
  deadlines: readonly DashboardDeadlineInput[]
  projects: readonly DashboardProjectInput[]
  /** Counts for every stage except "published", which is derived from projects. */
  pipeline: ReadonlyArray<{ id: Exclude<PipelineStageId, 'published'>; count: number }>
  finance: { receivedToman: number; expensesToman: number }
}

/* ---------- View model (what the dashboard components render) ---------- */

export interface CapacitySummary {
  totalMinutes: number
  plannedMinutes: number
  completedMinutes: number
  remainingMinutes: number
  availableMinutes: number
  overMinutes: number
  isOver: boolean
}

export interface StatsSummary {
  activeProjects: number
  openTasks: number
  overdueTasks: number
  awaitingReview: number
}

export interface DeadlineItem extends DashboardDeadlineInput {
  date: Date
}

export interface ProjectItem extends Omit<DashboardProjectInput, 'nextDeadline'> {
  nextDeadline: { title: string; dayOffset: number; date: Date } | null
}

export interface PipelineStage {
  id: PipelineStageId
  count: number
}

export interface FinanceSummary {
  contractedToman: number
  receivedToman: number
  outstandingToman: number
  expensesToman: number
  netToman: number
  /** 0..1 */
  receivedRatio: number
}

export interface DashboardViewModel {
  today: Date
  capacity: CapacitySummary
  stats: StatsSummary
  todayTasks: readonly DashboardTask[]
  deadlines: readonly DeadlineItem[]
  projects: readonly ProjectItem[]
  pipeline: readonly PipelineStage[]
  finance: FinanceSummary
}
