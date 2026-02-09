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
  IconButton
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'
import { User } from '../../../../types'
import { getRoleBadge, getStatusBadge } from './UserUtils'

interface UsersTableProps {
  users: User[]
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, user: User) => void
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onMenuOpen
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
              Usuario
            </TableCell>
            <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
              Rol
            </TableCell>
            <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
              Estado
            </TableCell>
            <TableCell sx={{ fontWeight: '700', color: '#475569' }}>
              Registro
            </TableCell>
            <TableCell
              align='right'
              sx={{ fontWeight: '700', color: '#475569' }}
            >
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
                      bgcolor: '#3b82f6',
                      width: 40,
                      height: 40,
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {user.first_name?.[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                      <Typography
                        fontWeight='600'
                        variant='body2'
                        color='#1e293b'
                      >
                        {user.full_name}
                      </Typography>
                      {user.is_verified && (
                        <VerifiedIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                      )}
                    </Stack>
                    <Typography variant='caption' color='#64748b'>
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.is_active)}</TableCell>
              <TableCell>
                <Typography variant='body2' color='#475569'>
                  {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell align='right'>
                <IconButton size='small' onClick={(e) => onMenuOpen(e, user)}>
                  <MoreVertIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 8 }}>
                <Typography color='text.secondary'>
                  No se encontraron usuarios
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
