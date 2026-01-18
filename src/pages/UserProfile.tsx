// src/pages/UserProfile.tsx
import React from 'react'
import { Box, Container, Grid, Stack } from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { PublicUserProfile as PublicUserProfileType } from '../types'
import { Button } from '../components/Button'
import {
  UserHero,
  UserBio,
  UserSocials,
  UserStats,
  UserBadges,
  UserEventsTab
} from './user-profile'
import { PageTransition } from '../components/PageTransition'

interface LoaderData {
  user: PublicUserProfileType
}

const UserProfile: React.FC = () => {
  const { user } = useLoaderData() as LoaderData
  const navigate = useNavigate()

  // Detectar usuario logueado
  const loggedUserStr = localStorage.getItem('user')
  const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : null
  const isOwner =
    loggedUser && (loggedUser.id === user.id || loggedUser.slug === user.slug)

  const allEvents = user.registered_events || []

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* HERO SECTION */}
        <UserHero user={user} />

        {/* ACTION BAR (if owner) */}
        {isOwner && (
          <Container maxWidth='xl' sx={{ mt: 12, mb: -4, textAlign: 'right' }}>
            <Button
              variant='primary'
              onClick={() => navigate('/panel-de-usuario?tab=2')}
            >
              Editar Perfil
            </Button>
          </Container>
        )}

        {/* MAIN CONTENT */}
        <Container maxWidth='xl' sx={{ mt: isOwner ? 6 : 14 }}>
          <Grid container spacing={4}>
            {/* LEFT COLUMN: BIO, SOCIAL, STATS */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <UserBio bio={user.bio} />
                <UserSocials user={user} />
                <UserStats user={user} eventsCount={allEvents.length} />
                <UserBadges user={user} />
              </Stack>
            </Grid>

            {/* RIGHT COLUMN: EVENTS */}
            <Grid size={{ xs: 12, md: 8 }}>
              <UserEventsTab events={allEvents} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  )
}

export default UserProfile
