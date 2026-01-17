import React from 'react'
import { Box, Typography, Fade, Grid } from '@mui/material'
import {
  Event as EventIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'
import { DashboardStats } from '../../../types'
import { StatCard } from '../components/StatCard'

interface DashboardTabProps {
  stats: DashboardStats
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats }) => (
  <Fade in timeout={500}>
    <Box>
      <Typography variant='h6' fontWeight='bold' mb={3}>
        Resumen General
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Eventos Totales'
            value={stats.total_events}
            icon={<EventIcon />}
            color='#0ea5e9'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Usuarios'
            value={stats.total_attendees}
            icon={<PeopleIcon />}
            color='#10b981'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Ciudades'
            value={stats.total_cities}
            icon={<BusinessIcon />}
            color='#f59e0b'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Publicados'
            value={stats.published_events}
            icon={<VerifiedIcon />}
            color='#6366f1'
          />
        </Grid>
      </Grid>
    </Box>
  </Fade>
)
