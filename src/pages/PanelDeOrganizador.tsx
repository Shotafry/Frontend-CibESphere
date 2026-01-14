// src/pages/PanelDeOrganizador.tsx
import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect
} from 'react'
import {
  Box,
  Typography,
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
import { DashboardStats, Event, OrganizationResponse } from '../types'
import * as apiService from '../services/apiService'
import EventIcon from '@mui/icons-material/Event'
import { Button } from '../components/Button'
import GroupIcon from '@mui/icons-material/Group'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LanguageIcon from '@mui/icons-material/Language'
import XIcon from '@mui/icons-material/X'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import ImageIcon from '@mui/icons-material/Image'
import BusinessIcon from '@mui/icons-material/Business'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import PaletteIcon from '@mui/icons-material/Palette'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import MapIcon from '@mui/icons-material/Map'
import { ImageUpload } from '../components/ImageUpload'
import { useForm, Controller, useWatch } from 'react-hook-form'

interface LoaderData {
  stats: DashboardStats
  events: Event[]
  organization: OrganizationResponse | null
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
            height: { xs: 160, sm: 180, md: 200 },
            width: '100%',
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70%',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
              pointerEvents: 'none'
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
            p: { xs: 2, sm: 2.5, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            gap: { xs: 1.5, sm: 2, md: 3 },
            zIndex: 2
          }}
        >
          <Avatar
            src={logoUrl}
            sx={{
              width: { xs: 70, sm: 85, md: 100 },
              height: { xs: 70, sm: 85, md: 100 },
              border: '3px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          />
          <Box
            sx={{
              color: 'white',
              pb: { xs: 0, sm: 0.5 },
              textAlign: { xs: 'center', sm: 'left' },
              textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)'
            }}
          >
            <Typography
              variant='h4'
              fontWeight='900'
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                lineHeight: 1.2
              }}
            >
              {watchedName || 'Tu Organización'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 1,
                mt: 0.5
              }}
            >
              <LocationCityIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              <Typography
                variant='body1'
                fontWeight='500'
                sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
              >
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
                name='slug'
                control={control}
                rules={{
                  required: 'El slug es obligatorio',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Solo letras minúsculas, números y guiones'
                  },
                  validate: async (value) => {
                    if (!value || value === user?.organization?.slug)
                      return true
                    try {
                      const available = await apiService.checkSlugAvailability(
                        value
                      )
                      return available || 'Este URL ya está en uso'
                    } catch (e) {
                      console.error(e)
                      return 'Error al validar disponibilidad'
                    }
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='URL Personalizada (Slug)'
                    fullWidth
                    variant='outlined'
                    error={!!errors.slug}
                    helperText={
                      errors.slug?.message ||
                      `cibesphere.com/organizacion/${field.value}`
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LinkIcon color='action' />
                        </InputAdornment>
                      )
                    }}
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

              {/* Contact Info Fields */}
              <Divider sx={{ my: 4 }} />

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <PhoneIcon sx={{ color: 'var(--color-cadetblue)' }} />
                <Typography variant='h6' fontWeight='bold'>
                  Información de Contacto
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Email Público'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Teléfono'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <PhoneIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='address'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label='Dirección'
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <MapIcon color='action' />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='postal_code'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label='Código Postal' fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label='País' fullWidth />
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
                    <ImageUpload
                      currentUrl={field.value}
                      onUpload={field.onChange}
                      label='Logo'
                      altText='Organization Logo'
                      isBanner={false}
                    />
                  )}
                />
                <Controller
                  name='banner_url'
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      currentUrl={field.value}
                      onUpload={field.onChange}
                      label='Banner'
                      altText='Organization Banner'
                      isBanner={true}
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
                  name='social_media.twitter'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='X (Twitter)'
                      fullWidth
                      size='small'
                      placeholder='https://x.com/...'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <XIcon fontSize='small' sx={{ color: '#000' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='social_media.linkedin'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='LinkedIn'
                      fullWidth
                      size='small'
                      placeholder='https://linkedin.com/...'
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
                  name='social_media.github'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='GitHub'
                      fullWidth
                      size='small'
                      placeholder='https://github.com/...'
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
                <Controller
                  name='social_media.facebook'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Facebook'
                      fullWidth
                      size='small'
                      placeholder='https://facebook.com/...'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <FacebookIcon
                              fontSize='small'
                              sx={{ color: '#1877F2' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='social_media.instagram'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Instagram'
                      fullWidth
                      size='small'
                      placeholder='https://instagram.com/...'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <InstagramIcon
                              fontSize='small'
                              sx={{ color: '#C13584' }}
                            />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                <Controller
                  name='social_media.youtube'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='YouTube'
                      fullWidth
                      size='small'
                      placeholder='https://youtube.com/...'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <YouTubeIcon
                              fontSize='small'
                              sx={{ color: '#FF0000' }}
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
              variant='primary'
              fullWidth
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <SaveIcon />
                )
              }
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
  const { stats, events, organization } = useLoaderData() as LoaderData
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
    reset,
    formState: { errors }
  } = useForm<OrganizationResponse>({
    defaultValues: organization || user?.organization || {}
  })

  useEffect(() => {
    if (organization) {
      reset(organization)
    }
  }, [organization, reset])

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

  const onSaveProfile = async (data: OrganizationResponse) => {
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
      reset(updatedOrg)
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
            {tabValue === 0 && (
              <Button
                variant='secondary'
                startIcon={<AddCircleOutlineIcon />}
                onClick={onCrearEventoClick}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Crear Evento
              </Button>
            )}
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
                              variant='primary'
                              startIcon={<EditIcon />}
                              onClick={() => onEditarEventoClick(event.slug)}
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
                    <Button variant='secondary' onClick={onCrearEventoClick}>
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
