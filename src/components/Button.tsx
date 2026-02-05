import { FunctionComponent } from 'react'
import { Button as MuiButton } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'
import { Link } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'secondary' | 'text'

/*
  🔥 ESTILOS DE BOTONES (LA LEY) 🔥
  
  Variant "primary":
  - Normal: Fondo CIAN (Gradient), Texto BLANCO.
  - Hover: Fondo BLANCO, Texto CIAN, Borde CIAN.
  
  Variant "secondary":
  - Normal: Fondo BLANCO, Texto CIAN, Borde CIAN.
  - Hover: Fondo CIAN (Gradient), Texto BLANCO, Borde Transparente.

  NO MODIFICAR ESTE COMPORTAMIENTO. ES LA IDENTIDAD VISUAL DEL PROYECTO.
*/

interface CustomButtonProps {
  variant?: ButtonVariant
  children: React.ReactNode
  sx?: object
  to?: string
  href?: string
  target?: string
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const Button: FunctionComponent<CustomButtonProps> = ({
  variant = 'primary',
  children,
  sx = {},
  to,
  href,
  target,
  onClick,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  startIcon,
  endIcon
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      fontWeight: 600,
      textTransform: 'none' as const,
      transition: 'all 0.3s ease'
    }

    if (variant === 'primary') {
      return {
        ...baseStyles,
        background: 'var(--gradient-button-primary)',
        color: 'var(--White)',
        border: 'none',
        '&:hover': !isMobile
          ? {
              background: 'white',
              color: 'var(--color-cadetblue)',
              border: '1px solid var(--color-cadetblue)'
            }
          : {}
      }
    }

    if (variant === 'secondary') {
      return {
        ...baseStyles,
        background: 'white',
        color: 'var(--color-cadetblue)',
        border: '1px solid var(--color-cadetblue)',
        '&:hover': !isMobile
          ? {
              background: 'var(--gradient-button-primary)',
              color: 'var(--White)',
              borderColor: 'transparent'
            }
          : {}
      }
    }

    if (variant === 'text') {
      return {
        ...baseStyles,
        background: 'transparent',
        color: 'var(--color-cadetblue)', // Texto Cian
        border: '1px solid transparent', // Reserva espacio o simplemente sin borde
        padding: '6px 16px', // Un poco más compacto
        '&:hover': !isMobile
          ? {
              background: 'var(--gradient-button-primary)', // Fondo Cian al hover
              color: 'var(--White)', // Texto Blanco
              borderColor: 'transparent'
            }
          : {}
      }
    }

    return baseStyles
  }

  const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
    if (variant === 'primary') return 'contained'
    if (variant === 'secondary') return 'outlined'
    return 'text'
  }

  const commonProps = {
    variant: getMuiVariant(),
    sx: { ...getStyles(), ...sx },
    size,
    fullWidth,
    disabled,
    type,
    startIcon,
    endIcon,
    href,
    target
  }

  if (to) {
    return (
      <MuiButton {...commonProps} component={Link} to={to}>
        {children}
      </MuiButton>
    )
  }

  return (
    <MuiButton {...commonProps} onClick={onClick}>
      {children}
    </MuiButton>
  )
}
