import { FunctionComponent } from 'react'
import { Button as MuiButton, ButtonProps } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'

export type ButtonVariant = 'primary' | 'secondary'

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: ButtonVariant
}

export const Button: FunctionComponent<CustomButtonProps> = ({
    variant = 'primary',
    children,
    sx = {},
    ...props
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
                '&:hover': !isMobile ? {
                    background: 'white',
                    color: 'var(--color-cadetblue)',
                    border: '1px solid var(--color-cadetblue)'
                } : {}
            }
        }

        if (variant === 'secondary') {
            return {
                ...baseStyles,
                background: 'white',
                color: 'var(--color-cadetblue)',
                border: '1px solid var(--color-cadetblue)',
                '&:hover': !isMobile ? {
                    background: 'var(--gradient-button-primary)',
                    color: 'var(--White)',
                    borderColor: 'transparent'
                } : {}
            }
        }

        return baseStyles
    }

    return (
        <MuiButton
            variant={variant === 'primary' ? 'contained' : 'outlined'}
            sx={{ ...getStyles(), ...sx }}
            {...props}
        >
            {children}
        </MuiButton>
    )
}