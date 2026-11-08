import { Monitor, Moon, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { useResolvedTheme } from '@/hooks/useResolvedTheme'
import { messages as m } from '@/locales'
import { usePreferencesStore } from '@/stores/preferencesStore'
import type { ThemePreference } from '@/stores/preferencesStore'
import styles from './ThemeToggle.module.css'

const OPTIONS: ReadonlyArray<{ value: ThemePreference; icon: LucideIcon }> = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
]

interface ThemeToggleProps {
  /** "icon" flips light/dark; "segmented" offers light, dark and system. */
  variant: 'icon' | 'segmented'
}

export function ThemeToggle({ variant }: ThemeToggleProps) {
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)
  const resolved = useResolvedTheme()

  if (variant === 'icon') {
    const next = resolved === 'dark' ? 'light' : 'dark'
    const Icon = resolved === 'dark' ? Sun : Moon
    return (
      <IconButton
        label={next === 'light' ? m.theme.switchToLight : m.theme.switchToDark}
        onClick={() => setTheme(next)}
      >
        <Icon size={20} aria-hidden="true" />
      </IconButton>
    )
  }

  return (
    <div className={styles.group} role="group" aria-label={m.theme.label}>
      {OPTIONS.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={styles.option}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          <Icon size={18} aria-hidden="true" />
          <span>{m.theme[value]}</span>
        </button>
      ))}
    </div>
  )
}
