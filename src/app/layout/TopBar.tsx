import { Menu } from 'lucide-react'
import { BrandMark } from '@/components/ui/BrandMark'
import { IconButton } from '@/components/ui/IconButton'
import { formatJalaliLong } from '@/lib/format'
import { messages as m } from '@/locales'
import { ThemeToggle } from './ThemeToggle'
import styles from './TopBar.module.css'

interface TopBarProps {
  onOpenMenu: () => void
}

export function TopBar({ onOpenMenu }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <div className={styles.menuSlot}>
        <IconButton
          label={m.navigation.openMenu}
          onClick={onOpenMenu}
          aria-haspopup="dialog"
        >
          <Menu size={22} aria-hidden="true" />
        </IconButton>
      </div>
      <div className={styles.brand}>
        <BrandMark size={28} />
        <span className={styles.brandName}>{m.app.name}</span>
      </div>
      <p className={styles.date}>{formatJalaliLong(new Date())}</p>
      <div className={styles.actions}>
        <ThemeToggle variant="icon" />
      </div>
    </header>
  )
}
