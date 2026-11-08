import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './Tabs.module.css'

export interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  /** Accessible name of the tab list. */
  label: string
  /** Unique prefix used to build element ids shared with TabPanel. */
  idPrefix: string
  tabs: readonly TabItem[]
  value: string
  onChange: (id: string) => void
}

function tabId(prefix: string, id: string): string {
  return `${prefix}-tab-${id}`
}

function panelId(prefix: string, id: string): string {
  return `${prefix}-panel-${id}`
}

/** Accessible tab list with arrow-key, Home and End support (RTL aware). */
export function Tabs({ label, idPrefix, tabs, value, onChange }: TabsProps) {
  function select(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length]
    onChange(target.id)
    document.getElementById(tabId(idPrefix, target.id))?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = document.documentElement.dir === 'rtl'
    const next = rtl ? 'ArrowLeft' : 'ArrowRight'
    const previous = rtl ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === next) {
      event.preventDefault()
      select(index + 1)
    } else if (event.key === previous) {
      event.preventDefault()
      select(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      select(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      select(tabs.length - 1)
    }
  }

  return (
    <div className={styles.scroller}>
      <div className={styles.list} role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const selected = tab.id === value
          return (
            <button
              key={tab.id}
              id={tabId(idPrefix, tab.id)}
              type="button"
              role="tab"
              className={cn(styles.tab, selected && styles.selected)}
              aria-selected={selected}
              aria-controls={panelId(idPrefix, tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface TabPanelProps {
  idPrefix: string
  id: string
  children: ReactNode
}

export function TabPanel({ idPrefix, id, children }: TabPanelProps) {
  return (
    <div
      id={panelId(idPrefix, id)}
      role="tabpanel"
      aria-labelledby={tabId(idPrefix, id)}
      tabIndex={0}
      className={styles.panel}
    >
      {children}
    </div>
  )
}
