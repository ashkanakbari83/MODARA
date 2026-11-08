import { SearchX } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { messages as m } from '@/locales'

export function NotFoundPage() {
  return (
    <Card padding="lg">
      <EmptyState icon={SearchX} title={m.notFound.title} description={m.notFound.body}>
        <ButtonLink to="/">{m.notFound.backHome}</ButtonLink>
      </EmptyState>
    </Card>
  )
}
