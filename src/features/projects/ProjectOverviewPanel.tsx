import { Card } from '@/components/ui/Card'
import type { Project, ProjectService } from '@/data/models'
import { formatCompactToman, formatIsoDate, formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import styles from './ProjectDetailPage.module.css'

const info = m.projects.detail.info

function serviceName(service: ProjectService): string {
  return service.serviceType === 'custom'
    ? service.customName
    : m.projects.serviceTypes[service.serviceType]
}

interface OverviewPanelProps {
  project: Project
}

export function ProjectOverviewPanel({ project }: OverviewPanelProps) {
  const detail = m.projects.detail
  const rows: Array<{ label: string; value: string | null; ltr?: boolean }> = [
    { label: info.brand, value: project.brandName || null },
    { label: info.category, value: project.category || null },
    { label: info.contactPerson, value: project.contactPerson || null },
    { label: info.phone, value: project.phone || null, ltr: true },
    { label: info.email, value: project.email || null, ltr: true },
    { label: info.instagram, value: project.instagram || null, ltr: true },
    { label: info.startDate, value: project.startDate ? formatIsoDate(project.startDate) : null },
    {
      label: info.endDate,
      value: project.contractEndDate ? formatIsoDate(project.contractEndDate) : null,
    },
    {
      label: info.budget,
      value: project.monthlyBudgetToman > 0 ? formatCompactToman(project.monthlyBudgetToman) : null,
    },
    { label: info.contractType, value: m.projects.contractTypes[project.contractType] },
  ]

  return (
    <div className={styles.panelStack}>
      <Card padding="lg">
        {project.description ? <p className={styles.description}>{project.description}</p> : null}
        <dl className={styles.infoGrid}>
          {rows.map((row) => (
            <div key={row.label} className={styles.infoItem}>
              <dt>{row.label}</dt>
              <dd dir={row.ltr && row.value ? 'ltr' : undefined} className={row.ltr ? styles.ltr : undefined}>
                {row.value ?? <span className={styles.muted}>{info.notSet}</span>}
              </dd>
            </div>
          ))}
          <div className={styles.infoItem}>
            <dt>{info.colors}</dt>
            <dd>
              {project.brandColors.length === 0 ? (
                <span className={styles.muted}>{info.notSet}</span>
              ) : (
                <ul className={styles.swatches}>
                  {project.brandColors.map((color, index) => (
                    <li key={`${color}-${index}`}>
                      <span
                        className={styles.swatch}
                        style={{ backgroundColor: color }}
                        role="img"
                        aria-label={color}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <Card padding="lg">
        <h2 className={styles.sectionTitle}>{detail.services}</h2>
        {project.services.length === 0 ? (
          <p className={styles.muted}>{detail.noServices}</p>
        ) : (
          <ul className={styles.services}>
            {project.services.map((service) => (
              <li key={service.id} className={styles.service}>
                <h3 className={styles.serviceName}>{serviceName(service)}</h3>
                <dl className={styles.serviceFacts}>
                  <div>
                    <dt>{detail.quantity}</dt>
                    <dd>
                      {formatNumber(service.quantity)} {service.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>{detail.price}</dt>
                    <dd>
                      {service.priceToman > 0 ? (
                        formatCompactToman(service.priceToman)
                      ) : (
                        <span className={styles.muted}>{info.notSet}</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>{detail.responsible}</dt>
                    <dd>
                      {service.responsible || <span className={styles.muted}>{info.notSet}</span>}
                    </dd>
                  </div>
                </dl>
                {service.deliveryRequirements ? (
                  <p className={styles.delivery}>
                    <span className={styles.muted}>{detail.delivery}: </span>
                    {service.deliveryRequirements}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
