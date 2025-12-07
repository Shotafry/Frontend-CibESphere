// src/App.tsx
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  useLocation,
  useNavigationType,
  redirect,
  RouterProvider
} from 'react-router-dom'
import React, { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Role, User, EventFilterParams } from './types'
import * as apiService from './services/apiService'

// Importación de todas las páginas
import LandingPage from './pages/LandingPage'
import SignUp from './pages/SignUp'
import Eventos from './pages/Eventos'
import PanelDeUsuario from './pages/PanelDeUsuario'
import PanelDeOrganizador from './pages/PanelDeOrganizador'
import Page from './pages/Page'
import ErrorPage from './pages/ErrorPage'
import TestFont from './pages/test-font'
import OrganizationProfile from './pages/OrganizationProfile'
import UserProfile from './pages/UserProfile'

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from '@mui/material'

import './global.css'

// Componente Wrapper (sin cambios)
const AppWrapper = () => {
  const location = useLocation()
  const pathname = location.pathname
  const action = useNavigationType()

  useEffect(() => {
    if (action !== 'POP') {
      window.scrollTo(0, 0)
    }
  }, [action, pathname])

  useEffect(() => {
    let title = 'CibESphere'
    let metaDescription =
      'Plataforma central de eventos de ciberseguridad en España.'

    if (pathname.startsWith('/eventos/')) {
      title = 'Detalle del Evento - CibESphere'
    } else if (pathname === '/panel-de-usuario') {
      title = 'Mi Panel - CibESphere'
    } else if (pathname === '/panel-de-organizador') {
      title = 'Panel de Organizador - CibESphere'
    } else if (pathname === '/crear-evento') {
      title = 'Crear Evento - CibESphere'
    } else if (pathname.endsWith('/editar')) {
      title = 'Editar Evento - CibESphere'
    } else if (pathname === '/loginsign-up') {
      title = 'Acceso / Registro - CibESphere'
    } else if (pathname.startsWith('/organizacion/')) {
      title = 'Perfil de Organización - CibESphere'
    }

    document.title = title

    const metaDescriptionTag = document.querySelector(
      'head > meta[name="description"]'
    )
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', metaDescription)
    }
  }, [pathname])

  return (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  )
}

// --- DEFINICIÓN DE RUTAS ---
const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
        loader: async ({ request }) => {
          const url = new URL(request.url)
          const searchParams = url.searchParams

          const filters: EventFilterParams = {
            startDate: searchParams.get('startDate')
              ? new Date(searchParams.get('startDate')!)
              : null,
            endDate: searchParams.get('endDate')
              ? new Date(searchParams.get('endDate')!)
              : null,
            tags: searchParams.getAll('tags') || [],
            locations: searchParams.getAll('locations') || [],
            levels: searchParams.getAll('levels') || [],
            languages: searchParams.getAll('languages') || []
          }

          const events = await apiService.getEvents(filters)
          return { events, filters }
        }
      },
      {
        path: 'login',
        element: <SignUp />
      },
      {
        path: 'registro',
        element: <SignUp />
      },
      {
        path: 'loginsign-up', // Mantener por compatibilidad si se usa en algún link
        element: <SignUp />
      },
      {
        path: 'eventos/:slug',
        element: <Eventos />,
        loader: async ({ params }) => {
          if (!params.slug) {
            throw new Response('Not Found', { status: 404 })
          }
          return apiService.getEventBySlug(params.slug)
        }
      },
      {
        path: 'organizacion/:slug',
        element: <OrganizationProfile />,
        loader: async ({ params }) => {
          if (!params.slug) {
            throw new Response('Not Found', { status: 404 })
          }
          const org = await apiService.getOrganizationBySlug(params.slug)
          const events = await apiService.getOrganizationEvents(org.id)
          return { organization: org, events }
        }
      },
      {
        path: 'usuario/:id',
        element: <UserProfile />,
        loader: async ({ params }) => {
          if (!params.id) {
            throw new Response('Not Found', { status: 404 })
          }
          const user = await apiService.getUserById(params.id)
          return { user }
        }
      },

      // --- Rutas Protegidas Asistentes ---
      {
        element: <ProtectedRoute allowedRoles={[Role.User, Role.Admin]} />,
        children: [
          {
            path: 'panel-de-usuario',
            element: <PanelDeUsuario />,
            loader: async () => {
              const userStr = localStorage.getItem('user')
              if (!userStr) return redirect('/loginsign-up')
              const user = JSON.parse(userStr) as User
              return user.FavoriteEvents || []
            }
          }
        ]
      },

      // --- Rutas Protegidas Organizador ---
      {
        element: <ProtectedRoute allowedRoles={[Role.Organizer, Role.Admin]} />,
        children: [
          {
            path: 'panel-de-organizador',
            element: <PanelDeOrganizador />,
            loader: async () => {
              const userStr = localStorage.getItem('user')
              if (!userStr) return redirect('/loginsign-up')
              const user = JSON.parse(userStr) as User
              if (!user.organization) {
                return {
                  stats: {
                    total_events: 0,
                    total_attendees: 0,
                    total_cities: 0,
                    published_events: 0
                  },
                  events: []
                }
              }
              const orgId = user.organization.id
              const statsPromise = apiService.getOrganizerDashboard(orgId)
              const eventsPromise = apiService.getOrganizationEvents(orgId)
              const [stats, events] = await Promise.all([
                statsPromise,
                eventsPromise
              ])
              return { stats, events }
            }
          },
          {
            path: 'crear-evento',
            element: <Page />
          },
          {
            path: 'eventos/:slug/editar',
            element: <Page />,
            loader: async ({ params }) => {
              if (!params.slug) {
                throw new Response('Not Found', { status: 404 })
              }
              return apiService.getEventBySlug(params.slug)
            }
          }
        ]
      },
      {
        path: 'test-font',
        element: <TestFont />
      }
    ]
  }
]

// Creación del router
export const router = createBrowserRouter(routes)

// Componente App
const muiTheme = createTheme({
  typography: {
    fontFamily: "'Satoshi', Arial, Helvetica, sans-serif"
  }
})

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
