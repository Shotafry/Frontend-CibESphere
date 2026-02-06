// src/components/social/FollowButton.tsx
// v0.4.0 - Botón para seguir/dejar de seguir organizaciones

import { useState, useEffect } from 'react'
import { Button, CircularProgress, Tooltip, ButtonProps } from '@mui/material'
import {
  PersonAdd as FollowIcon,
  PersonRemove as UnfollowIcon,
  CheckCircle as FollowingIcon
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import {
  isFollowingOrganization,
  toggleFollowOrganization
} from '../../services/api/subscriptions.service'

interface FollowButtonProps extends Omit<ButtonProps, 'onClick'> {
  organizationId: string
  organizationName?: string
  showLabel?: boolean
  onFollowChange?: (isFollowing: boolean) => void
  ownerId?: string
}

export const FollowButton = ({
  organizationId,
  organizationName = 'esta organización',
  showLabel = true,
  onFollowChange,
  ownerId,
  ...buttonProps
}: FollowButtonProps) => {
  const { user, isAuthenticated } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Verificar estado inicial
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false)
        return
      }

      try {
        const following = await isFollowingOrganization(organizationId)
        setIsFollowing(following)
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkFollowStatus()
  }, [organizationId, isAuthenticated, user])

  const handleClick = async () => {
    if (!isAuthenticated) {
      console.info('Inicia sesión para seguir organizaciones')
      return
    }

    setActionLoading(true)
    try {
      const result = await toggleFollowOrganization(organizationId, isFollowing)
      setIsFollowing(result.isFollowing)
      onFollowChange?.(result.isFollowing)
    } catch (error) {
      console.error('Error al actualizar seguimiento:', error)
    } finally {
      setActionLoading(false)
    }
  }

  // Si el usuario es el propietario o pertenece a la organización, no mostrar el botón
  const isOwnOrganization =
    (user && ownerId && user.id === ownerId) ||
    (user && user.organization?.id === organizationId)

  if (isOwnOrganization) {
    return null
  }

  if (loading) {
    return (
      <Button disabled {...buttonProps}>
        <CircularProgress size={20} />
      </Button>
    )
  }

  const buttonLabel = isFollowing ? 'Siguiendo' : 'Seguir'
  const ButtonIcon = isFollowing ? FollowingIcon : FollowIcon

  return (
    <Tooltip title={isFollowing ? 'Dejar de seguir' : 'Seguir organización'}>
      <Button
        variant='contained'
        onClick={handleClick}
        disabled={actionLoading}
        startIcon={
          actionLoading ? (
            <CircularProgress size={16} sx={{ color: 'inherit' }} />
          ) : (
            <ButtonIcon />
          )
        }
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          px: 2.5,
          py: 1,
          minWidth: 'auto',
          boxShadow: isFollowing ? 'none' : '0 4px 14px rgba(0, 217, 255, 0.4)',
          background: isFollowing
            ? 'transparent'
            : 'var(--gradient-button-primary)',
          color: isFollowing ? 'var(--color-cadetblue)' : 'var(--White)',
          border: isFollowing ? '2px solid var(--color-cadetblue)' : 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: isFollowing
              ? 'none'
              : '0 6px 20px rgba(0, 217, 255, 0.6)',
            background: isFollowing
              ? 'rgba(239, 68, 68, 0.1)'
              : 'var(--gradient-button-primary-hover)',
            borderColor: isFollowing ? '#EF4444' : undefined,
            color: isFollowing ? '#EF4444' : 'var(--White)'
          }
        }}
        {...buttonProps}
      >
        {showLabel && buttonLabel}
      </Button>
    </Tooltip>
  )
}

export default FollowButton
