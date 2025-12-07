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
import { useForm, Controller } from 'react-hook-form'
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
          <Grid container spacing={4} justifyContent='center'>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
              >
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Información Personal
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 4 }}
                >
                  Esta información será visible en tu perfil público.
                </Typography>

                {saveMessage && (
                  <Alert
                    severity={saveMessage.type}
                    sx={{ mb: 4, borderRadius: '12px' }}
                  >
                    {saveMessage.text}
                  </Alert>
                )}

                <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
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
                          <TextField
                            {...field}
                            label='Empresa / Organización'
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name='position'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='Cargo / Puesto'
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name='avatar_url'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label='URL del Avatar'
                            fullWidth
                            placeholder='https://...'
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant='subtitle2'
                        fontWeight='bold'
                        sx={{ mt: 2, mb: 2 }}
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
                                    <TwitterIcon fontSize='small' />
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
                                    <LinkedInIcon fontSize='small' />
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
                                    <GitHubIcon fontSize='small' />
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
                              label='Sitio Web Personal'
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
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 2
                        }}
                      >
                        <Button
                          type='submit'
                          variant='contained'
                          disabled={isSaving}
                          startIcon={
                            isSaving ? (
                              <CircularProgress size={20} color='inherit' />
                            ) : (
                              <SaveIcon />
                            )
                          }
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            background: 'var(--gradient-button-primary)',
                            '&:hover': {
                              background: 'var(--gradient-button-primary-hover)'
                            }
                          }}
                        >
                          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default PanelDeUsuario
