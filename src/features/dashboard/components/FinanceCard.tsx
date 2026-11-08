import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionCard } from '@/components/ui/SectionCard'
import { cn } from '@/lib/cn'
import { formatCompactToman, formatPercent } from '@/lib/format'
import { messages as m } from '@/locales'
import type { FinanceSummary } from '../types'
import styles from '../dashboard.module.css'

interface FinanceCardProps {
  finance: FinanceSummary
}

/** Contract value and cash are shown separately on purpose: net profit comes from cash received. */
export function FinanceCard({ finance }: FinanceCardProps) {
  const copy = m.dashboard.finance
  const shareText = `${formatPercent(finance.receivedRatio)} ${copy.receivedShare}`

  const rows = [
    { id: 'contracted', label: copy.contracted, value: finance.contractedToman, net: false },
    { id: 'received', label: copy.received, value: finance.receivedToman, net: false },
    { id: 'outstanding', label: copy.outstanding, value: finance.outstandingToman, net: false },
    { id: 'expenses', label: copy.expenses, value: finance.expensesToman, net: false },
    { id: 'net', label: copy.net, value: finance.netToman, net: true },
  ]

  return (
    <SectionCard title={copy.title}>
      <p className={styles.financeShare}>{shareText}</p>
      <ProgressBar value={finance.receivedRatio} max={1} tone="success" label={shareText} />
      <dl className={styles.financeRows}>
        {rows.map((row) => (
          <div key={row.id} className={cn(styles.financeRow, row.net && styles.financeNet)}>
            <dt>{row.label}</dt>
            <dd>{formatCompactToman(row.value)}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>{copy.note}</p>
    </SectionCard>
  )
}
