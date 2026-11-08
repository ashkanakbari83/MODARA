import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { messages as m } from '@/locales'
import { navItemsById } from '@/app/router/navigation'
import type { NavId } from '@/app/router/navigation'

interface ModulePlaceholderPageProps {
  navId: NavId
}

/** Honest stand-in for sections that are not built yet. It has no fake data or controls. */
export function ModulePlaceholderPage({ navId }: ModulePlaceholderPageProps) {
  const item = navItemsById[navId]

  return (
    <>
      <PageHeader title={m.nav[navId]} description={m.placeholder.description} />
      <Card padding="lg">
        <EmptyState
          icon={item.icon}
          title={m.placeholder.title}
          description={m.placeholder.body}
          badge={
            <Badge tone="warning">{`${m.placeholder.plannedIn} ${formatNumber(item.phase)}`}</Badge>
          }
        >
          <ButtonLink to="/">{m.placeholder.backHome}</ButtonLink>
        </EmptyState>
      </Card>
    </>
  )
}
