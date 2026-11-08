import { addDays } from '@/lib/format'
import type {
  DashboardInput,
  DashboardViewModel,
  FinanceSummary,
  PipelineStage,
} from './types'

const sum = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0)

/**
 * Turns raw dashboard input into the numbers the UI renders.
 * Every total is derived here, so sample (and later real) data cannot disagree with itself.
 */
export function buildDashboardViewModel(input: DashboardInput, today: Date): DashboardViewModel {
  const totalMinutes = input.dailyCapacityMinutes
  const plannedMinutes = sum(input.todayTasks.map((task) => task.estimateMinutes))
  const completedMinutes = sum(
    input.todayTasks.filter((task) => task.status === 'done').map((task) => task.estimateMinutes),
  )

  const published = sum(input.projects.map((project) => project.contentPublished))
  const pipeline: PipelineStage[] = [...input.pipeline, { id: 'published', count: published }]

  const contractedToman = sum(input.projects.map((project) => project.monthlyValueToman))
  const { receivedToman, expensesToman } = input.finance
  const finance: FinanceSummary = {
    contractedToman,
    receivedToman,
    outstandingToman: Math.max(0, contractedToman - receivedToman),
    expensesToman,
    netToman: receivedToman - expensesToman,
    receivedRatio: contractedToman > 0 ? Math.min(1, receivedToman / contractedToman) : 0,
  }

  return {
    today,
    capacity: {
      totalMinutes,
      plannedMinutes,
      completedMinutes,
      remainingMinutes: plannedMinutes - completedMinutes,
      availableMinutes: Math.max(0, totalMinutes - plannedMinutes),
      overMinutes: Math.max(0, plannedMinutes - totalMinutes),
      isOver: plannedMinutes > totalMinutes,
    },
    stats: {
      activeProjects: input.projects.length,
      openTasks: sum(input.projects.map((project) => project.openTasks)),
      overdueTasks: sum(input.projects.map((project) => project.overdueTasks)),
      awaitingReview: pipeline.find((stage) => stage.id === 'review')?.count ?? 0,
    },
    todayTasks: input.todayTasks,
    deadlines: [...input.deadlines]
      .sort((a, b) => a.dayOffset - b.dayOffset)
      .map((deadline) => ({ ...deadline, date: addDays(today, deadline.dayOffset) })),
    projects: input.projects.map((project) => ({
      ...project,
      nextDeadline: project.nextDeadline
        ? {
            ...project.nextDeadline,
            date: addDays(today, project.nextDeadline.dayOffset),
          }
        : null,
    })),
    pipeline,
    finance,
  }
}
