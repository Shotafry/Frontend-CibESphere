// src/pages/PanelDeOrganizador.tsx
import React, { FunctionComponent, useCallback, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
  Tabs,
  Tab,
  TextField,
  Alert,
  Stack
} from '@mui/material'
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DashboardStats, Event, OrganizationSummary } from '../types'
import * as apiService from '../services/apiService'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useForm, Controller } from 'react-hook-form'

interface LoaderData {
  stats: DashboardStats
  events: Event[]
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
  const { user, refreshUserData } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<OrganizationSummary>({
    defaultValues: user?.organization || {}
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setSaveMessage(null)
  }

  const onCrearEventoClick = useCallback(() => {
    navigate('/crear-evento')
  }, [navigate])

  const onEditarEventoClick = useCallback(
    (slug: string) => {
      navigate(`/eventos/${slug}/editar`)
    },
    [navigate]
  )

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

  const onSaveProfile = async (data: OrganizationSummary) => {
    if (!user?.organization?.id) return
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const updatedOrg = await apiService.updateOrganization(
        user.organization.id,
        data
      )
      // Actualizar el usuario en el contexto
      if (user) {
        refreshUserData({ ...user, organization: updatedOrg })
      }
      setSaveMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente.'
      })
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        text: error.message || 'Error al actualizar el perfil.'
      })
    } finally {
      setIsSaving(false)
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
        {tabValue === 0 && (
          <Button
            variant='contained'
            startIcon={<AddCircleOutlineIcon />}
            onClick={onCrearEventoClick}
            sx={{
              borderRadius: '25px',
              background: 'var(--gradient-button-primary)',
              '&:hover': {
                background: 'var(--gradient-button-primary-hover)'
              }
            }}
          >
            Crear Nuevo Evento
          </Button>
        )}
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label='Dashboard' />
        <Tab label='Perfil de Organización' />
      </Tabs>

      {/* TAB DASHBOARD */}
      {tabValue === 0 && (
        <>
          {/* Estadísticas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Eventos Totales'
                value={stats.total_events}
                icon={<EventIcon fontSize='large' color='primary' />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Asistentes Totales'
                value={stats.total_attendees}
                icon={<GroupIcon fontSize='large' color='secondary' />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title='Ciudades Cubiertas'
                value={stats.total_cities}
                icon={<LocationCityIcon fontSize='large' color='success' />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                  <React.Fragment key={event.id}>
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
                          {new Date(event.start_date).toLocaleDateString(
                            'es-ES',
                            {
                              dateStyle: 'long'
                            }
                          )}{' '}
                          - {event.status}
                        </Typography>
                      </Box>
                      <Box>
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
                  </React.Fragment>
                ))
              ) : (
                <Typography sx={{ p: 2 }}>
                  No has creado ningún evento todavía.
                </Typography>
              )}
            </Box>
          </Paper>
        </>
      )}

      {/* TAB PERFIL */}
      {tabValue === 1 && (
        <Paper sx={{ p: 4, borderRadius: '16px' }}>
          <Typography variant='h6' gutterBottom>
            Editar Perfil Público
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Esta información será visible en tu página pública de organización.
          </Typography>

          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
              {saveMessage.text}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: 'El nombre es obligatorio' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Nombre de la Organización'
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Descripción'
                      fullWidth
                      multiline
                      rows={4}
                      placeholder='Cuéntanos sobre tu organización...'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Ciudad Principal' fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='website'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Sitio Web'
                      fullWidth
                      placeholder='https://...'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='banner_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='URL del Banner (Imagen de portada)'
                      fullWidth
                      placeholder='https://...'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='logo_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='URL del Logo'
                      fullWidth
                      placeholder='https://...'
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant='subtitle1' sx={{ mt: 2, mb: 1 }}>
                  Redes Sociales
                </Typography>
                <Stack spacing={2}>
                  <Controller
                    name='social_links.twitter'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Twitter URL'
                        fullWidth
                        size='small'
                      />
                    )}
                  />
                  <Controller
                    name='social_links.linkedin'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='LinkedIn URL'
                        fullWidth
                        size='small'
                      />
                    )}
                  />
                  <Controller
                    name='social_links.github'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='GitHub URL'
                        fullWidth
                        size='small'
                      />
                    )}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isSaving}
                  startIcon={
                    isSaving ? <CircularProgress size={20} /> : <SaveIcon />
                  }
                  sx={{
                    mt: 2,
                    borderRadius: '25px',
                    background: 'var(--gradient-button-primary)',
                    '&:hover': {
                      background: 'var(--gradient-button-primary-hover)'
                    }
                  }}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default PanelDeOrganizador
