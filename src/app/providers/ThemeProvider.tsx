import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useResolvedTheme } from '@/hooks/useResolvedTheme'

const THEME_COLORS = { light: '#eff2f6', dark: '#0a101c' } as const

interface ThemeProviderProps {
  children: ReactNode
}

/** Applies the resolved theme to the document (data-theme, color-scheme, theme-color). */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useResolvedTheme()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  return <>{children}</>
}
