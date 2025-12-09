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
  Stack,
  Chip,
  LinearProgress,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Fade
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LanguageIcon from '@mui/icons-material/Language'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import ImageIcon from '@mui/icons-material/Image'
import BusinessIcon from '@mui/icons-material/Business'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import { useForm, Controller, useWatch } from 'react-hook-form'

interface LoaderData {
  stats: DashboardStats
  events: Event[]
}

// --- COMPONENTE STAT CARD PREMIUM ---
// --- COMPONENTE STAT CARD PREMIUM ---
const StatCard: React.FC<{
  title: string
  value: number | string
  icon: React.ReactElement<any>
  color: string
  trend?: string
}> = ({ title, value, icon, color, trend }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '20px',
      background: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 30px -10px ${color}40`,
        borderColor: color
      },
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant='h4' fontWeight='bold' sx={{ color: '#1e293b' }}>
        {value}
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}
      >
        {title}
      </Typography>
      {trend && (
        <Chip
          label={trend}
          size='small'
          icon={<TrendingUpIcon style={{ fontSize: 14 }} />}
          sx={{
            mt: 1.5,
            bgcolor: `${color}15`,
            color: color,
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}
        />
      )}
    </Box>
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${color}15`,
        color: color
      }}
    >
      {React.cloneElement(icon, { fontSize: 'large' })}
    </Box>
  </Paper>
)

// --- COMPONENTE CONTENIDO TAB PERFIL (Diseño "Immersive Header") ---
const ProfileTabContent: React.FC<{
  user: any
  control: any
  errors: any
  isSaving: boolean
  handleSubmit: any
  onSaveProfile: any
  saveMessage: any
}> = ({
  user,
  control,
  errors,
  isSaving,
  handleSubmit,
  onSaveProfile,
  saveMessage
}) => {
  const watchedBanner = useWatch({ control, name: 'banner_url' })
  const watchedLogo = useWatch({ control, name: 'logo_url' })
  const watchedName = useWatch({ control, name: 'name' })
  const watchedCity = useWatch({ control, name: 'city' })

  const bannerUrl =
    watchedBanner ||
    user?.organization?.banner_url ||
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
  const logoUrl =
    watchedLogo || user?.organization?.logo_url || '/default-logo.png'

  return (
    <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
      {/* 1. HEADER PREVIEW (Immersive) */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 4,
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
      >
        {/* Banner Background */}
        <Box
          sx={{
            height: 200,
            width: '100%',
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))'
            }
          }}
        />

        {/* Glassmorphism Info Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            zIndex: 2
          }}
        >
          <Avatar
            src={logoUrl}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          />
          <Box sx={{ color: 'white', pb: 1 }}>
            <Typography
              variant='h4'
              fontWeight='900'
              sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {watchedName || 'Tu Organización'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                opacity: 0.9
              }}
            >
              <LocationCityIcon fontSize='small' />
              <Typography variant='body1' fontWeight='500'>
                {watchedCity || 'Ciudad'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 4, borderRadius: '12px' }}>
          {saveMessage.text}
        </Alert>
      )}

      {/* 2. FORM GRID */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN: MAIN INFO */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <BusinessIcon sx={{ color: 'var(--color-cadetblue)' }} />
              <Typography variant='h6' fontWeight='bold'>
                Información General
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Nombre de la Organización'
                    fullWidth
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Sobre nosotros'
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder='Describe tu misión, visión y los eventos que organizas...'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position='start'
                          sx={{ alignSelf: 'flex-start', mt: 1.5 }}
                        >
                          <DescriptionIcon color='action' />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='city'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Ciudad'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LocationCityIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='website'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Sitio Web'
                        fullWidth
                        placeholder='https://...'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LanguageIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: ASSETS & SOCIAL */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            {/* Visual Assets Card */}
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <ImageIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='h6' fontWeight='bold'>
                  Recursos Visuales
                </Typography>
              </Box>
              <Stack spacing={3}>
                <Controller
                  name='logo_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='URL del Logo'
                      fullWidth
                      size='small'
                      helperText='Recomendado: 400x400px'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LinkIcon fontSize='small' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='banner_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='URL del Banner'
                      fullWidth
                      size='small'
                      helperText='Recomendado: 1200x400px'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LinkIcon fontSize='small' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Paper>

            {/* Social Media Card */}
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <GroupIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='h6' fontWeight='bold'>
                  Redes Sociales
                </Typography>
              </Box>
              <Stack spacing={2}>
                <Controller
                  name='social_links.twitter'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Twitter'
                      fullWidth
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <TwitterIcon
                              fontSize='small'
                              sx={{ color: '#1DA1F2' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='social_links.linkedin'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='LinkedIn'
                      fullWidth
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LinkedInIcon
                              fontSize='small'
                              sx={{ color: '#0A66C2' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='social_links.github'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='GitHub'
                      fullWidth
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <GitHubIcon
                              fontSize='small'
                              sx={{ color: '#333' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Paper>

            {/* Save Button */}
            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{
                py: 2,
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'var(--gradient-button-primary)',
                boxShadow: '0 8px 20px rgba(0, 217, 255, 0.25)',
                '&:hover': {
                  background: 'var(--gradient-button-primary-hover)',
                  boxShadow: '0 10px 25px rgba(0, 217, 255, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

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

  // Cálculos de estadísticas extra
  const upcomingEventsCount = events.filter(
    (e) => new Date(e.start_date) >= new Date()
  ).length
  const pastEventsCount = events.length - upcomingEventsCount
  const avgAttendees =
    events.length > 0 ? Math.round(stats.total_attendees / events.length) : 0

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
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Box>
              <Typography
                variant='h4'
                fontWeight='900'
                sx={{ color: 'var(--Gray-900)' }}
              >
                Panel de Control
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: 'var(--Gray-500)', mt: 1 }}
              >
                Gestiona tus eventos y tu perfil de organización
              </Typography>
            </Box>
            {tabValue === 0 && (
              <Button
                variant='contained'
                startIcon={<AddCircleOutlineIcon />}
                onClick={onCrearEventoClick}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  background: 'var(--gradient-button-primary)',
                  boxShadow: '0 4px 14px rgba(0, 217, 255, 0.3)',
                  '&:hover': {
                    background: 'var(--gradient-button-primary-hover)',
                    boxShadow: '0 6px 20px rgba(0, 217, 255, 0.5)'
                  }
                }}
              >
                Crear Evento
              </Button>
            )}
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 60,
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
            <Tab label='Perfil de Organización' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='xl' sx={{ mt: 5 }}>
        {/* TAB DASHBOARD */}
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              {/* Estadísticas */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard
                    title='Eventos Totales'
                    value={stats.total_events}
                    icon={<EventIcon />}
                    color='#3B82F6'
                    trend={`${upcomingEventsCount} Próximos`}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard
                    title='Asistentes Totales'
                    value={stats.total_attendees}
                    icon={<GroupIcon />}
                    color='#10B981'
                    trend={`~${avgAttendees} por evento`}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard
                    title='Ciudades'
                    value={stats.total_cities}
                    icon={<LocationCityIcon />}
                    color='#8B5CF6'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <StatCard
                    title='Publicados'
                    value={stats.published_events}
                    icon={<CheckCircleIcon />}
                    color='#F59E0B'
                  />
                </Grid>
              </Grid>

              {/* Gestión de Eventos */}
              <Typography
                variant='h5'
                fontWeight='bold'
                sx={{ mb: 3, color: 'var(--Gray-800)' }}
              >
                Mis Eventos Recientes
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0'
                }}
              >
                {events.length > 0 ? (
                  events.map((event, index) => {
                    const isLast = index === events.length - 1
                    const occupancy =
                      event.max_attendees && event.max_attendees > 0
                        ? Math.round(
                            (event.current_attendees / event.max_attendees) *
                              100
                          )
                        : 0

                    return (
                      <React.Fragment key={event.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            p: 3,
                            gap: 2,
                            transition: 'background 0.2s',
                            '&:hover': { bgcolor: '#F8FAFC' }
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant='h6'
                              fontWeight='bold'
                              onClick={() => navigate(`/eventos/${event.slug}`)}
                              sx={{
                                cursor: 'pointer',
                                color: 'var(--Gray-800)',
                                '&:hover': { color: 'var(--color-cadetblue)' }
                              }}
                            >
                              {event.title}
                            </Typography>
                            <Stack
                              direction='row'
                              spacing={2}
                              sx={{ mt: 1 }}
                              alignItems='center'
                            >
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                📅{' '}
                                {new Date(event.start_date).toLocaleDateString(
                                  'es-ES',
                                  { dateStyle: 'long' }
                                )}
                              </Typography>
                              <Chip
                                label={
                                  event.status === 'published'
                                    ? 'Publicado'
                                    : 'Borrador'
                                }
                                size='small'
                                sx={{
                                  bgcolor:
                                    event.status === 'published'
                                      ? '#DCFCE7'
                                      : '#F3F4F6',
                                  color:
                                    event.status === 'published'
                                      ? '#166534'
                                      : '#4B5563',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Stack>
                          </Box>

                          {/* Barra de Aforo */}
                          {event.max_attendees && event.max_attendees > 0 && (
                            <Box sx={{ width: { xs: '100%', md: 200 } }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mb: 0.5
                                }}
                              >
                                <Typography
                                  variant='caption'
                                  fontWeight='bold'
                                  color='text.secondary'
                                >
                                  Aforo
                                </Typography>
                                <Typography
                                  variant='caption'
                                  fontWeight='bold'
                                  color={
                                    occupancy >= 100
                                      ? 'error.main'
                                      : 'primary.main'
                                  }
                                >
                                  {occupancy}% ({event.current_attendees}/
                                  {event.max_attendees})
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant='determinate'
                                value={occupancy > 100 ? 100 : occupancy}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#E2E8F0',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor:
                                      occupancy >= 100 ? '#EF4444' : '#3B82F6'
                                  }
                                }}
                              />
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant='outlined'
                              startIcon={<EditIcon />}
                              onClick={() => onEditarEventoClick(event.slug)}
                              sx={{
                                borderRadius: '10px',
                                textTransform: 'none'
                              }}
                            >
                              Editar
                            </Button>
                            <IconButton
                              color='error'
                              onClick={() => handleDeleteEvent(event.id)}
                              sx={{
                                bgcolor: '#FEF2F2',
                                '&:hover': { bgcolor: '#FEE2E2' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        {!isLast && <Divider />}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <Box sx={{ p: 8, textAlign: 'center' }}>
                    <EventIcon
                      sx={{ fontSize: 60, color: 'var(--Gray-300)', mb: 2 }}
                    />
                    <Typography variant='h6' color='text.secondary'>
                      No has creado ningún evento todavía.
                    </Typography>
                    <Button
                      variant='contained'
                      sx={{ mt: 2, borderRadius: '20px' }}
                      onClick={onCrearEventoClick}
                    >
                      Crear mi primer evento
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          </Fade>
        )}

        {/* TAB PERFIL */}
        {tabValue === 1 && (
          <Fade in={tabValue === 1} timeout={500}>
            <Box>
              <ProfileTabContent
                user={user}
                control={control}
                errors={errors}
                isSaving={isSaving}
                handleSubmit={handleSubmit}
                onSaveProfile={onSaveProfile}
                saveMessage={saveMessage}
              />
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  )
}

export default PanelDeOrganizador
