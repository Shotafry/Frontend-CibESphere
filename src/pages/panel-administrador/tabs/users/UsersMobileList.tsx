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
  Verified as VerifiedIcon
} from '@mui/icons-material'
import { User } from '../../../../types'
import { getRoleBadge, getStatusBadge } from './UserUtils'

interface UsersMobileListProps {
  users: User[]
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, user: User) => void
}

export const UsersMobileList: React.FC<UsersMobileListProps> = ({
  users,
  onMenuOpen
}) => {
  return (
    <Stack spacing={2}>
      {users.map((user) => (
        <Card key={user.id} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='flex-start'
              mb={2}
            >
              <Stack direction='row' spacing={2} alignItems='center'>
                <Avatar
                  src={user.avatar_url}
                  sx={{
                    bgcolor: '#3b82f6',
                    width: 40,
                    height: 40
                  }}
                >
                  {user.first_name?.[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Stack direction='row' spacing={0.5} alignItems='center'>
                    <Typography fontWeight='600' variant='subtitle1'>
                      {user.full_name}
                    </Typography>
                    {user.is_verified && (
                      <VerifiedIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                    )}
                  </Stack>
                  <Typography variant='body2' color='text.secondary'>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
              <IconButton size='small' onClick={(e) => onMenuOpen(e, user)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box display='flex' gap={1}>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.is_active)}
              </Box>
              <Typography variant='caption' color='text.secondary'>
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
      {users.length === 0 && (
        <Typography textAlign='center' color='text.secondary' py={4}>
          No se encontraron usuarios
        </Typography>
      )}
    </Stack>
  )
}
