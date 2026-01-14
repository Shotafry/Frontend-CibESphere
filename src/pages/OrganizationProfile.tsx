// src/pages/OrganizationProfile.tsx
import { FunctionComponent, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Paper,
  Divider,
  Stack
} from '@mui/material'
import {
  Verified as VerifiedIcon,
  Language as WebsiteIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  X as XIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Add as FollowIcon,
  Check as FollowingIcon
} from '@mui/icons-material'
import { useLoaderData } from 'react-router-dom'
import { OrganizationSummary, Event } from '../types'
import { EventCard } from '../components/EventCard'
import { Button } from '../components/Button'

interface LoaderData {
  organization: OrganizationSummary
  events: Event[]
}

const OrganizationProfile: FunctionComponent = () => {
  const { organization, events } = useLoaderData() as LoaderData
  const [tabValue, setTabValue] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)

  // --- LÓGICA DE FECHAS CORREGIDA ---
  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.start_date) >= now)
  const pastEvents = events.filter((e) => new Date(e.start_date) < now)

  const totalAttendees = events.reduce(
    (acc, curr) => acc + curr.current_attendees,
    0
  )

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <Box sx={{ pb: 8, minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* HERO BANNER */}
      <Box
        sx={{
          height: { xs: 200, md: 350 },
          width: '100%',
          backgroundImage: `url(${
            organization.banner_url || '/default-banner.jpg'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
          }
        }}
      />

      <Container
        maxWidth='xl'
        sx={{
          px: { xs: 1.5, sm: 2, md: 8 },
          mt: -10,
          position: 'relative',
          zIndex: 2
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: { xs: '16px', md: '24px' },
            p: { xs: 2.5, sm: 3, md: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 3, md: 4 },
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}
        >
          {/* LOGO */}
          <Avatar
            src={organization.logo_url}
            alt={organization.name}
            sx={{
              width: { xs: 100, sm: 120, md: 160 },
              height: { xs: 100, sm: 120, md: 160 },
              border: { xs: '4px solid white', md: '5px solid white' },
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              mt: { xs: -8, md: -10 },
              bgcolor: 'white'
            }}
          />

          {/* INFO PRINCIPAL */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 1,
                mb: 1,
                flexWrap: 'wrap'
              }}
            >
              <Typography
                variant='h3'
                fontWeight='900'
                sx={{
                  color: 'var(--Gray-900)',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  wordBreak: 'break-word'
                }}
              >
                {organization.name}
              </Typography>
              {organization.is_verified && (
                <VerifiedIcon
                  sx={{
                    color: 'var(--color-cadetblue)',
                    fontSize: { xs: 24, md: 32 }
                  }}
                />
              )}
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems='center'
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mb: 3, color: 'var(--Gray-600)' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationIcon fontSize='small' />
                <Typography
                  variant='body1'
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  {organization.city}
                </Typography>
              </Box>
              {organization.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WebsiteIcon fontSize='small' />
                  <a
                    href={organization.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    Sitio Web
                  </a>
                </Box>
              )}
            </Stack>

            <Typography
              variant='body1'
              sx={{
                maxWidth: 800,
                mb: 3,
                color: 'var(--Gray-700)',
                lineHeight: 1.6,
                fontSize: { xs: '0.95rem', md: '1rem' }
              }}
            >
              {organization.description || 'Sin descripción disponible.'}
            </Typography>

            {/* REDES SOCIALES */}
            <Stack
              direction='row'
              spacing={1}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              flexWrap='wrap'
              useFlexGap
              sx={{ gap: 1 }}
            >
              {organization.social_links?.twitter && (
                <IconButton
                  href={organization.social_links.twitter}
                  target='_blank'
                  size='small'
                  sx={{
                    color: '#000000',
                    bgcolor: '#F0F0F0',
                    width: 36,
                    height: 36
                  }}
                >
                  <XIcon fontSize='small' />
                </IconButton>
              )}
              {organization.social_links?.linkedin && (
                <IconButton
                  href={organization.social_links.linkedin}
                  target='_blank'
                  size='small'
                  sx={{
                    color: '#0A66C2',
                    bgcolor: '#E1F0FF',
                    width: 36,
                    height: 36
                  }}
                >
                  <LinkedInIcon fontSize='small' />
                </IconButton>
              )}
              {organization.social_links?.github && (
                <IconButton
                  href={organization.social_links.github}
                  target='_blank'
                  size='small'
                  sx={{
                    color: '#333',
                    bgcolor: '#F0F0F0',
                    width: 36,
                    height: 36
                  }}
                >
                  <GitHubIcon fontSize='small' />
                </IconButton>
              )}
              {organization.email && (
                <IconButton
                  href={`mailto:${organization.email}`}
                  size='small'
                  sx={{
                    color: 'var(--color-cadetblue)',
                    bgcolor: 'rgba(79, 186, 200, 0.1)',
                    width: 36,
                    height: 36
                  }}
                >
                  <EmailIcon fontSize='small' />
                </IconButton>
              )}
            </Stack>
          </Box>

          {/* ACCIONES Y ESTADÍSTICAS */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'stretch', sm: 'center', md: 'flex-end' },
              gap: 3,
              minWidth: { xs: '100%', md: 200 }
            }}
          >
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              startIcon={isFollowing ? <FollowingIcon /> : <FollowIcon />}
              onClick={handleFollow}
              fullWidth
            >
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </Button>

            <Stack
              direction='row'
              spacing={{ xs: 2, sm: 4 }}
              justifyContent='center'
              sx={{
                bgcolor: '#F1F5F9',
                p: 2,
                borderRadius: '16px',
                width: '100%'
              }}
            >
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color='var(--Gray-900)'
                  sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                >
                  {events.length}
                </Typography>
                <Typography
                  variant='caption'
                  color='var(--Gray-500)'
                  fontWeight='bold'
                  sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                >
                  EVENTOS
                </Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  color='var(--Gray-900)'
                  sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                >
                  {totalAttendees}
                </Typography>
                <Typography
                  variant='caption'
                  color='var(--Gray-500)'
                  fontWeight='bold'
                  sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                >
                  ASISTENTES
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* TABS DE EVENTOS */}
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{
              mb: 4,
              '& .MuiTab-root': {
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                fontWeight: 'bold',
                textTransform: 'none',
                color: 'var(--Gray-500)',
                minHeight: 48,
                '&.Mui-selected': { color: 'var(--color-cadetblue)' }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-cadetblue)',
                height: 3
              }
            }}
          >
            <Tab label={`Próximos (${upcomingEvents.length})`} />
            <Tab label={`Pasados (${pastEvents.length})`} />
          </Tabs>

          <Box role='tabpanel' hidden={tabValue !== 0}>
            {tabValue === 0 && (
              <Stack spacing={3}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                    <EventIcon
                      sx={{ fontSize: 60, color: 'var(--Gray-400)', mb: 2 }}
                    />
                    <Typography variant='h6' color='textSecondary'>
                      No hay eventos próximos programados.
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>

          <Box role='tabpanel' hidden={tabValue !== 1}>
            {tabValue === 1 && (
              <Stack spacing={3}>
                {pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                    <EventIcon
                      sx={{ fontSize: 60, color: 'var(--Gray-400)', mb: 2 }}
                    />
                    <Typography variant='h6' color='textSecondary'>
                      No hay eventos pasados.
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default OrganizationProfile
