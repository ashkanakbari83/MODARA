import { ChevronsRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandMark } from '@/components/ui/BrandMark'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { messages as m } from '@/locales'
import { navGroups } from '@/app/router/navigation'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { ThemeToggle } from './ThemeToggle'
import styles from './Sidebar.module.css'

/** Desktop navigation (shown from 1024px). Mobile uses the bottom bar and menu sheet. */
export function Sidebar() {
  const collapsed = usePreferencesStore((state) => state.sidebarCollapsed)
  const toggleSidebar = usePreferencesStore((state) => state.toggleSidebar)

  return (
    <aside className={styles.sidebar} data-collapsed={collapsed}>
      <div className={styles.brand}>
        <BrandMark size={36} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>{m.app.name}</span>
          <span className={styles.brandTagline}>{m.app.tagline}</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label={m.navigation.primary}>
        {navGroups.map((group) => (
          <div key={group.id} className={styles.group}>
            <p className={styles.groupTitle}>{m.navGroups[group.id]}</p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon
                const label = m.nav[item.id]
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) => cn(styles.link, isActive && styles.active)}
                    >
                      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      <span className={styles.linkLabel}>{label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <ThemeToggle variant={collapsed ? 'icon' : 'segmented'} />
        <IconButton
          label={collapsed ? m.navigation.expandSidebar : m.navigation.collapseSidebar}
          onClick={toggleSidebar}
          aria-expanded={!collapsed}
        >
          <ChevronsRight size={20} className={styles.collapseIcon} aria-hidden="true" />
        </IconButton>
      </div>
    </aside>
  )
}
