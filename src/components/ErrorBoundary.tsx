import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Typography, Button } from '@mui/material'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='h6' color='error'>
              Algo salió mal
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              {this.state.error?.message}
            </Typography>
            <Button
              variant='outlined'
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Intentar de nuevo
            </Button>
          </Box>
        )
      )
    }

    return this.props.children
  }
}
