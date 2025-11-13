// src/pages/PanelDeOrganizador.tsx
import React, { FunctionComponent, useCallback } from 'react' // Importar React
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material'
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DashboardStats, Event } from '../types'
import * as apiService from '../services/apiService'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface LoaderData {
  stats: DashboardStats
  events: Event[] // <-- CORREGIDO: De Event a Event[]
}

const StatCard: React.FC<{
  title: string
  value: number | string
  icon: React.ReactElement
}> = ({ title, value, icon }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderRadius: '16px'
    }}
  >
    {icon}
    <Box>
      <Typography variant='h6'>{value}</Typography>
      <Typography color='text.secondary'>{title}</Typography>
    </Box>
  </Paper>
)

const PanelDeOrganizador: FunctionComponent = () => {
  const { stats, events } = useLoaderData() as LoaderData
  const navigation = useNavigation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const onCrearEventoClick = useCallback(() => {
    navigate('/crear-evento')
  }, [navigate])

  // --- NUEVA FUNCIÓN ---
  const onEditarEventoClick = useCallback(
    (slug: string) => {
      navigate(`/eventos/${slug}/editar`)
    },
    [navigate]
  )
  // --- FIN NUEVA FUNCIÓN ---

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este evento?')) {
      try {
        await apiService.deleteEvent(eventId) // No es necesario pasar orgId a la API simulada
        // Idealmente, aquí se debería recargar la data o invalidar el loader
        navigate('.', { replace: true }) // Recarga la página actual
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
    <Container maxWidth='lg' sx={{ my: 5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography variant='h4' component='h1' fontWeight='bold'>
          Panel de Organizador
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddCircleOutlineIcon />}
          onClick={onCrearEventoClick}
          sx={{
            borderRadius: '25px',
            background: 'var(--gradient-button-primary)', // <-- ESTILO UNIFICADO
            '&:hover': {
              background: 'var(--gradient-button-primary-hover)' // <-- ESTILO UNIFICADO
            }
          }}
        >
          Crear Nuevo Evento
        </Button>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          {' '}
          {/* 'item' añadido */}
          <StatCard
            title='Eventos Totales'
            value={stats.total_events}
            icon={<EventIcon fontSize='large' color='primary' />}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Asistentes Totales'
            value={stats.total_attendees}
            icon={<GroupIcon fontSize='large' color='secondary' />}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Ciudades Cubiertas'
            value={stats.total_cities}
            icon={<LocationCityIcon fontSize='large' color='success' />}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Eventos Publicados'
            value={stats.published_events}
            icon={<CheckCircleIcon fontSize='large' color='warning' />}
          />
        </Grid>
      </Grid>

      {/* Gestión de Eventos */}
      <Typography variant='h5' component='h2' gutterBottom>
        Mis Eventos
      </Typography>
      <Paper sx={{ p: 2, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {events.length > 0 ? (
            events.map((event) => (
              // --- CORREGIDO: Añadido React.Fragment ---
              <React.Fragment key={event.id}>
                // --- FIN CORREGIDO ---
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1
                  }}
                >
                  <Box>
                    <Typography
                      variant='h6'
                      onClick={() => navigate(`/eventos/${event.slug}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {event.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {new Date(event.start_date).toLocaleDateString('es-ES', {
                        dateStyle: 'long'
                      })}{' '}
                      - {event.status}
                    </Typography>
                  </Box>
                  <Box>
                    {/* --- BOTÓN EDITAR MODIFICADO --- */}
                    <IconButton
                      color='primary'
                      onClick={() => onEditarEventoClick(event.slug)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color='error'
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Divider />
              </React.Fragment> // --- CIERRE DEL FRAGMENT ---
            ))
          ) : (
            <Typography sx={{ p: 2 }}>
              No has creado ningún evento todavía.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default PanelDeOrganizador
