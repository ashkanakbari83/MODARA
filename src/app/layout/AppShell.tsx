import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { messages as m } from '@/locales'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { BottomNav } from './BottomNav'
import { MenuDrawer } from './MenuDrawer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

/** Responsive application frame: sidebar (desktop), top bar, content, bottom nav (mobile). */
export function AppShell() {
  const collapsed = usePreferencesStore((state) => state.sidebarCollapsed)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={styles.shell} data-collapsed={collapsed}>
      <a className="skip-link" href="#main-content">
        {m.app.skipToContent}
      </a>
      <Sidebar />
      <div className={styles.main}>
        <TopBar onOpenMenu={openMenu} />
        <main id="main-content" className={styles.content} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={closeMenu} />
    </div>
  )
}
