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
  // Calculate advanced metrics
  const upcomingEventsCount = events.filter(
    (e) => new Date(e.start_date) >= new Date()
  ).length

  const avgAttendees =
    events.length > 0 ? Math.round(stats.total_attendees / events.length) : 0

  const draftEventsCount = events.filter((e) => e.status === 'draft').length

  // Calculate Occupancy Rate (Total Attendees / Total Capacity of events with capacity)
  const eventsWithCapacity = events.filter(
    (e) => e.max_attendees && e.max_attendees > 0
  )
  const totalCapacity = eventsWithCapacity.reduce(
    (sum, e) => sum + (e.max_attendees || 0),
    0
  )
  const totalAttendeesInCappedEvents = eventsWithCapacity.reduce(
    (sum, e) => sum + (e.current_attendees || 0),
    0
  )

  const occupancyRate =
    totalCapacity > 0
      ? Math.round((totalAttendeesInCappedEvents / totalCapacity) * 100)
      : 0

  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {/* 2x2 Grid Layout: xs=12 (1 col), sm=6 (2 cols) */}

      <Grid size={{ xs: 12, sm: 6 }}>
        <StatCard
          title='Eventos Totales'
          value={stats.total_events}
          icon={<EventIcon />}
          color='#3B82F6'
          trend={`${upcomingEventsCount} Próximos • ${draftEventsCount} Borradores`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <StatCard
          title='Asistentes Totales'
          value={stats.total_attendees}
          icon={<GroupIcon />}
          color='#10B981'
          trend={`~${avgAttendees} por evento`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <StatCard
          title='Tasa de Ocupación'
          value={`${occupancyRate}%`}
          icon={<CheckCircleIcon />}
          color='#8B5CF6'
          trend='En eventos con cupo'
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <StatCard
          title='Cobertura Geográfica'
          value={stats.total_cities}
          icon={<LocationCityIcon />}
          color='#F59E0B'
          trend='Ciudades alcanzadas'
        />
      </Grid>
    </Grid>
  )
}
