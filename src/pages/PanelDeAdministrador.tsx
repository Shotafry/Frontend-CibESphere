import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Alert
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import {
  DashboardStats,
  User,
  OrganizationSummary,
  Event,
  Role
} from '../types'
import * as apiService from '../services/apiService'

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import EventIcon from '@mui/icons-material/Event'
import VerifiedIcon from '@mui/icons-material/Verified'
import GppBadIcon from '@mui/icons-material/GppBad'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface AdminLoaderData {
  stats: DashboardStats
}

// --- TAB PANELS ---

const DashboardTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <Grid container spacing={3}>
    {[
      { label: 'Eventos Totales', value: stats.total_events, color: '#0ea5e9' },
      {
        label: 'Usuarios Registrados',
        value: stats.total_attendees,
        color: '#10b981'
      }, // Note: reusing field for simplified mock
      {
        label: 'Ciudades Activas',
        value: stats.total_cities,
        color: '#f59e0b'
      },
      {
        label: 'Eventos Publicados',
        value: stats.published_events,
        color: '#6366f1'
      }
    ].map((item) => (
      <Grid item xs={12} sm={6} md={3} key={item.label}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}
        >
          <Typography
            variant='h3'
            fontWeight='bold'
            sx={{ color: item.color, mb: 1 }}
          >
            {item.value}
          </Typography>
          <Typography
            variant='subtitle2'
            color='text.secondary'
            fontWeight='600'
          >
            {item.label}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
)

const OrganizationsTab: React.FC = () => {
  const [orgs, setOrgs] = useState<OrganizationSummary[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrgs = async () => {
    try {
      const data = await apiService.getAllOrganizations()
      setOrgs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrgs()
  }, [])

  const handleVerify = async (orgId: string) => {
    if (window.confirm('¿Verificar esta organización?')) {
      await apiService.verifyOrganization(orgId)
      loadOrgs()
    }
  }

  if (loading) return <CircularProgress />

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}
    >
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell>Organización</TableCell>
            <TableCell>Ciudad</TableCell>
            <TableCell align='center'>Estado</TableCell>
            <TableCell align='right'>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orgs.map((org) => (
            <TableRow key={org.id}>
              <TableCell>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar src={org.logo_url} variant='rounded'>
                    {org.name[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight='bold'>{org.name}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {org.email || 'Sin email'}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>{org.city}</TableCell>
              <TableCell align='center'>
                {org.is_verified ? (
                  <Chip
                    icon={<VerifiedIcon />}
                    label='Verificada'
                    color='success'
                    size='small'
                    variant='outlined'
                  />
                ) : (
                  <Chip
                    icon={<GppBadIcon />}
                    label='Pendiente'
                    color='warning'
                    size='small'
                    variant='outlined'
                  />
                )}
              </TableCell>
              <TableCell align='right'>
                {!org.is_verified && (
                  <Button
                    variant='contained'
                    size='small'
                    color='success'
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleVerify(org.id)}
                  >
                    Verificar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {orgs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align='center'>
                No hay organizaciones registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    try {
      const data = await apiService.getAllUsers()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await apiService.deleteUser(userId)
      loadUsers()
    }
  }

  if (loading) return <CircularProgress />

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}
    >
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Registro</TableCell>
            <TableCell align='right'>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar src={user.avatar_url}>{user.first_name[0]}</Avatar>
                  <Box>
                    <Typography fontWeight='bold'>{user.full_name}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  size='small'
                  color={
                    user.role === Role.Admin
                      ? 'secondary'
                      : user.role === Role.Organizer
                      ? 'primary'
                      : 'default'
                  }
                />
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell align='right'>
                <IconButton color='error' onClick={() => handleDelete(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const PanelDeAdministrador: React.FC = () => {
  const { stats } = useLoaderData() as AdminLoaderData
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', pb: 8 }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', pt: 4, pb: 8 }}>
        <Container maxWidth='lg'>
          <Typography variant='h4' fontWeight='800'>
            Panel de Administración
          </Typography>
          <Typography variant='subtitle1' sx={{ opacity: 0.7 }}>
            Gestión global de CibESphere
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth='lg' sx={{ mt: -4 }}>
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              px: 2,
              bgcolor: 'white',
              borderBottom: '1px solid #e2e8f0',
              '& .MuiTab-root': { fontWeight: 600, minHeight: 64 }
            }}
          >
            <Tab
              icon={<DashboardIcon />}
              iconPosition='start'
              label='Dashboard'
            />
            <Tab
              icon={<BusinessIcon />}
              iconPosition='start'
              label='Organizaciones'
            />
            <Tab icon={<PeopleIcon />} iconPosition='start' label='Usuarios' />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {currentTab === 0 && <DashboardTab stats={stats} />}
            {currentTab === 1 && <OrganizationsTab />}
            {currentTab === 2 && <UsersTab />}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PanelDeAdministrador
