import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'light' | 'dark' | 'system'

interface PreferencesState {
  theme: ThemePreference
  sidebarCollapsed: boolean
  setTheme: (theme: ThemePreference) => void
  toggleSidebar: () => void
}

/**
 * Lightweight UI preferences, stored in localStorage.
 * Business data will live in IndexedDB (added in a later batch), not here.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'modara:preferences',
      version: 1,
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
