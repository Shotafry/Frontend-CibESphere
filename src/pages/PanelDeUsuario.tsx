import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Paper,
  Divider,
  Tabs,
  Tab,
  Stack,
  Avatar,
  TextField,
  Alert,
  Fade,
  Switch,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  InputAdornment
} from '@mui/material'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SettingsIcon from '@mui/icons-material/Settings'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LanguageIcon from '@mui/icons-material/Language'
import { useNavigation, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { Event, User } from '../types'
import {
  createReview,
  getEventReviews,
  unsubscribeFromEvent,
  updateUser,
  getMe,
  getEvents,
  uploadImage
} from '../services/apiService'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { EventCard } from '../components/EventCard'
import { ImageUpload } from '../components/ImageUpload'

const PanelDeUsuario: FunctionComponent = () => {
  const { user, refreshUserData } = useAuth()
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()
  const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([])
  // Leer tab inicial desde query params (ej: ?tab=2 para Editar Perfil)
  const initialTab = parseInt(searchParams.get('tab') || '0', 10)
  const [tabValue, setTabValue] = useState(initialTab)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoadingConfig(true)
      try {
        if (user) {
          try {
            const fullUser = await getMe()
            refreshUserData(fullUser)
            // Usar registered_events del usuario (eventos inscritos)
            if (
              fullUser.registered_events &&
              fullUser.registered_events.length > 0
            ) {
              setSubscribedEvents(fullUser.registered_events as Event[])
            } else {
              setSubscribedEvents([])
            }
          } catch (e) {
            console.warn(
              'Could not fetch full user profile, using context user',
              e
            )
            // Fallback: usar datos del contexto
            if (user.registered_events && user.registered_events.length > 0) {
              setSubscribedEvents(user.registered_events as Event[])
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data', error)
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchData()
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<User>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      slug: user?.slug || '',
      city: user?.city || '',
      bio: user?.bio || '',
      avatar_url: user?.avatar_url || '',
      banner_url: user?.banner_url || '',
      company: user?.company || '',
      position: user?.position || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',

      website: user?.website || '',
      personal_quote: (user as any)?.personal_quote || '',
      badges: (user as any)?.badges || ''
    }
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCancelSubscription = async (eventId: string) => {
    if (!user) return
    try {
      await unsubscribeFromEvent(eventId)
      const newSubscribedEvents = subscribedEvents.filter(
        (e) => e.id !== eventId
      )
      setSubscribedEvents(newSubscribedEvents)
    } catch (error) {
      console.error('Error al cancelar la inscripción:', error)
    }
  }

  const onSaveProfile = async (data: User) => {
    if (!user) return
    setIsSaving(true)
    setSaveMessage(null)

    // Sanitize data: convert empty strings to undefined to avoid validation errors
    const sanitizedData = { ...data }
    const optionalFields: (keyof User)[] = [
      'website',
      'linkedin',
      'github',
      'company',
      'position',
      'personal_quote',
      'slug',
      'avatar_url',
      'banner_url'
    ]

    optionalFields.forEach((field) => {
      if (sanitizedData[field] === '') {
        ;(sanitizedData as any)[field] = undefined
      }
    })

    // Remove email field as it cannot be updated
    delete (sanitizedData as any).email

    try {
      const updatedUser = await updateUser(user.id, sanitizedData)
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

  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedEventToReview, setSelectedEventToReview] =
    useState<Event | null>(null)
  const [reviewRating, setReviewRating] = useState<number | null>(5)
  const [reviewComment, setReviewComment] = useState('')

  const handleOpenReviewModal = async (event: Event) => {
    try {
      const existingReviews = await getEventReviews(event.id)
      const userReview = existingReviews.find((r) => r.userId === user?.id)

      if (userReview) {
        setSaveMessage({
          type: 'error',
          text: 'Ya has escrito una reseña para este evento. Solo se permite una por usuario.'
        })
        return
      }

      setSelectedEventToReview(event)
      setReviewModalOpen(true)
      setReviewRating(5)
      setReviewComment('')
    } catch (error) {
      console.error('Error checking reviews:', error)
    }
  }

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false)
    setSelectedEventToReview(null)
  }

  const handleSubmitReview = async () => {
    if (!selectedEventToReview || !user) return

    try {
      await createReview({
        eventId: selectedEventToReview.id,
        userId: user.id,
        userName: user.first_name + ' ' + user.last_name,
        userAvatar: user.avatar_url,
        userCompany: user.company,
        userPosition: user.position,
        userQuote: user.personal_quote,
        rating: reviewRating || 5,
        comment: reviewComment
      })
      setReviewModalOpen(false)
      setSaveMessage({ type: 'success', text: 'Reseña enviada correctamente' })
    } catch (error: any) {
      console.error('Error submitting review:', error)
      if (error.response?.status === 409) {
        setSaveMessage({
          type: 'error',
          text: 'Ya has enviado una reseña para este evento.'
        })
      } else {
        setSaveMessage({ type: 'error', text: 'Error al enviar la reseña' })
      }
    }
  }

  if (loadingConfig || navigation.state === 'loading') {
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

  const upcomingEvents = subscribedEvents.filter(
    (e) => new Date(e.start_date) > new Date()
  )
  const pastEvents = subscribedEvents.filter(
    (e) => new Date(e.start_date) <= new Date()
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          pt: { xs: 2, sm: 4 },
          pb: 0
        }}
      >
        <Container maxWidth='xl' sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 4 }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 }
              }}
            >
              <Avatar
                src={user?.avatar_url}
                sx={{
                  width: { xs: 48, sm: 64, md: 80 },
                  height: { xs: 48, sm: 64, md: 80 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  bgcolor: 'var(--color-cadetblue)'
                }}
              >
                {user?.first_name?.[0]}
              </Avatar>
              <Box>
                <Typography
                  variant='h4'
                  fontWeight='bold'
                  sx={{
                    color: 'var(--Gray-900)',
                    fontSize: { xs: '1.125rem', sm: '1.5rem', md: '2rem' }
                  }}
                >
                  Hola, {user?.first_name}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Gestiona tus eventos y tu perfil
                </Typography>
              </Box>
            </Box>
            <Button
              variant='primary'
              href={`/u/${user?.slug || user?.id}`}
              target='_blank'
              startIcon={<PersonIcon />}
              size='small'
              sx={{
                display: { xs: 'none', sm: 'flex' },
                width: 'auto',
                justifyContent: 'center',
                fontSize: { sm: '0.85rem' }
              }}
            >
              Ver Perfil
            </Button>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                fontWeight: 600,
                minWidth: { xs: 'auto', sm: 90 },
                mr: { xs: 0.5, sm: 2 },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 1, sm: 1.5 }
              }
            }}
          >
            <Tab label='Eventos' />
            <Tab label='Favoritos' />
            <Tab label='Perfil' />
            <Tab label='Ajustes' />
          </Tabs>
        </Container>
      </Box>

      <Container
        maxWidth='xl'
        sx={{ mt: { xs: 3, sm: 6 }, px: { xs: 2, sm: 3, md: 4 } }}
      >
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
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
                            variant='secondary'
                            size='small'
                            onClick={() => handleCancelSubscription(event.id)}
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
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
                        <Button variant='primary' href='/'>
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
                          <Paper
                            key={event.id}
                            elevation={0}
                            sx={{
                              p: 0,
                              borderRadius: '25px',
                              overflow: 'hidden',
                              bgcolor: 'white',
                              border: '1px solid #E2E8F0',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <EventCard event={event} />
                            <Box
                              sx={{
                                p: 2,
                                borderTop: '1px solid #E2E8F0',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                bgcolor: '#FAFAFA'
                              }}
                            >
                              <Button
                                variant='secondary'
                                startIcon={<StarHalfIcon />}
                                onClick={() => handleOpenReviewModal(event)}
                              >
                                Escribir Reseña
                              </Button>
                            </Box>
                          </Paper>
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
            </Box>
          </Fade>
        )}

        {tabValue === 1 && (
          <Fade in={tabValue === 1} timeout={500}>
            <Box>
              <Typography
                variant='h6'
                fontWeight='bold'
                gutterBottom
                sx={{ mb: 3 }}
              >
                Eventos Guardados
              </Typography>
              <Stack spacing={3}>
                {user?.favorite_events && user.favorite_events.length > 0 ? (
                  user.favorite_events.map((event) => (
                    <EventCard key={event.id} event={event as any} />
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
                      No tienes eventos guardados.
                    </Typography>
                    <Button variant='primary' href='/'>
                      Explorar Eventos
                    </Button>
                  </Paper>
                )}
              </Stack>
            </Box>
          </Fade>
        )}

        {tabValue === 2 && (
          <Fade in={tabValue === 2} timeout={500}>
            <Box>
              <EditProfileForm
                user={user}
                control={control}
                handleSubmit={handleSubmit}
                onSaveProfile={onSaveProfile}
                isSaving={isSaving}
                saveMessage={saveMessage}
              />
            </Box>
          </Fade>
        )}

        {tabValue === 3 && (
          <Fade in={tabValue === 3} timeout={500}>
            <Container maxWidth='md'>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  border: '1px solid #E2E8F0',
                  mb: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant='h6' fontWeight='bold'>
                    Configuración de Notificaciones
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Box>
                        <Typography fontWeight='500'>
                          Notificaciones por Email
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Recibe correos sobre tus eventos próximos y novedades.
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 3, alignItems: 'flex-start' }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Box>
                        <Typography fontWeight='500'>
                          Notificaciones Push
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Recibe alertas en el navegador cuando estés en línea.
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 3, alignItems: 'flex-start' }}
                  />
                </FormGroup>
                <Box
                  sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button
                    variant='secondary'
                    onClick={() =>
                      setSaveMessage({
                        type: 'success',
                        text: 'Preferencias guardadas correctamente'
                      })
                    }
                  >
                    Guardar Preferencias
                  </Button>
                </Box>
              </Paper>
            </Container>
          </Fade>
        )}
      </Container>

      <Dialog
        open={reviewModalOpen}
        onClose={handleCloseReviewModal}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Escribir Reseña</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Comparte tu experiencia en {selectedEventToReview?.title}
          </Typography>

          {saveMessage && (
            <Alert severity={saveMessage.type} sx={{ mb: 2 }}>
              {saveMessage.text}
            </Alert>
          )}

          <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component='legend'>Valoración:</Typography>
            <Rating
              value={reviewRating}
              onChange={(e, n) => setReviewRating(n)}
            />
          </Box>
          <TextField
            autoFocus
            margin='dense'
            label='Tu comentario'
            fullWidth
            multiline
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseReviewModal} variant='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleSubmitReview} variant='primary'>
            Enviar Reseña
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

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
        {/* Ver Perfil Público Button */}
        <Button
          variant='primary'
          href={`/u/${user?.slug || user?.id}`}
          target='_blank'
          size='small'
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            fontSize: '0.75rem',
            py: 0.75,
            px: 1.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          Ver Perfil
        </Button>
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
            src={avatarUrl}
            sx={{
              width: { xs: 70, sm: 85, md: 100 },
              height: { xs: 70, sm: 85, md: 100 },
              border: '3px solid white',
              bgcolor: 'var(--color-cadetblue)',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {watchedFirstName?.[0]}
          </Avatar>
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
              {fullName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: { xs: 0, sm: 1 },
                mt: 0.5
              }}
            >
              {watchedCity && (
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  {watchedCity}
                </Typography>
              )}
              {watchedCompany && (
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  <Box
                    component='span'
                    sx={{ display: { xs: 'none', sm: 'inline' } }}
                  >
                    |{' '}
                  </Box>
                  {watchedCompany}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 4 }}>
          {saveMessage.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, borderRadius: '24px' }}>
            <Typography variant='h6' fontWeight='bold' mb={3}>
              Información Personal
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='first_name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Nombre'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='last_name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Apellido'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Email'
                      fullWidth
                      variant='outlined'
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <MailOutlineIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='slug'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Identificador de URL Pública (Slug)'
                      fullWidth
                      variant='outlined'
                      helperText='Define tu URL: cybesphere.com/u/tu-slug. Solo letras, números y guiones.'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LanguageIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='personal_quote'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Frase Personal / Cita'
                      fullWidth
                      placeholder='Ej: "Innovación es la clave del éxito"'
                      helperText='Esta frase aparecerá al pasar el ratón sobre tu nombre en las reseñas.'
                      // InputProps={{
                      //   startAdornment: (
                      //     <InputAdornment position='start'>
                      //       <FormatQuoteIcon color='action' />
                      //     </InputAdornment>
                      //   )
                      // }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Ciudad'
                      fullWidth
                      variant='outlined'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LocationOnIcon />
                          </InputAdornment>
                        )
                      }}
                    />
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
                      label='Biografía'
                      fullWidth
                      multiline
                      rows={4}
                      variant='outlined'
                      placeholder='Cuéntanos un poco sobre ti...'
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Typography variant='h6' fontWeight='bold' sx={{ mt: 4, mb: 3 }}>
              Información Profesional
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='company'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Empresa'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='position'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Cargo / Puesto'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', mb: 3 }}>
            <Typography variant='h6' fontWeight='bold' mb={3}>
              Redes Sociales
            </Typography>
            <Stack spacing={2}>
              <Controller
                name='github'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='GitHub'
                    fullWidth
                    variant='outlined'
                    placeholder='https://github.com/tu-usuario'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <GitHubIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='linkedin'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='LinkedIn'
                    fullWidth
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LinkedInIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name='website'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Sitio Web Personal'
                    fullWidth
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LanguageIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: '24px' }}>
            <Typography variant='h6' fontWeight='bold' mb={3}>
              Imágenes
            </Typography>
            <Stack spacing={4}>
              <Controller
                name='avatar_url'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUpload
                    label='Foto de Perfil'
                    currentUrl={value}
                    onUpload={onChange}
                    altText='Avatar'
                  />
                )}
              />
              <Divider />
              <Controller
                name='banner_url'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <ImageUpload
                    label='Banner de Perfil'
                    currentUrl={value}
                    onUpload={onChange}
                    altText='Banner'
                    isBanner
                  />
                )}
              />
            </Stack>
          </Paper>

          {/* Sección de Certificaciones/Badges */}
          <Paper sx={{ p: 4, borderRadius: '24px', mt: 3 }}>
            <Typography variant='h6' fontWeight='bold' mb={2}>
              Certificaciones y Badges
            </Typography>
            <Typography variant='body2' color='text.secondary' mb={3}>
              Sube hasta 10 imágenes de tus certificaciones. Aparecerán como
              iconos circulares en tu perfil público.
            </Typography>
            <Controller
              name='badges'
              control={control}
              render={({ field: { value, onChange } }) => {
                // Parse badges JSON
                let badgeList: Array<{
                  id: string
                  url: string
                  name: string
                }> = []
                try {
                  if (value) {
                    badgeList = JSON.parse(value)
                  }
                } catch {
                  badgeList = []
                }

                const handleAddBadge = async (file: File) => {
                  if (badgeList.length >= 10) {
                    alert('Máximo 10 badges permitidos')
                    return
                  }
                  try {
                    const url = await uploadImage(file, 'badge')
                    const newBadge = {
                      id: Date.now().toString(),
                      url,
                      name: file.name.replace(/\.[^/.]+$/, '')
                    }
                    const updated = [...badgeList, newBadge]
                    onChange(JSON.stringify(updated))
                  } catch (error) {
                    console.error('Error uploading badge:', error)
                    alert('Error al subir el badge')
                  }
                }

                const handleRemoveBadge = (id: string) => {
                  const updated = badgeList.filter((b) => b.id !== id)
                  onChange(JSON.stringify(updated))
                }

                return (
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3
                      }}
                    >
                      {badgeList.map((badge) => (
                        <Box
                          key={badge.id}
                          sx={{
                            position: 'relative',
                            width: 80,
                            height: 80
                          }}
                        >
                          <Avatar
                            src={badge.url}
                            alt={badge.name}
                            sx={{
                              width: 80,
                              height: 80,
                              border: '2px solid #E2E8F0'
                            }}
                          />
                          <Box
                            onClick={() => handleRemoveBadge(badge.id)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'error.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: 14,
                              fontWeight: 'bold',
                              '&:hover': { bgcolor: 'error.dark' }
                            }}
                          >
                            ×
                          </Box>
                          <Typography
                            variant='caption'
                            sx={{
                              display: 'block',
                              textAlign: 'center',
                              mt: 0.5,
                              maxWidth: 80,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {badge.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {badgeList.length < 10 && (
                      <Box>
                        <input
                          type='file'
                          id='badge-upload'
                          accept='image/png, image/jpeg, image/webp'
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleAddBadge(file)
                              e.target.value = ''
                            }
                          }}
                        />
                        <label htmlFor='badge-upload'>
                          <Button
                            variant='secondary'
                            size='small'
                            onClick={() =>
                              document.getElementById('badge-upload')?.click()
                            }
                          >
                            + Añadir Badge ({badgeList.length}/10)
                          </Button>
                        </label>
                      </Box>
                    )}
                  </Box>
                )
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='primary' type='submit' disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>
    </Box>
  )
}

export default PanelDeUsuario
