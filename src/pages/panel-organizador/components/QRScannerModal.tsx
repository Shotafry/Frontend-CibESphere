// src/pages/panel-organizador/components/QRScannerModal.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider
} from '@mui/material'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import CloseIcon from '@mui/icons-material/Close'
import { Html5QrcodeScanner } from 'html5-qrcode'
import {
  attendeeService,
  ValidateTicketResponse
} from '../../../services/api/attendee.service'

interface QRScannerModalProps {
  open: boolean
  onClose: () => void
  eventId?: string // Optional: if provided, validates for specific event
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  open,
  onClose,
  eventId
}) => {
  const [scanning, setScanning] = useState(false)
  const [validating, setValidating] = useState(false)
  const [result, setResult] = useState<ValidateTicketResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const containerId = 'qr-reader'

  // Initialize scanner when modal opens
  useEffect(() => {
    if (open && !scannerRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initScanner()
      }, 500)
      return () => clearTimeout(timer)
    }

    return () => {
      stopScanner()
    }
  }, [open])

  const initScanner = () => {
    try {
      scannerRef.current = new Html5QrcodeScanner(
        containerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        },
        false // verbose
      )

      scannerRef.current.render(
        (decodedText) => {
          handleScan(decodedText)
        },
        (errorMessage) => {
          // Silently handle scan errors (continuous scanning)
          console.debug('QR Scan attempt:', errorMessage)
        }
      )
      setScanning(true)
      setError(null)
    } catch (err) {
      console.error('Failed to initialize scanner:', err)
      setError('No se pudo inicializar la cámara. Verifica los permisos.')
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
      } catch (e) {
        console.log('Scanner cleanup:', e)
      }
      scannerRef.current = null
      setScanning(false)
    }
  }

  const handleScan = async (qrData: string) => {
    if (validating) return // Prevent multiple validations

    // Stop scanning while validating
    stopScanner()
    setValidating(true)
    setResult(null)
    setError(null)

    try {
      const response = await attendeeService.validateTicket(qrData, true)
      setResult(response)
    } catch (err: any) {
      console.error('Validation error:', err)
      setError(err.message || 'Error al validar el ticket')
    } finally {
      setValidating(false)
    }
  }

  const handleScanAgain = () => {
    setResult(null)
    setError(null)
    initScanner()
  }

  const handleClose = () => {
    stopScanner()
    setResult(null)
    setError(null)
    onClose()
  }

  const renderResult = () => {
    if (!result) return null

    if (!result.valid) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant='h6' color='error' gutterBottom>
            Ticket Inválido
          </Typography>
          <Typography color='text.secondary'>{result.message}</Typography>
        </Box>
      )
    }

    if (result.already_used) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant='h6' color='warning.main' gutterBottom>
            Ticket Ya Usado
          </Typography>
          <Typography color='text.secondary' sx={{ mb: 2 }}>
            Este ticket ya fue utilizado anteriormente
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'left', px: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Evento:
            </Typography>
            <Typography variant='body1' fontWeight='bold' sx={{ mb: 1 }}>
              {result.event_title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Asistente:
            </Typography>
            <Typography variant='body1' fontWeight='bold' sx={{ mb: 1 }}>
              {result.user_name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tipo de entrada:
            </Typography>
            <Chip label={result.ticket_type} size='small' sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      )
    }

    // Valid and checked in
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography
          variant='h5'
          color='success.main'
          fontWeight='bold'
          gutterBottom
        >
          ✅ Check-in Exitoso
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'left', px: 2 }}>
          <Typography variant='body2' color='text.secondary'>
            Evento:
          </Typography>
          <Typography variant='body1' fontWeight='bold' sx={{ mb: 1 }}>
            {result.event_title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Asistente:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'var(--color-cadetblue)',
                fontSize: '0.8rem'
              }}
            >
              {result.user_name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant='body1' fontWeight='bold'>
              {result.user_name}
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            Tipo de entrada:
          </Typography>
          <Chip
            label={result.ticket_type}
            size='small'
            sx={{
              mt: 0.5,
              bgcolor: '#DBEAFE',
              color: '#1D4ED8',
              fontWeight: 'bold'
            }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'white', // Ensure light background
          color: 'text.primary'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        <QrCodeScannerIcon sx={{ color: 'var(--color-cadetblue)' }} />
        <Typography variant='h6' fontWeight='bold'>
          Escanear Entrada
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Scanner container */}
        {!result && !validating && (
          <Box
            id={containerId}
            sx={{
              width: '100%',
              minHeight: 300,
              bgcolor: '#F1F5F9', // Light gray placeholder
              borderRadius: 2,
              overflow: 'hidden',
              '& video': {
                borderRadius: 2,
                objectFit: 'cover'
              },
              '& #qr-shaded-region': {
                borderColor: 'var(--color-cadetblue) !important', // Custom scanning box color
                opacity: 0.8
              }
            }}
          />
        )}

        {/* Validating state */}
        {validating && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress
              size={48}
              sx={{ color: 'var(--color-cadetblue)', mb: 2 }}
            />
            <Typography color='text.secondary'>Validando ticket...</Typography>
          </Box>
        )}

        {/* Result display */}
        {result && renderResult()}

        {/* Instructions */}
        {scanning && !result && !validating && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mt: 2, textAlign: 'center' }}
          >
            Apunta la cámara al código QR de la entrada
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3, borderTop: '1px solid #E2E8F0', pt: 2 }}
      >
        {result ? (
          <>
            <Button
              variant='outlined'
              onClick={handleScanAgain}
              sx={{
                borderColor: 'var(--color-cadetblue)',
                color: 'var(--color-cadetblue)',
                '&:hover': { borderColor: '#3a8e99', bgcolor: '#F0FDFA' }
              }}
            >
              Escanear Otra
            </Button>
            <Button
              variant='contained'
              onClick={handleClose}
              sx={{
                bgcolor: 'var(--color-cadetblue)',
                '&:hover': { bgcolor: '#3a8e99' }
              }}
            >
              Cerrar
            </Button>
          </>
        ) : (
          <Button
            variant='outlined'
            onClick={handleClose}
            startIcon={<CloseIcon />}
            color='inherit' // Use inherit to pick up theme or default
            sx={{
              color: 'var(--Gray-600)',
              borderColor: 'var(--Gray-300)',
              '&:hover': {
                bgcolor: 'var(--Gray-100)',
                borderColor: 'var(--Gray-400)'
              }
            }}
          >
            Cancelar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
