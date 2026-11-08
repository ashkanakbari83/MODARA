import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './IconButton.module.css'

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Accessible name; also used as the tooltip. */
  label: string
  children: ReactNode
}

export function IconButton({
  label,
  children,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.button, className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </button>
  )
}
