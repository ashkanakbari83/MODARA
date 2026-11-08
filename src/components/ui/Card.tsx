import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Card.module.css'

interface CardProps {
  as?: 'div' | 'section' | 'article'
  padding?: 'none' | 'md' | 'lg'
  className?: string
  /** id of the element that labels this card (for sections). */
  labelledBy?: string
  children: ReactNode
}

export function Card({
  as: Tag = 'div',
  padding = 'md',
  className,
  labelledBy,
  children,
}: CardProps) {
  return (
    <Tag className={cn(styles.card, styles[padding], className)} aria-labelledby={labelledBy}>
      {children}
    </Tag>
  )
}
