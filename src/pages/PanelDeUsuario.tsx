import React, { FunctionComponent, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Paper,
  Button,
  Divider,
  Tabs,
  Tab,
  Stack,
  Avatar,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material'
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Event, User } from '../types'
import * as apiService from '../services/apiService'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import SaveIcon from '@mui/icons-material/Save'
import ImageIcon from '@mui/icons-material/Image'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { EventCard } from '../components/EventCard'

const PanelDeUsuario: FunctionComponent = () => {
  const { user, refreshUserData } = useAuth()
  const initialEvents = useLoaderData() as Event[]
  const navigation = useNavigation()
  const [subscribedEvents, setSubscribedEvents] = useState(initialEvents)
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
  } = useForm<User>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      city: user?.city || '',
      bio: user?.bio || '',
      avatar_url: user?.avatar_url || '',
      banner_url: user?.banner_url || '',
      company: user?.company || '',
      position: user?.position || '',
      social_links: {
        twitter: user?.social_links?.twitter || '',
        linkedin: user?.social_links?.linkedin || '',
        github: user?.social_links?.github || '',
        website: user?.social_links?.website || ''
      }
    }
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCancelSubscription = async (eventId: string) => {
    if (!user) return
    try {
      await apiService.unsubscribeFromEvent(user.id, eventId)
      const newSubscribedEvents = subscribedEvents.filter(
        (e) => e.id !== eventId
      )
      setSubscribedEvents(newSubscribedEvents)
      const updatedUser = { ...user, FavoriteEvents: newSubscribedEvents }
      refreshUserData(updatedUser)
    } catch (error) {
      console.error('Error al cancelar la inscripción:', error)
    }
  }

  const onSaveProfile = async (data: User) => {
    if (!user) return
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const updatedUser = await apiService.updateUser(user.id, data)
      refreshUserData(updatedUser)
      setSaveMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveMessage({ type: 'error', text: 'Error al actualizar el perfil' })
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

  // Filtrar eventos
  const upcomingEvents = subscribedEvents.filter(
    (e) => new Date(e.start_date) > new Date()
  )
  const pastEvents = subscribedEvents.filter(
    (e) => new Date(e.start_date) <= new Date()
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* HEADER */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          pt: 4,
          pb: 0
        }}
      >
        <Container maxWidth='xl'>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={user?.avatar_url}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  bgcolor: 'var(--color-cadetblue)'
                }}
              >
                {user?.first_name[0]}
              </Avatar>
              <Box>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  sx={{ color: 'var(--Gray-900)' }}
                >
                  Hola, {user?.first_name}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Gestiona tus eventos y tu perfil público
                </Typography>
              </Box>
            </Box>
            <Button
              variant='outlined'
              href={`/usuario/${user?.id}`}
              target='_blank'
              startIcon={<PersonIcon />}
              sx={{ borderRadius: '12px', textTransform: 'none' }}
            >
              Ver mi Perfil Público
            </Button>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mr: 4
              }
            }}
          >
            <Tab label='Mis Eventos' />
            <Tab label='Editar Perfil' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='xl' sx={{ mt: 6 }}>
        {/* TAB 0: EVENTOS */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3 }}
              >
                Próximos Eventos ({upcomingEvents.length})
              </Typography>
              <Stack spacing={3}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Box key={event.id} sx={{ position: 'relative' }}>
                      <EventCard event={event} />
                      <Button
                        variant='contained'
                        color='error'
                        size='small'
                        onClick={() => handleCancelSubscription(event.id)}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          borderRadius: '8px',
                          zIndex: 10
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: '16px',
                      bgcolor: 'white'
                    }}
                  >
                    <Typography color='text.secondary'>
                      No tienes eventos próximos.
                    </Typography>
                    <Button
                      variant='contained'
                      href='/'
                      sx={{ mt: 2, borderRadius: '8px' }}
                    >
                      Explorar Eventos
                    </Button>
                  </Paper>
                )}
              </Stack>

              {pastEvents.length > 0 && (
                <Box sx={{ mt: 6 }}>
                  <Typography
                    variant='h6'
                    fontWeight='bold'
                    gutterBottom
                    sx={{ mb: 3, opacity: 0.7 }}
                  >
                    Historial de Eventos ({pastEvents.length})
                  </Typography>
                  <Stack spacing={3} sx={{ opacity: 0.8 }}>
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  bgcolor: 'white',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Resumen
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px'
                    }}
                  >
                    <Typography color='text.secondary'>
                      Eventos Asistidos
                    </Typography>
                    <Typography fontWeight='bold'>
                      {pastEvents.length}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: '12px'
                    }}
                  >
                    <Typography color='text.secondary'>Próximos</Typography>
                    <Typography fontWeight='bold' color='primary'>
                      {upcomingEvents.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: EDITAR PERFIL */}
        {tabValue === 1 && (
          <EditProfileForm
            user={user}
            control={control}
            handleSubmit={handleSubmit}
            onSaveProfile={onSaveProfile}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />
        )}
      </Container>
    </Box>
  )
}

// Subcomponente para el formulario con vista previa
const EditProfileForm: React.FC<{
  user: any
  control: any
  handleSubmit: any
  onSaveProfile: any
  isSaving: boolean
  saveMessage: any
}> = ({
  user,
  control,
  handleSubmit,
  onSaveProfile,
  isSaving,
  saveMessage
}) => {
  const watchedBanner = useWatch({ control, name: 'banner_url' })
  const watchedAvatar = useWatch({ control, name: 'avatar_url' })
  const watchedFirstName = useWatch({ control, name: 'first_name' })
  const watchedLastName = useWatch({ control, name: 'last_name' })
  const watchedCity = useWatch({ control, name: 'city' })
  const watchedCompany = useWatch({ control, name: 'company' })
  const watchedPosition = useWatch({ control, name: 'position' })

  const bannerUrl =
    watchedBanner ||
    user?.banner_url ||
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
  const avatarUrl = watchedAvatar || user?.avatar_url
  const fullName = `${watchedFirstName || user?.first_name || ''} ${
    watchedLastName || user?.last_name || ''
  }`

  return (
    <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
      {/* PREVIEW SECTION */}
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
            src={avatarUrl}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              bgcolor: 'var(--color-cadetblue)',
              fontSize: '2.5rem'
            }}
          >
            {watchedFirstName?.[0]}
          </Avatar>
          <Box sx={{ color: 'white', pb: 1 }}>
            <Typography
              variant='h4'
              fontWeight='900'
              sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {fullName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                opacity: 0.9
              }}
            >
              {watchedCity && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon fontSize='small' />
                  <Typography variant='body1' fontWeight='500'>
                    {watchedCity}
                  </Typography>
                </Box>
              )}
              {watchedCompany && (
                <Typography variant='body1' fontWeight='500'>
                  | {watchedPosition ? `${watchedPosition} at ` : ''}
                  {watchedCompany}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 4, borderRadius: '12px' }}>
          {saveMessage.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* LEFT: PERSONAL INFO */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
          >
            <Typography
              variant='h6'
              fontWeight='bold'
              gutterBottom
              sx={{ mb: 3 }}
            >
              Información Personal
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='first_name'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Nombre' fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='last_name'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Apellidos' fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='bio'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Bio / Sobre mí'
                      fullWidth
                      multiline
                      rows={4}
                      placeholder='Cuéntanos un poco sobre ti...'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                            <LocationOnIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='company'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Empresa' fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name='position'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label='Cargo' fullWidth />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT: ASSETS & SOCIAL */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3 }}
              >
                Imágenes
              </Typography>
              <Stack spacing={3}>
                <Controller
                  name='avatar_url'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='URL del Avatar'
                      fullWidth
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <ImageIcon color='action' />
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
                      helperText='Recomendado: 1600x400px'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <ImageIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
            >
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3 }}
              >
                Redes Sociales
              </Typography>
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
                <Controller
                  name='social_links.website'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Sitio Web'
                      fullWidth
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LanguageIcon fontSize='small' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Stack>
            </Paper>

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

export default PanelDeUsuario
