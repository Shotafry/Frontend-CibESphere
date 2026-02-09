// src/components/ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types' // Importamos Role

interface ProtectedRouteProps {
  allowedRoles?: Role[] // --- MODIFICADO: Usamos nuestro enum Role
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/loginsign-up' replace />
  }

  // --- MODIFICADO: Comprobar roles ---
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Si el rol no está permitido, redirige al inicio
    return <Navigate to='/' replace />
  }

  // --- NUEVO: Organizer Guard (Onboarding) ---
  // Si es organizador pero no tiene organización, forzar redirección a crear organización
  if (
    user?.role === Role.Organizer &&
    !user.organization &&
    location.pathname !== '/crear-organizacion'
  ) {
    return <Navigate to='/crear-organizacion' replace />
  }

  return <Outlet />
}
