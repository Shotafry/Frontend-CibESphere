import React from 'react'
import { Grid } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { StatCard } from '../components/StatCard'
import { DashboardStats, Event } from '../../../types'

interface DashboardTabProps {
  stats: DashboardStats
  events: Event[]
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  stats,
  events
}) => {
  const upcomingEventsCount = events.filter(
    (e) => new Date(e.start_date) >= new Date()
  ).length
  const avgAttendees =
    events.length > 0 ? Math.round(stats.total_attendees / events.length) : 0

  return (
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
  )
}
