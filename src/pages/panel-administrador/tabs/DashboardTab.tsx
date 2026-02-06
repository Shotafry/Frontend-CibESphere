import React from 'react'
import { Box, Typography, Fade, Grid } from '@mui/material'
import {
  Event as EventIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material'
import { AdminStats } from '../../../types'
import { KPICard } from '../components/KPICard'
import { EventsChart } from '../components/EventsChart'
import { CategoryPieChart } from '../components/CategoryPieChart'
import { UserRegistrationsChart } from '../components/UserRegistrationsChart'

interface DashboardTabProps {
  stats: AdminStats
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats }) => (
  <Fade in timeout={500}>
    <Box>
      <Typography
        variant='h4'
        fontWeight='bold'
        mb={4}
        sx={{
          background: 'linear-gradient(45deg, #1e293b 30%, #6366f1 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}
      >
        Dashboard General
      </Typography>

      {/* KPI Cards Row */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title='Eventos Activos'
            value={stats.active_events.toString()}
            icon={<EventIcon />}
            color='#0ea5e9'
            trend={{ value: 12, label: 'vs mes anterior' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title='Usuarios Totales'
            value={stats.total_users.toLocaleString()}
            icon={<PeopleIcon />}
            color='#10b981'
            trend={{ value: 8.5, label: 'crecimiento' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title='Orgs Verificadas'
            value={stats.verified_orgs.toString()}
            icon={<VerifiedIcon />}
            color='#f59e0b'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title='Ingresos (Simulado)'
            value={`$${(stats.total_revenue / 100).toLocaleString()}`}
            icon={<MoneyIcon />}
            color='#6366f1'
            trend={{ value: 24, label: 'vs mes anterior' }}
          />
        </Grid>
      </Grid>

      {/* Main Charts Area */}
      <Grid container spacing={3} mb={4}>
        {/* Events Bar Chart - Full Width for better detail */}
        <Grid size={{ xs: 12 }}>
          <Box height={400}>
            <EventsChart data={stats.events_per_month} />
          </Box>
        </Grid>

        {/* Categories (Pie) & Users (Area) - Split 50/50 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box height={450}>
            <CategoryPieChart data={stats.category_distribution} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box height={450}>
            <UserRegistrationsChart data={stats.user_registrations} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Fade>
)
