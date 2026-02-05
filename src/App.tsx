// src/App.tsx
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  useLocation,
  useNavigationType,
  redirect,
  RouterProvider,
  ShouldRevalidateFunction
} from 'react-router-dom'
import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
import PanelDeAdministrador from './pages/PanelDeAdministrador'
import CrearEvento from './pages/CrearEvento'
import ErrorPage from './pages/ErrorPage'
import TestFont from './pages/test-font'
import OrganizationProfile from './pages/OrganizationProfile'
import AboutUs from './pages/AboutUs'
import UserProfile from './pages/UserProfile'
import TerminosYCondiciones from './pages/TerminosYCondiciones'
import PoliticaCookies from './pages/PoliticaCookies'
import Contacto from './pages/Contacto'
import ProgramaVulnerabilidades from './pages/ProgramaVulnerabilidades'
import VerifyEmail from './pages/VerifyEmail'
import CheckEmail from './pages/CheckEmail'
import CreateOrganization from './pages/CreateOrganization'

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from '@mui/material'

import './global.css'
import { CookieProvider } from './context/CookieContext'
import CookieBanner from './components/CookieBanner'

// Componente Wrapper (sin cambios)
const AppWrapper: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname
  const action = useNavigationType()

  /* 
     Fix: Track previous pathname to prevent scroll reset on query param changes 
     (e.g., switching tabs in panels) 
  */
  const prevPathname = React.useRef(pathname)

  useEffect(() => {
    if (action !== 'POP' && pathname !== prevPathname.current) {
      window.scrollTo(0, 0)
    }
    prevPathname.current = pathname
  }, [action, pathname])

  useEffect(() => {
    let title = 'CybESphere'
    let metaDescription =
      'Plataforma central de eventos de ciberseguridad en España.'

    if (pathname.startsWith('/eventos/')) {
      title = 'Detalle del Evento - CybESphere'
    } else if (pathname === '/panel-de-usuario') {
      title = 'Mi Panel - CybESphere'
    } else if (pathname === '/panel-de-organizador') {
      title = 'Panel de Organizador - CybESphere'
    } else if (pathname === '/crear-evento') {
      title = 'Crear Evento - CybESphere'
    } else if (pathname.endsWith('/editar')) {
      title = 'Editar Evento - CybESphere'
    } else if (pathname === '/loginsign-up') {
      title = 'Acceso / Registro - CybESphere'
    } else if (pathname.startsWith('/organizacion/')) {
      title = 'Perfil de Organización - CybESphere'
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
      <CookieProvider>
        <Layout>
          <Outlet />
        </Layout>
        <CookieBanner />
      </CookieProvider>
    </AuthProvider>
  )
}

// Helper to prevent loader re-run on query param changes (tabs)
const shouldRevalidatePanel: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate
}) => {
  // If we are just changing query params (e.g. tabs), don't revalidate loader
  if (
    currentUrl.pathname === nextUrl.pathname &&
    currentUrl.search !== nextUrl.search
  ) {
    return false
  }
  return defaultShouldRevalidate
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

          // Parse dates
          const startDate = searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : null
          const endDate = searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : null

          // Determine timeFilter (only apply if no dates are set)
          const hasDateFilters = startDate || endDate
          const timeFilterParam = searchParams.get('timeFilter') as
            | 'upcoming'
            | 'past'
            | 'all'
            | null
          const timeFilter = hasDateFilters
            ? undefined
            : timeFilterParam || 'upcoming'

          const filters: EventFilterParams = {
            startDate,
            endDate,
            tags: searchParams.getAll('tags') || [],
            locations: searchParams.getAll('locations') || [],
            levels: searchParams.getAll('levels') || [],
            languages: searchParams.getAll('languages') || [],
            is_online: searchParams.has('is_online')
              ? searchParams.get('is_online') === 'true'
              : undefined,
            timeFilter,
            limit: 15
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
        path: 'sobre-nosotros',
        element: <AboutUs />
      },
      {
        path: 'terminos',
        element: <TerminosYCondiciones />
      },
      {
        path: 'cookies',
        element: <PoliticaCookies />
      },
      {
        path: 'contacto',
        element: <Contacto />
      },
      {
        path: 'vdp',
        element: <ProgramaVulnerabilidades />
      },
      {
        path: 'loginsign-up', // Mantener por compatibilidad si se usa en algún link
        element: <SignUp />
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />
      },
      {
        path: 'check-email',
        element: <CheckEmail />
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
        path: 'u/:slug',
        element: <UserProfile />,
        loader: async ({ params }) => {
          if (!params.slug) {
            throw new Response('Not Found', { status: 404 })
          }
          const user = await apiService.getPublicUserProfile(params.slug)
          return { user }
        }
      },
      {
        path: 'usuario/:userId',
        element: <UserProfile />,
        loader: async ({ params }) => {
          if (!params.userId) {
            throw new Response('Not Found', { status: 404 })
          }
          const user = await apiService.getPublicUserProfile(params.userId)
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
              const favoriteEvents =
                user?.favorite_events || user?.FavoriteEvents || []
              return favoriteEvents
            },
            shouldRevalidate: shouldRevalidatePanel
          },
          // Permite acceso a usuarios normales para crear organización (onboarding)
          {
            path: 'crear-organizacion',
            element: <CreateOrganization />
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
              const orgPromise = apiService.getMyOrganization()
              let organization = null
              let stats = {
                total_events: 0,
                total_attendees: 0,
                total_cities: 0,
                published_events: 0
              }
              let events: any[] = []

              try {
                // Primero intentamos obtener la organización fresca
                organization = await orgPromise

                if (organization && organization.id) {
                  const orgId = organization.id
                  const statsPromise = apiService.getOrganizerDashboard(orgId)
                  const eventsPromise = apiService.getOrganizationEvents(orgId)

                  const [fetchedStats, fetchedEvents] = await Promise.all([
                    statsPromise,
                    eventsPromise
                  ])
                  stats = fetchedStats
                  events = fetchedEvents
                }
              } catch (error) {
                console.error('Error loading organizer data:', error)
              }

              return { stats, events, organization }
            },
            shouldRevalidate: shouldRevalidatePanel
          },
          {
            path: 'crear-evento',
            element: <CrearEvento />
          },
          {
            path: 'eventos/:slug/editar',
            element: <CrearEvento />,
            loader: async ({ params }) => {
              if (!params.slug) {
                throw new Response('Not Found', { status: 404 })
              }
              return apiService.getEventBySlug(params.slug)
            }
          }
        ]
      },
      // --- Rutas Protegidas Administrador ---
      {
        element: <ProtectedRoute allowedRoles={[Role.Admin]} />,
        children: [
          {
            path: 'admin',
            element: <PanelDeAdministrador />,
            loader: async () => {
              const stats = await apiService.getAdminDashboard()
              return { stats }
            },
            shouldRevalidate: shouldRevalidatePanel
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
const router = createBrowserRouter(routes)

// Componente App
const theme = createTheme({
  palette: {
    primary: {
      main: '#01c0fa',
      contrastText: '#fff'
    },
    secondary: {
      main: '#4fbac8'
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff'
    },
    text: {
      primary: '#282828',
      secondary: '#414651'
    },
    grey: {
      100: '#f5f5f5',
      300: '#d5d7da',
      400: '#a1a5ab',
      500: '#717680',
      700: '#414651'
    }
  },
  typography: {
    fontFamily: "'Satoshi', Arial, Helvetica, sans-serif",
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 700 }
  },
  shape: {
    borderRadius: 16
  },
  shadows: [
    'none',
    '0px 0px 30px rgba(0, 0, 0, 0.25)', // shadow-drop
    '0px 2px 4px rgba(0, 0, 0, 0.1)', // shadow-header
    ...Array(22).fill('none')
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 700,
          fontFamily: "'Satoshi', Arial, Helvetica, sans-serif",
          background: 'linear-gradient(225deg, #00d9ff, #01c0fa)',
          boxShadow: '0 4px 14px rgba(0, 217, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(225deg, #00d1e0, #00a7d1)',
            boxShadow: '0 6px 20px rgba(0, 217, 255, 0.5)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24
        }
      }
    }
  }
})

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
