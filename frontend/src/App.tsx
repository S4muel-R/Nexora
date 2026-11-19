import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { Layout, RequireRole } from './components/Layout'
import { AttendancePage } from './pages/AttendancePage'
import { GroupsPage } from './pages/GroupsPage'
import { HomePage } from './pages/HomePage'
import { InstitutionsPage } from './pages/InstitutionsPage'
import { LoginPage } from './pages/LoginPage'
import { MyInstitutionPage } from './pages/MyInstitutionPage'
import { ReportsPage } from './pages/ReportsPage'
import { StudentsPage } from './pages/StudentsPage'
import { TeachersPage } from './pages/TeachersPage'

const guarded = (path: string, element: React.ReactNode) => (
  <Route path={path} element={<RequireRole path={path}>{element}</RequireRole>} />
)

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/ingresar" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {guarded('/instituciones', <InstitutionsPage />)}
        {guarded('/mi-institucion', <MyInstitutionPage />)}
        {guarded('/estudiantes', <StudentsPage />)}
        {guarded('/docentes', <TeachersPage />)}
        {guarded('/grupos', <GroupsPage />)}
        {guarded('/asistencia', <AttendancePage />)}
        {guarded('/reportes', <ReportsPage />)}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
