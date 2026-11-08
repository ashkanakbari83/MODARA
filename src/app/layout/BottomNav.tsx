import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { messages as m } from '@/locales'
import { bottomNavItems } from '@/app/router/navigation'
import styles from './BottomNav.module.css'

/** Mobile and tablet primary navigation (hidden from 1024px). */
export function BottomNav() {
  return (
    <nav className={styles.bar} aria-label={m.navigation.mobile}>
      <ul className={styles.list}>
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className={styles.item}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => cn(styles.link, isActive && styles.active)}
              >
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                <span>{m.nav[item.id]}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
