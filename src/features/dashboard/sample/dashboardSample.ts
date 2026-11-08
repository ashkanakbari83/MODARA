import type { DashboardInput } from '../types'

/**
 * SAMPLE DATA ONLY.
 * This file exists to preview the dashboard layout before the database exists.
 * Nothing here is real. It is isolated in this folder so it can be deleted
 * once useDashboardData reads from IndexedDB.
 */
export const sampleDashboard: DashboardInput = {
  dailyCapacityMinutes: 300,
  todayTasks: [
    {
      id: 'sample-task-1',
      title: 'تدوین ریلز معرفی خدمات لیزر',
      projectName: 'کلینیک نمونه ۱',
      estimateMinutes: 120,
      status: 'in-progress',
      priority: 'high',
    },
    {
      id: 'sample-task-2',
      title: 'نوشتن متن ریلز مراقبت از پوست',
      projectName: 'کلینیک نمونه ۲',
      estimateMinutes: 60,
      status: 'done',
      priority: 'medium',
    },
    {
      id: 'sample-task-3',
      title: 'هماهنگی زمان فیلم‌برداری با فیلم‌بردار',
      projectName: 'مرکز خرید نمونه',
      estimateMinutes: 30,
      status: 'planned',
      priority: 'medium',
    },
    {
      id: 'sample-task-4',
      title: 'طراحی کاور ریلز تخفیف پاییزی',
      projectName: 'مرکز خرید نمونه',
      estimateMinutes: 45,
      status: 'planned',
      priority: 'low',
    },
    {
      id: 'sample-task-5',
      title: 'بازبینی نسخهٔ نهایی ریلز غرفه‌ها',
      projectName: 'مرکز خرید نمونه',
      estimateMinutes: 15,
      status: 'planned',
      priority: 'low',
    },
  ],
  deadlines: [
    {
      id: 'sample-deadline-1',
      title: 'فیلم‌برداری سه ریلز کلینیک',
      projectName: 'کلینیک نمونه ۱',
      kind: 'filming',
      dayOffset: 1,
    },
    {
      id: 'sample-deadline-2',
      title: 'تحویل تدوین ریلز ۴ تا ۶',
      projectName: 'کلینیک نمونه ۲',
      kind: 'editing',
      dayOffset: 2,
    },
    {
      id: 'sample-deadline-3',
      title: 'بازبینی کارفرما برای ریلز غرفه‌ها',
      projectName: 'مرکز خرید نمونه',
      kind: 'review',
      dayOffset: 3,
    },
    {
      id: 'sample-deadline-4',
      title: 'انتشار ریلز پنجم ماه',
      projectName: 'کلینیک نمونه ۱',
      kind: 'publishing',
      dayOffset: 4,
    },
    {
      id: 'sample-deadline-5',
      title: 'انتشار ریلز تخفیف پاییزی',
      projectName: 'مرکز خرید نمونه',
      kind: 'publishing',
      dayOffset: 6,
    },
  ],
  projects: [
    {
      id: 'sample-project-1',
      name: 'کلینیک نمونه ۱',
      category: 'کلینیک زیبایی',
      colorIndex: 1,
      contentPublished: 7,
      contentTarget: 12,
      openTasks: 6,
      overdueTasks: 1,
      nextDeadline: { title: 'فیلم‌برداری', dayOffset: 1 },
      monthlyValueToman: 45_000_000,
    },
    {
      id: 'sample-project-2',
      name: 'کلینیک نمونه ۲',
      category: 'کلینیک دندان‌پزشکی',
      colorIndex: 2,
      contentPublished: 5,
      contentTarget: 12,
      openTasks: 7,
      overdueTasks: 1,
      nextDeadline: { title: 'تحویل تدوین', dayOffset: 2 },
      monthlyValueToman: 38_000_000,
    },
    {
      id: 'sample-project-3',
      name: 'مرکز خرید نمونه',
      category: 'مرکز خرید',
      colorIndex: 3,
      contentPublished: 9,
      contentTarget: 12,
      openTasks: 5,
      overdueTasks: 0,
      nextDeadline: { title: 'بازبینی کارفرما', dayOffset: 3 },
      monthlyValueToman: 60_000_000,
    },
  ],
  pipeline: [
    { id: 'planning', count: 3 },
    { id: 'production', count: 3 },
    { id: 'editing', count: 3 },
    { id: 'review', count: 4 },
    { id: 'scheduled', count: 2 },
  ],
  finance: {
    receivedToman: 91_000_000,
    expensesToman: 27_000_000,
  },
}
