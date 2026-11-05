import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { Layout, RequireRole } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { InstitutionsPage } from './pages/InstitutionsPage'
import { LoginPage } from './pages/LoginPage'
import { MyInstitutionPage } from './pages/MyInstitutionPage'
import { StudentsPage } from './pages/StudentsPage'

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
