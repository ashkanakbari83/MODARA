import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { navItems } from '@/app/router/navigation'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { ProjectFormPage } from '@/features/projects/ProjectFormPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ContentDetailPage } from '@/features/content/ContentDetailPage'
import { ContentFormPage } from '@/features/content/ContentFormPage'
import { ContentPage } from '@/features/content/ContentPage'
import { ModulePlaceholderPage } from '@/features/placeholder/ModulePlaceholderPage'
import { NotFoundPage } from '@/features/placeholder/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="content/new" element={<ContentFormPage />} />
            <Route path="content/:contentId" element={<ContentDetailPage />} />
            <Route path="content/:contentId/edit" element={<ContentFormPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="projects/:projectId/edit" element={<ProjectFormPage />} />
            {navItems
              .filter((item) => item.id !== 'home' && item.id !== 'projects' && item.id !== 'content')
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
