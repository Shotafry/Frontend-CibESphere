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
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LanguageIcon from '@mui/icons-material/Language'
import { useNavigation } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { Event, User } from '../types'
import {
  createReview,
  getEventReviews,
  unsubscribeFromEvent,
  updateUser,
  getMe,
  getEvents
} from '../services/apiService'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { EventCard } from '../components/EventCard'
import { ImageUpload } from '../components/ImageUpload'

const PanelDeUsuario: FunctionComponent = () => {
  const { user, refreshUserData } = useAuth()
  const navigation = useNavigation()
  const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([])
  const [tabValue, setTabValue] = useState(0)
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
          } catch (e) {
            console.warn(
              'Could not fetch full user profile, using context user',
              e
            )
          }

          try {
            // Pass empty filters with required fields if needed, or cast defined structure
            const allEvents = await getEvents({
              startDate: null,
              endDate: null,
              tags: [],
              locations: [],
              levels: [],
              languages: []
            })
            setSubscribedEvents(allEvents.slice(0, 3) || [])
          } catch (e) {
            console.warn('Could not fetch events', e)
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
      city: user?.city || '',
      bio: user?.bio || '',
      avatar_url: user?.avatar_url || '',
      banner_url: user?.banner_url || '',
      company: user?.company || '',
      position: user?.position || '',
      twitter: user?.twitter || '',
      linkedin: user?.linkedin || '',

      website: user?.website || '',
      personal_quote: (user as any)?.personal_quote || ''
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
      'twitter',
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
                {user?.first_name?.[0]}
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
              variant='primary'
              href={`/u/${user?.slug || user?.id}`}
              target='_blank'
              startIcon={<PersonIcon />}
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
            <Tab label='Guardados' />
            <Tab label='Editar Perfil' />
            <Tab label='Configuración' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='xl' sx={{ mt: 6 }}>
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
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
                {user &&
                (user as any).BookmarkedEvents &&
                (user as any).BookmarkedEvents.length > 0 ? (
                  (user as any).BookmarkedEvents.map((event: Event) => (
                    <EventCard key={event.id} event={event} />
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
        <Box
          sx={{
            height: 200,
            width: '100%',
            backgroundImage: `url(${bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
              bgcolor: 'var(--color-cadetblue)',
              fontSize: '2.5rem'
            }}
          >
            {watchedFirstName?.[0]}
          </Avatar>
          <Box
            sx={{
              color: 'white',
              pb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            <Typography variant='h4' fontWeight='900'>
              {fullName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {watchedCity && <Typography>{watchedCity}</Typography>}
              {watchedCompany && <Typography>| {watchedCompany}</Typography>}
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
                name='twitter'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Twitter / X'
                    fullWidth
                    variant='outlined'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <TwitterIcon />
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
