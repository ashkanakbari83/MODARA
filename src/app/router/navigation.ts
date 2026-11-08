import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Clapperboard,
  FolderKanban,
  House,
  Images,
  ListChecks,
  Settings,
  Smartphone,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavId =
  | 'home'
  | 'today'
  | 'calendar'
  | 'tasks'
  | 'content'
  | 'projects'
  | 'stories'
  | 'assets'
  | 'team'
  | 'finance'
  | 'time'
  | 'analytics'
  | 'reminders'
  | 'settings'

export type NavGroupId = 'daily' | 'production' | 'business' | 'system'

export interface NavItem {
  id: NavId
  path: string
  icon: LucideIcon
  /** Roadmap phase in which the real page is built. */
  phase: 1 | 2 | 3 | 4
}

export interface NavGroup {
  id: NavGroupId
  items: readonly NavItem[]
}

export const navGroups: readonly NavGroup[] = [
  {
    id: 'daily',
    items: [
      { id: 'home', path: '/', icon: House, phase: 1 },
      { id: 'today', path: '/today', icon: CalendarCheck, phase: 1 },
      { id: 'calendar', path: '/calendar', icon: CalendarDays, phase: 1 },
      { id: 'tasks', path: '/tasks', icon: ListChecks, phase: 1 },
    ],
  },
  {
    id: 'production',
    items: [
      { id: 'content', path: '/content', icon: Clapperboard, phase: 1 },
      { id: 'projects', path: '/projects', icon: FolderKanban, phase: 1 },
      { id: 'stories', path: '/stories', icon: Smartphone, phase: 2 },
      { id: 'assets', path: '/assets', icon: Images, phase: 2 },
      { id: 'team', path: '/team', icon: Users, phase: 2 },
    ],
  },
  {
    id: 'business',
    items: [
      { id: 'finance', path: '/finance', icon: Wallet, phase: 3 },
      { id: 'time', path: '/time-tracking', icon: Timer, phase: 3 },
      { id: 'analytics', path: '/analytics', icon: TrendingUp, phase: 3 },
    ],
  },
  {
    id: 'system',
    items: [
      { id: 'reminders', path: '/reminders', icon: Bell, phase: 2 },
      { id: 'settings', path: '/settings', icon: Settings, phase: 4 },
    ],
  },
]

export const navItems: readonly NavItem[] = navGroups.flatMap((group) => group.items)

export const navItemsById = Object.fromEntries(
  navItems.map((item) => [item.id, item]),
) as Record<NavId, NavItem>

/** Primary destinations shown in the mobile bottom navigation. */
export const bottomNavIds: readonly NavId[] = ['home', 'today', 'calendar', 'content', 'projects']

export const bottomNavItems: readonly NavItem[] = bottomNavIds.map((id) => navItemsById[id])
