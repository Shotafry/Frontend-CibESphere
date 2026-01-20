// src/pages/PanelDeOrganizador.tsx
import React, { FunctionComponent, useCallback, useState } from 'react'
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Tabs,
  Tab,
  Fade
} from '@mui/material'
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams
} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DashboardStats, Event, OrganizationResponse } from '../types'
import * as apiService from '../services/apiService'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { Button } from '../components/Button'

// Import new modular components
import {
  DashboardTab,
  EventsListTab,
  ProfileTab,
  PaymentsTab,
  NotificationsTab
} from './panel-organizador'
import { QRScannerModal } from './panel-organizador/components/QRScannerModal'

interface LoaderData {
  stats: DashboardStats
  events: Event[]
  organization: OrganizationResponse | null
}

const PanelDeOrganizador: FunctionComponent = () => {
  const { stats, events, organization } = useLoaderData() as LoaderData
  const navigation = useNavigation()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Tab State Management via URL
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'

  const tabMap: { [key: string]: number } = {
    dashboard: 0,
    events: 1,
    profile: 2,
    payments: 3,
    notifications: 4
  }
  const indexToTab: { [key: number]: string } = {
    0: 'dashboard',
    1: 'events',
    2: 'profile',
    3: 'payments',
    4: 'notifications'
  }

  const tabValue = tabMap[currentTab] ?? 0

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchParams({ tab: indexToTab[newValue] })
  }

  const onCrearEventoClick = useCallback(() => {
    navigate('/crear-evento')
  }, [navigate])

  // QR Scanner state
  const [scannerOpen, setScannerOpen] = useState(false)

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este evento?')) {
      try {
        await apiService.deleteEvent(eventId)
        navigate('.', { replace: true })
      } catch (error) {
        console.error('Error al borrar el evento:', error)
      }
    }
  }

  if (navigation.state === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
        pb: 8,
        overflow: 'hidden',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}
    >
      {/* HEADER DEL PANEL */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          pt: 4,
          pb: 0,
          px: { xs: 2, md: 8 }
        }}
      >
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 2, sm: 0 },
              mb: 4
            }}
          >
            <Box>
              <Typography
                variant='h4'
                fontWeight='900'
                sx={{
                  color: 'var(--Gray-900)',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                }}
              >
                Panel de Control
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'var(--Gray-500)',
                  mt: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Gestiona tus eventos y tu perfil de organización
              </Typography>
            </Box>
            {tabValue !== 2 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', md: 'row' },
                  flexWrap: 'wrap',
                  width: { xs: '100%', md: 'auto' },
                  mt: { xs: 2, md: 0 }
                }}
              >
                <Button
                  variant='secondary'
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={onCrearEventoClick}
                  sx={{
                    width: { xs: '100%', md: 'auto' },
                    flex: { xs: 1, md: 'none' }
                  }}
                >
                  Crear Evento
                </Button>
                <Button
                  variant='secondary'
                  startIcon={<QrCodeScannerIcon />}
                  onClick={() => setScannerOpen(true)}
                  sx={{
                    width: { xs: '100%', md: 'auto' },
                    flex: { xs: 1, md: 'none' }
                  }}
                >
                  Escanear Entrada
                </Button>
                {user?.organization?.slug && (
                  <Button
                    variant='secondary'
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      navigate(`/organizacion/${user.organization?.slug}`)
                    }
                    sx={{
                      width: { xs: '100%', md: 'auto' },
                      flex: { xs: 1, md: 'none' }
                    }}
                  >
                    Ver Perfil Público
                  </Button>
                )}
              </Box>
            )}
            {tabValue === 2 && user?.organization?.slug && (
              <Button
                variant='secondary'
                startIcon={<VisibilityIcon />}
                onClick={() =>
                  navigate(`/organizacion/${user.organization?.slug}`)
                }
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Ver Perfil Público
              </Button>
            )}
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: 48, sm: 60 },
                minWidth: { xs: 'auto', sm: 120 },
                color: 'var(--Gray-500)',
                '&.Mui-selected': { color: 'var(--color-cadetblue)' }
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'var(--color-cadetblue)',
                height: 3
              }
            }}
          >
            <Tab label='Dashboard' />
            <Tab label='Mis Eventos' />
            <Tab label='Perfil de Organización' />
            <Tab label='Pagos e Ingresos' />
            <Tab label='Notificaciones' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ mt: 5 }}>
        {/* TAB DASHBOARD */}
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              <DashboardTab stats={stats} events={events} />
            </Box>
          </Fade>
        )}

        {/* TAB EVENTOS */}
        {tabValue === 1 && (
          <Fade in={tabValue === 1} timeout={500}>
            <Box>
              <EventsListTab
                events={events}
                onDeleteEvent={handleDeleteEvent}
                onCreateEvent={onCrearEventoClick}
              />
            </Box>
          </Fade>
        )}

        {/* TAB PERFIL */}
        {tabValue === 2 && (
          <Fade in={tabValue === 2} timeout={500}>
            <Box>
              <ProfileTab organization={organization} />
            </Box>
          </Fade>
        )}

        {/* TAB PAGOS */}
        {tabValue === 3 && (
          <Fade in={tabValue === 3} timeout={500}>
            <Box>
              <PaymentsTab />
            </Box>
          </Fade>
        )}

        {/* TAB NOTIFICACIONES */}
        {tabValue === 4 && (
          <Fade in={tabValue === 4} timeout={500}>
            <Box>
              <NotificationsTab organizationId={organization?.id} />
            </Box>
          </Fade>
        )}
      </Container>

      {/* QR Scanner Modal */}
      <QRScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </Box>
  )
}

export default PanelDeOrganizador
