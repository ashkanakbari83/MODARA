import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { navItems } from '@/app/router/navigation'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ModulePlaceholderPage } from '@/features/placeholder/ModulePlaceholderPage'
import { NotFoundPage } from '@/features/placeholder/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            {navItems
              .filter((item) => item.id !== 'home')
              .map((item) => (
                <Route
                  key={item.id}
                  path={item.path}
                  element={<ModulePlaceholderPage navId={item.id} />}
                />
              ))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
