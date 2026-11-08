import { DeadlinesCard } from './components/DeadlinesCard'
import { FinanceCard } from './components/FinanceCard'
import { PipelineCard } from './components/PipelineCard'
import { ProjectsOverview } from './components/ProjectsOverview'
import { SampleDataNotice } from './components/SampleDataNotice'
import { StatsStrip } from './components/StatsStrip'
import { TodayCard } from './components/TodayCard'
import { TodayHero } from './components/TodayHero'
import styles from './dashboard.module.css'
import { useDashboardData } from './useDashboardData'

export function DashboardPage() {
  const { source, data } = useDashboardData()

  return (
    <div className={styles.layout}>
      <TodayHero today={data.today} capacity={data.capacity} />
      {source === 'sample' ? <SampleDataNotice /> : null}
      <StatsStrip stats={data.stats} />

      <div className={styles.twoCol}>
        <TodayCard tasks={data.todayTasks} />
        <DeadlinesCard deadlines={data.deadlines} />
      </div>

      <ProjectsOverview projects={data.projects} />

      <div className={styles.twoCol}>
        <PipelineCard stages={data.pipeline} />
        <FinanceCard finance={data.finance} />
      </div>
    </div>
  )
}
