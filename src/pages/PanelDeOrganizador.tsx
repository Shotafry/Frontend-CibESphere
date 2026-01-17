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
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DashboardStats, Event, OrganizationResponse } from '../types'
import * as apiService from '../services/apiService'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Button } from '../components/Button'

// Import new modular components
import { DashboardTab, EventsListTab, ProfileTab } from './panel-organizador'

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
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const onCrearEventoClick = useCallback(() => {
    navigate('/crear-evento')
  }, [navigate])

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
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
        <Container maxWidth='xl'>
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
            {tabValue !== 2 && ( // Show 'Crear Evento' on Dashboard (0) and Events (1) tabs? Or just Dashboard?
              // Original code showed on tabValue === 0.
              // Let's decide: Dashboard is stats. Events List is now tab X.
              // Let's split tabs: 0=Dashboard, 1=Events, 2=Profile.
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <Button
                  variant='secondary'
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={onCrearEventoClick}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Crear Evento
                </Button>
                {user?.organization?.slug && (
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
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='xl' sx={{ mt: 5 }}>
        {/* TAB DASHBOARD */}
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              <DashboardTab stats={stats} events={events} />
              {/* Also show recent events summary or link to events tab? */}
              {/* Original showed stats AND events list in same tab. 
                    The plan said: DashboardTab (Stats + KPIs + Gráficos) and EventsListTab (CRUD).
                    However, often dashboards show "Recent Events".
                    Let's replicate original behavior for now by including EventsListTab here OR 
                    just stick to the plan of separating them. 
                    The plan said "Extract EventsListTab".
                    Let's KEEP them separate for cleanliness, but maybe show a "Recent Events" snippet?
                    Actually, let's just show EventsListTab in tab 1.
                */}
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
      </Container>
    </Box>
  )
}

export default PanelDeOrganizador
