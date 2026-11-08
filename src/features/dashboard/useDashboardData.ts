import { useMemo } from 'react'
import { currentDate } from '@/lib/now'
import { buildDashboardViewModel } from './dashboardSelectors'
import { sampleDashboard } from './sample/dashboardSample'
import type { DashboardViewModel } from './types'

export interface DashboardState {
  /** "sample" until the database layer is added; then "database". */
  source: 'sample' | 'database'
  data: DashboardViewModel
}

/**
 * Single entry point for dashboard data.
 * Batch 1 returns clearly marked sample data. A later batch replaces the body
 * with a query against IndexedDB and returns source: 'database'.
 */
export function useDashboardData(): DashboardState {
  return useMemo<DashboardState>(
    () => ({
      source: 'sample',
      data: buildDashboardViewModel(sampleDashboard, currentDate()),
    }),
    [],
  )
}
