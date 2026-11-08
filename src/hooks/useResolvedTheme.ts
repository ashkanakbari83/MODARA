import { useSyncExternalStore } from 'react'
import { usePreferencesStore } from '@/stores/preferencesStore'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribe(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(DARK_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(DARK_QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

/** The theme actually shown: the user's choice, or the system setting. */
export function useResolvedTheme(): 'light' | 'dark' {
  const preference = usePreferencesStore((state) => state.theme)
  const systemPrefersDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}
