import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../contexts/AuthContext'
import { PrivateRoute } from '../components/PrivateRoute'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Doctors } from '../pages/Doctors'
import { Appointments } from '../pages/Appointments'
import { Schedule } from '../pages/Schedule'
import { NotFound } from '../pages/NotFound'
import { Profile } from '../pages/Profile'

const queryClient = new QueryClient()

export function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard"        element={<Dashboard />} />
              <Route path="/consultas"        element={<Appointments />} />
              <Route path="/medicos"          element={<Doctors />} />
              <Route path="/agendar/:doctorId" element={<Schedule />} />
              <Route path="/perfil" element={<Profile />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
