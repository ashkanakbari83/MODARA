import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { messages as m } from '@/locales'
import { navGroups } from '@/app/router/navigation'
import { ThemeToggle } from './ThemeToggle'
import styles from './MenuDrawer.module.css'

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

const DESKTOP_QUERY = '(min-width: 64rem)'

/** Mobile bottom sheet listing every section. Keyboard accessible, with focus trap. */
export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const sheet = sheetRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sheet?.querySelector<HTMLElement>('[data-autofocus]')?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !sheet) return

      const focusable = sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // Close the sheet if the viewport grows to desktop size while it is open.
    const desktopQuery = window.matchMedia(DESKTOP_QUERY)
    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', handleResize)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', handleResize)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={m.navigation.menuTitle}
      >
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <h2 className={styles.title}>{m.navigation.menuTitle}</h2>
          <IconButton label={m.navigation.closeMenu} onClick={onClose} data-autofocus>
            <X size={22} aria-hidden="true" />
          </IconButton>
        </div>

        <nav aria-label={m.navigation.primary} className={styles.nav}>
          {navGroups.map((group) => (
            <div key={group.id} className={styles.group}>
              <p className={styles.groupTitle}>{m.navGroups[group.id]}</p>
              <ul className={styles.grid}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={({ isActive }) => cn(styles.link, isActive && styles.active)}
                      >
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                        <span>{m.nav[item.id]}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <ThemeToggle variant="segmented" />
        </div>
      </div>
    </div>
  )
}
