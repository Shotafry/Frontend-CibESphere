import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Chip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Avatar,
  Fade,
  CircularProgress
} from '@mui/material'
import {
  Verified as VerifiedIcon,
  GppBad as GppBadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../types'
import * as apiService from '../../../services/apiService'
import { Button } from '../../../components/Button'

export const OrganizationsTab: React.FC = () => {
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
            overflow: 'auto'
          }}
        >
          <Table sx={{ minWidth: 600 }}>
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
                        variant='primary'
                        size='small'
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
