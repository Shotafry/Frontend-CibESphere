import React from 'react'
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { OrganizationSummary } from '../../../../types'
import { getStatusChip, getOwner } from './OrganizationUtils'

interface OrganizationsMobileListProps {
  orgs: OrganizationSummary[]
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    org: OrganizationSummary
  ) => void
}

export const OrganizationsMobileList: React.FC<
  OrganizationsMobileListProps
> = ({ orgs, onMenuOpen }) => {
  return (
    <Stack spacing={2}>
      {orgs.map((org) => {
        const owner = getOwner(org)
        return (
          <Card key={org.id} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='flex-start'
                mb={2}
              >
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Avatar
                    src={org.logo_url}
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <Typography fontWeight='600' variant='subtitle1'>
                        {org.name}
                      </Typography>
                      {org.is_verified && (
                        <VerifiedIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                      )}
                    </Stack>
                    <Typography variant='body2' color='text.secondary'>
                      @{org.slug}
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size='small' onClick={(e) => onMenuOpen(e, org)}>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1}>
                {/* Owner Info */}
                {owner && (
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <PersonIcon
                      fontSize='small'
                      sx={{ color: 'text.secondary', fontSize: 16 }}
                    />
                    <Typography variant='body2'>
                      Dueño: <strong>{owner.full_name}</strong>
                    </Typography>
                  </Stack>
                )}

                {/* Contact Email */}
                <Stack direction='row' spacing={1} alignItems='center'>
                  <Box
                    component='span'
                    sx={{
                      color: 'text.secondary',
                      fontSize: 16,
                      display: 'flex'
                    }}
                  >
                    @
                  </Box>
                  <Typography variant='body2'>
                    {org.email || 'Sin contacto'}
                  </Typography>
                </Stack>
              </Stack>

              <Box mt={2} display='flex' justifyContent='flex-end'>
                {getStatusChip(org.status)}
              </Box>
            </CardContent>
          </Card>
        )
      })}
      {orgs.length === 0 && (
        <Typography textAlign='center' color='text.secondary' py={4}>
          No se encontraron organizaciones
        </Typography>
      )}
    </Stack>
  )
}
