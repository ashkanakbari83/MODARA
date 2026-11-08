import { SectionCard } from '@/components/ui/SectionCard'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import type { PipelineStage, PipelineStageId } from '../types'
import styles from '../dashboard.module.css'

const STAGE_CLASS: Record<PipelineStageId, string> = {
  planning: styles.stagePlanning,
  production: styles.stageProduction,
  editing: styles.stageEditing,
  review: styles.stageReview,
  scheduled: styles.stageScheduled,
  published: styles.stagePublished,
}

interface PipelineCardProps {
  stages: readonly PipelineStage[]
}

/** Stacked bar showing how this month's content is spread across production stages. */
export function PipelineCard({ stages }: PipelineCardProps) {
  const copy = m.dashboard.pipeline
  const summary = stages
    .map((stage) => `${copy.stages[stage.id]}: ${formatNumber(stage.count)}`)
    .join('، ')

  return (
    <SectionCard title={copy.title}>
      <p className={styles.cardDescription}>{copy.description}</p>
      <div className={styles.stack} role="img" aria-label={summary}>
        {stages
          .filter((stage) => stage.count > 0)
          .map((stage) => (
            <span
              key={stage.id}
              className={cn(styles.stackSegment, STAGE_CLASS[stage.id])}
              style={{ flexGrow: stage.count, flexBasis: 0 }}
            />
          ))}
      </div>
      <ul className={styles.legend}>
        {stages.map((stage) => (
          <li key={stage.id} className={styles.legendItem}>
            <span className={cn(styles.swatch, STAGE_CLASS[stage.id])} aria-hidden="true" />
            <span>{copy.stages[stage.id]}</span>
            <span className={styles.legendCount}>{formatNumber(stage.count)}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
