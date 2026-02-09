import React from 'react'
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  GppBad as GppBadIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../../types'
import { getStatusChip, getOwner } from './OrganizationUtils'

interface OrganizationsTableProps {
  orgs: OrganizationSummary[]
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    org: OrganizationSummary
  ) => void
}

export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  orgs,
  onMenuOpen
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 700 }}>Organización</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Contacto</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Verificada</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align='right'>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orgs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                <Typography color='text.secondary'>
                  No se encontraron organizaciones
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            orgs.map((org) => {
              const owner = getOwner(org)
              return (
                <TableRow key={org.id} hover>
                  <TableCell>
                    <Stack direction='row' alignItems='center' spacing={2}>
                      <Avatar
                        src={org.logo_url}
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48
                        }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight='600' variant='subtitle1'>
                          {org.name}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                        >
                          @{org.slug}
                        </Typography>

                        {/* Owner Info */}
                        {owner && (
                          <Tooltip
                            title={`Dueño: ${owner.full_name} (${owner.email})`}
                          >
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={0.5}
                              sx={{ mt: 0.5, cursor: 'pointer' }}
                            >
                              <Avatar
                                src={owner.avatar_url}
                                sx={{ width: 16, height: 16 }}
                              >
                                <PersonIcon sx={{ fontSize: 12 }} />
                              </Avatar>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                Managed by <strong>{owner.first_name}</strong>
                              </Typography>
                            </Stack>
                          </Tooltip>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction='row' alignItems='center' spacing={1}>
                      <PersonIcon fontSize='small' color='action' />
                      <Box>
                        <Typography variant='body2' fontWeight='500'>
                          {org.email || 'Sin contacto'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Email Organización
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{getStatusChip(org.status)}</TableCell>
                  <TableCell>
                    {org.is_verified ? (
                      <Tooltip title='Organización Verificada'>
                        <VerifiedIcon color='primary' />
                      </Tooltip>
                    ) : (
                      <Tooltip title='No Verificada'>
                        <GppBadIcon color='disabled' />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton
                      size='small'
                      onClick={(e) => onMenuOpen(e, org)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
