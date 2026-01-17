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
  CircularProgress,
  IconButton
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { User, Role } from '../../../types'
import * as apiService from '../../../services/apiService'
import { TableSkeleton } from '../../../components/skeletons'

export const UsersTab: React.FC = () => {
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

  if (loading) return <TableSkeleton />

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
            overflow: 'auto'
          }}
        >
          <Table sx={{ minWidth: 550 }}>
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
