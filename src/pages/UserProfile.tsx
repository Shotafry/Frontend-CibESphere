import React from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
  Tab,
  Tabs
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { User } from '../types'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import LanguageIcon from '@mui/icons-material/Language'
import { EventCard } from '../components/EventCard'
import { Button } from '../components/Button'

interface LoaderData {
  user: any // Ajustar a UserPublicProfile cuando esté disponible en types
}

const UserProfile: React.FC = () => {
  const { user } = useLoaderData() as LoaderData
  const [tabValue, setTabValue] = React.useState(0)
  const navigate = useNavigate()

  // Detectar usuario logueado
  const loggedUserStr = localStorage.getItem('user')
  const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : null
  const isOwner =
    loggedUser && (loggedUser.id === user.id || loggedUser.slug === user.slug)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Use registered_events if available (new backend), fallback to favorite_events (legacy)
  const attendedEvents =
    (user as any).registered_events ||
    (user as any).favorite_events ||
    (user as any).FavoriteEvents ||
    []

  const upcomingEvents = attendedEvents.filter(
    (e: any) => new Date(e.start_date || e.startDate) > new Date()
  )
  const pastEvents = attendedEvents.filter(
    (e: any) => new Date(e.start_date || e.startDate) <= new Date()
  )

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : 'Usuario'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          height: 350,
          backgroundImage: `url(${
            user.banner_url ||
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 12,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))'
          }
        }}
      >
        <Container maxWidth='lg' sx={{ height: '100%', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: -60,
              left: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: 3
            }}
          >
            <Avatar
              src={user.avatar_url}
              alt={fullName}
              sx={{
                width: 160,
                height: 160,
                border: '6px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                bgcolor: 'var(--color-cadetblue)',
                fontSize: '3rem'
              }}
            >
              {user.first_name?.[0]}
            </Avatar>
            <Box
              sx={{
                color: 'white',
                pb: 1,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography
                variant='h3'
                fontWeight='900'
                sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {fullName}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 1,
                  opacity: 0.9
                }}
              >
                {user.city && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize='small' />
                    <Typography variant='body1'>{user.city}</Typography>
                  </Box>
                )}
                {user.company && (
                  <Typography variant='body1'>
                    {user.position ? `${user.position} at ` : ''}
                    <strong>{user.company}</strong>
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {isOwner && (
        <Container maxWidth='lg' sx={{ mb: 4, textAlign: 'right' }}>
          <Button
            variant='primary'
            onClick={() => navigate('/panel-de-usuario?tab=2')}
          >
            Editar Perfil
          </Button>
        </Container>
      )}

      <Container maxWidth='lg'>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: BIO & SOCIAL */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {user.bio && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <Typography variant='h6' fontWeight='bold' gutterBottom>
                    Sobre mí
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ lineHeight: 1.6 }}
                  >
                    {user.bio}
                  </Typography>
                </Paper>
              )}

              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: '20px', border: '1px solid #E2E8F0' }}
              >
                <Typography variant='h6' fontWeight='bold' gutterBottom>
                  Conectar
                </Typography>
                <Stack spacing={2}>
                  {user.twitter && (
                    <Button
                      startIcon={<TwitterIcon />}
                      fullWidth
                      variant='primary'
                      href={user.twitter}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start'
                      }}
                    >
                      Twitter
                    </Button>
                  )}
                  {user.linkedin && (
                    <Button
                      startIcon={<LinkedInIcon />}
                      fullWidth
                      variant='secondary'
                      href={user.linkedin}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start'
                      }}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {user.website && (
                    <Button
                      startIcon={<LanguageIcon />}
                      fullWidth
                      variant='secondary'
                      href={user.website}
                      target='_blank'
                      sx={{
                        justifyContent: 'flex-start'
                      }}
                    >
                      Sitio Web
                    </Button>
                  )}
                  {!user.twitter && !user.linkedin && !user.website && (
                    <Typography variant='body2' color='text.secondary'>
                      No hay redes sociales públicas.
                    </Typography>
                  )}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  bgcolor: '#F1F5F9'
                }}
              >
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  gutterBottom
                >
                  Miembro desde
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon fontSize='small' color='action' />
                  <Typography variant='body2' fontWeight='bold'>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('es-ES', {
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: EVENTS */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                minHeight: 400
              }}
            >
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}
              >
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
                      mr: 2
                    }
                  }}
                >
                  <Tab label={`Próximos Eventos (${upcomingEvents.length})`} />
                  <Tab label={`Historial (${pastEvents.length})`} />
                </Tabs>
              </Box>

              <Box sx={{ p: 4 }}>
                {tabValue === 0 && (
                  <Stack spacing={3}>
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }}
                        />
                        <Typography variant='h6'>
                          No hay eventos próximos
                        </Typography>
                        <Typography variant='body2'>
                          Este usuario no está inscrito en eventos futuros.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}

                {tabValue === 1 && (
                  <Stack spacing={3}>
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event: any) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }}
                        />
                        <Typography variant='h6'>No hay historial</Typography>
                        <Typography variant='body2'>
                          Este usuario no ha asistido a eventos pasados.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default UserProfile
