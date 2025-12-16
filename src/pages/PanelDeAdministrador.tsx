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
  Alert,
  Fade
} from '@mui/material'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
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

const StatCard: React.FC<{
  title: string
  value: number
  icon: React.ReactElement
  color: string
}> = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '20px',
      background: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 10px 30px -10px ${color}40`,
        borderColor: color
      }
    }}
  >
    <Box
      sx={{
        p: 1.5,
        borderRadius: '16px',
        bgcolor: `${color}15`,
        color: color,
        display: 'flex'
      }}
    >
      {React.cloneElement(icon as React.ReactElement<any>, {
        fontSize: 'large'
      })}
    </Box>
    <Box>
      <Typography variant='h4' fontWeight='800' sx={{ color: '#1e293b' }}>
        {value}
      </Typography>
      <Typography variant='body2' fontWeight='600' color='text.secondary'>
        {title}
      </Typography>
    </Box>
  </Paper>
)

const DashboardTab: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
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
    <Fade in timeout={500}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant='h6' fontWeight='bold'>
            Gestión de Organizaciones
          </Typography>
          <Chip label={`${orgs.length} Registradas`} size='small' />
        </Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Organización</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ubicación</TableCell>
                <TableCell align='center' sx={{ fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orgs.map((org) => (
                <TableRow
                  key={org.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar
                        src={org.logo_url}
                        variant='rounded'
                        sx={{
                          bgcolor: 'white',
                          border: '1px solid #e2e8f0',
                          color: 'var(--color-cadetblue)'
                        }}
                      >
                        {org.name[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight='bold' variant='body2'>
                          {org.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {org.email || 'Sin contacto'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{org.city}</TableCell>
                  <TableCell align='center'>
                    {org.is_verified ? (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                        label='Verificada'
                        color='success'
                        size='small'
                        sx={{
                          bgcolor: '#dcfce7',
                          color: '#166534',
                          border: 'none',
                          fontWeight: 600
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<GppBadIcon sx={{ fontSize: 16 }} />}
                        label='Pendiente'
                        color='warning'
                        size='small'
                        sx={{
                          bgcolor: '#fef3c7',
                          color: '#92400e',
                          border: 'none',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align='right'>
                    {!org.is_verified && (
                      <Button
                        variant="primary"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVerify(org.id)}
                      >
                        Aprobar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {orgs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align='center' sx={{ py: 8 }}>
                    <Typography color='text.secondary'>
                      No hay organizaciones registradas.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
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
    if (
      window.confirm(
        '¿Estás seguro de eliminar este usuario? Esta acción es irreversible.'
      )
    ) {
      await apiService.deleteUser(userId)
      loadUsers()
    }
  }

  if (loading) return <CircularProgress />

  return (
    <Fade in timeout={500}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant='h6' fontWeight='bold'>
            Directorio de Usuarios
          </Typography>
          <Chip label={`${users.length} Usuarios`} size='small' />
        </Box>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Registro</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar
                        src={user.avatar_url}
                        sx={{
                          bgcolor: 'var(--color-cadetblue)',
                          width: 36,
                          height: 36,
                          fontSize: '0.9rem'
                        }}
                      >
                        {user.first_name[0]}
                      </Avatar>
                      <Box>
                        <Typography fontWeight='bold' variant='body2'>
                          {user.full_name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {user.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.role === Role.Admin
                          ? 'Administrador'
                          : user.role === Role.Organizer
                            ? 'Organizador'
                            : 'Asistente'
                      }
                      size='small'
                      sx={{
                        bgcolor:
                          user.role === Role.Admin
                            ? '#fce7f3'
                            : user.role === Role.Organizer
                              ? '#dbeafe'
                              : '#f1f5f9',
                        color:
                          user.role === Role.Admin
                            ? '#be185d'
                            : user.role === Role.Organizer
                              ? '#1d4ed8'
                              : '#475569',
                        fontWeight: 600,
                        border: 'none'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton
                      size='small'
                      sx={{
                        color: '#ef4444',
                        '&:hover': { bgcolor: '#fee2e2' }
                      }}
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  )
}

const PanelDeAdministrador: React.FC = () => {
  const { stats } = useLoaderData() as AdminLoaderData
  const [currentTab, setCurrentTab] = useState(0)

  // Efecto "fade" simple al cambiar tabs
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
      {/* Header Premium */}
      <Box
        sx={{
          background: 'var(--gradient-header-footer)',
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 10, md: 12 },
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
          mb: 6,
          position: 'relative'
        }}
      >
        <Container maxWidth='xl'>
          <Stack direction='row' alignItems='center' spacing={2} mb={2}>
            <VerifiedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            <Typography
              variant='h3'
              fontWeight='900'
              sx={{ textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              Panel de Control
            </Typography>
          </Stack>
          <Typography
            variant='h6'
            sx={{ opacity: 0.9, maxWidth: '600px', fontWeight: 400 }}
          >
            Bienvenido, Administrador. Aquí tienes el control total sobre
            usuarios, organizaciones y eventos de CibESphere.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth='xl' sx={{ mt: -10 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            bgcolor: 'white',
            minHeight: '600px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            position: 'relative', // Fix overlap
            zIndex: 100 // Ensure it sits above the Hero
          }}
        >
          {/* Sidebar Navigation (Desktop) / Tabs (Mobile) */}
          <Box
            sx={{
              width: { xs: '100%', md: 280 },
              borderRight: { xs: 'none', md: '1px solid #f1f5f9' },
              borderBottom: { xs: '1px solid #f1f5f9', md: 'none' },
              bgcolor: '#fff',
              p: 2
            }}
          >
            <Typography
              variant='overline'
              fontWeight='bold'
              sx={{ px: 2, color: 'text.secondary', letterSpacing: 1 }}
            >
              Menu
            </Typography>
            <Tabs
              orientation={window.innerWidth >= 900 ? 'vertical' : 'horizontal'}
              value={currentTab}
              onChange={handleTabChange}
              variant='scrollable'
              scrollButtons={false}
              sx={{
                mt: 2,
                '& .MuiTab-root': {
                  justifyContent: 'flex-start',
                  minHeight: 48,
                  borderRadius: '12px',
                  mb: 1,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    color: 'var(--color-cadetblue)'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'var(--color-cadetblue)',
                    color: 'white'
                  }
                },
                '& .MuiTabs-indicator': {
                  display: 'none' // Hide default indicator for "button" look
                }
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
              <Tab
                icon={<PeopleIcon />}
                iconPosition='start'
                label='Usuarios'
              />
            </Tabs>
          </Box>

          {/* Tab Content Area */}
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, bgcolor: '#fff' }}>
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
