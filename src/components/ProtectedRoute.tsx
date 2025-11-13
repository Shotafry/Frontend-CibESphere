// src/components/ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role } from '../types' // Importamos Role

interface ProtectedRouteProps {
  allowedRoles?: Role[] // --- MODIFICADO: Usamos nuestro enum Role
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/loginsign-up' replace />
  }

  // --- MODIFICADO: Comprobar roles ---
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Si el rol no está permitido, redirige al inicio
    // (Ej. un 'user' intentando entrar a /panel-de-organizador)
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
