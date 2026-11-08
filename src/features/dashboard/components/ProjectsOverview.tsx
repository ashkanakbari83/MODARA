import { ChevronLeft } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCompactToman, formatNumber, formatRelativeDay } from '@/lib/format'
import { messages as m } from '@/locales'
import type { ProjectItem } from '../types'
import styles from '../dashboard.module.css'

interface ProjectsOverviewProps {
  projects: readonly ProjectItem[]
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  const headingId = useId()
  const copy = m.dashboard.projects

  return (
    <section aria-labelledby={headingId}>
      <div className={styles.sectionHead}>
        <h2 id={headingId} className={styles.sectionTitle}>
          {copy.title}
        </h2>
        <Link to="/projects" className={styles.cardLink}>
          {copy.viewAll}
          <ChevronLeft size={16} className="icon-forward" aria-hidden="true" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className={styles.empty}>{copy.empty}</p>
      ) : (
        <ul className={styles.projectGrid}>
          {projects.map((project) => (
            <li key={project.id}>
              <Card as="article" className={styles.projectCard}>
                <header className={styles.projectHead}>
                  <span
                    className={styles.projectDot}
                    style={{ backgroundColor: `var(--color-chart-${project.colorIndex})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.projectTitleBlock}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    <p className={styles.projectCategory}>{project.category}</p>
                  </div>
                </header>

                <div>
                  <div className={styles.progressMeta}>
                    <span>{copy.contentProgress}</span>
                    <span className={styles.progressNumbers}>
                      {formatNumber(project.contentPublished)} / {formatNumber(project.contentTarget)}
                    </span>
                  </div>
                  <ProgressBar
                    value={project.contentPublished}
                    max={project.contentTarget}
                    label={copy.contentProgress}
                  />
                </div>

                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>{copy.openTasks}</dt>
                    <dd className={styles.factValue}>
                      {formatNumber(project.openTasks)}
                      {project.overdueTasks > 0 ? (
                        <Badge tone="danger">{`${formatNumber(project.overdueTasks)} ${copy.overdue}`}</Badge>
                      ) : null}
                    </dd>
                  </div>
                  {project.nextDeadline ? (
                    <div className={styles.fact}>
                      <dt>{copy.nextDeadline}</dt>
                      <dd className={styles.factValue}>
                        {project.nextDeadline.title}
                        <span className={styles.factMuted}>
                          {formatRelativeDay(project.nextDeadline.dayOffset)}
                        </span>
                      </dd>
                    </div>
                  ) : null}
                  <div className={styles.fact}>
                    <dt>{copy.contractValue}</dt>
                    <dd className={styles.factValue}>{formatCompactToman(project.monthlyValueToman)}</dd>
                  </div>
                </dl>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
