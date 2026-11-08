import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/data/models'
import { formatCompactToman, formatIsoDate, formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import { projectColor, STATUS_TONE } from './projectMeta'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const copy = m.projects.card
  const subtitle = [project.brandName, project.category].filter(Boolean).join(' – ')

  return (
    <Link to={`/projects/${project.id}`} className={styles.card}>
      <div className={styles.head}>
        <span
          className={styles.dot}
          style={{ backgroundColor: projectColor(project.brandColors) }}
          aria-hidden="true"
        />
        <div className={styles.titleBlock}>
          <h2 className={styles.name}>{project.name}</h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        <Badge tone={STATUS_TONE[project.status]}>{m.projects.status[project.status]}</Badge>
      </div>

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>{copy.monthlyBudget}</dt>
          <dd>
            {project.monthlyBudgetToman > 0
              ? formatCompactToman(project.monthlyBudgetToman)
              : copy.notSet}
          </dd>
        </div>
        <div className={styles.fact}>
          <dt>{copy.contractEnd}</dt>
          <dd>{project.contractEndDate ? formatIsoDate(project.contractEndDate) : copy.notSet}</dd>
        </div>
        <div className={styles.fact}>
          <dt>{copy.services}</dt>
          <dd>{formatNumber(project.services.length)}</dd>
        </div>
      </dl>
    </Link>
  )
}
