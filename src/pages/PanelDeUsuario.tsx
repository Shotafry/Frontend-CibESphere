import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Tabs,
  Tab,
  Fade,
  Avatar,
  Paper
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigation, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { Event, User } from '../types'
import { updateUser, getMe, unsubscribeFromEvent } from '../services/apiService'
import { useForm } from 'react-hook-form'

// Importar componentes refactorizados
import {
  ProfileTab,
  EventsTab,
  BookmarksTab,
  NotificationsTab,
  TicketsTab,
  ReviewModal
} from './panel-usuario'

const PanelDeUsuario: FunctionComponent = () => {
  const { user, refreshUserData } = useAuth()
  const navigation = useNavigation()
  const [searchParams, setSearchParams] = useSearchParams()

  // Estado para eventos
  const [subscribedEvents, setSubscribedEvents] = useState<Event[]>([])

  // Estado de pestañas
  const initialTab = parseInt(searchParams.get('tab') || '0', 10)
  const [tabValue, setTabValue] = useState(initialTab)

  // Estado de carga y guardado
  const [isSaving, setIsSaving] = useState(false)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Estado del modal de reseñas
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedEventToReview, setSelectedEventToReview] =
    useState<Event | null>(null)

  // Cargar datos del usuario
  useEffect(() => {
    const fetchData = async () => {
      setLoadingConfig(true)
      try {
        if (user) {
          try {
            const fullUser = await getMe()
            refreshUserData(fullUser)
            // Usar registered_events del usuario
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
  }, []) // Dependencias vacías para cargar solo al montar

  // Formulario de perfil
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
      employer: user?.employer || '',
      position: user?.position || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      personal_website: user?.personal_website || '',
      personal_quote: (user as any)?.personal_quote || '',
      badges: (user as any)?.badges || '',
      // Campos de conexión social (v0.9.0)
      social_discord: user?.social_discord || '',
      social_telegram: user?.social_telegram || '',
      show_email_on_match: user?.show_email_on_match || false
    }
  })

  // Manejadores de eventos
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setSearchParams({ tab: newValue.toString() })
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

    const sanitizedData = { ...data }
    const optionalFields: (keyof User)[] = [
      'personal_website',
      'linkedin',
      'github',
      'employer',
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

  const handleOpenReviewModal = (event: Event) => {
    setSelectedEventToReview(event)
    setReviewModalOpen(true)
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

  // ⚡ Bolt: Memoize expensive array filtering to prevent recalculation on every render
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date()
    return {
      upcomingEvents: subscribedEvents.filter((e) => new Date(e.start_date) > now),
      pastEvents: subscribedEvents.filter((e) => new Date(e.start_date) <= now)
    }
  }, [subscribedEvents])

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
      {/* Header del Panel */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E2E8F0',
          pt: { xs: 2, sm: 4 },
          pb: 0
        }}
      >
        <Container maxWidth='lg' sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
            <Tab label='Mis Entradas' />
            <Tab label='Favoritos' />
            <Tab label='Perfil' />
            <Tab label='Notificaciones' />
          </Tabs>
        </Container>
      </Box>

      {/* Contenido de Tabs */}
      <Container
        maxWidth='lg'
        sx={{ mt: { xs: 3, sm: 6 }, px: { xs: 2, sm: 3, md: 4 } }}
      >
        {tabValue === 0 && (
          <Fade in={tabValue === 0} timeout={500}>
            <Box>
              <EventsTab
                upcomingEvents={upcomingEvents}
                pastEvents={pastEvents}
                handleCancelSubscription={handleCancelSubscription}
                handleOpenReviewModal={handleOpenReviewModal}
              />
            </Box>
          </Fade>
        )}

        {tabValue === 1 && (
          <Fade in={tabValue === 1} timeout={500}>
            <Box>
              <TicketsTab />
            </Box>
          </Fade>
        )}

        {tabValue === 2 && (
          <Fade in={tabValue === 2} timeout={500}>
            <Box>
              <BookmarksTab user={user} />
            </Box>
          </Fade>
        )}

        {tabValue === 3 && (
          <Fade in={tabValue === 3} timeout={500}>
            <Box>
              <ProfileTab
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

        {tabValue === 4 && (
          <Fade in={tabValue === 4} timeout={500}>
            <Box>
              <NotificationsTab />
            </Box>
          </Fade>
        )}
      </Container>

      {/* Modal de Reseñas */}
      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        event={selectedEventToReview}
        user={user}
        onSuccess={(msg) => setSaveMessage({ type: 'success', text: msg })}
        onError={(msg) => setSaveMessage({ type: 'error', text: msg })}
      />
    </Box>
  )
}

export default PanelDeUsuario
