// src/pages/panel-usuario/tabs/TicketsTab.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DownloadIcon from '@mui/icons-material/Download'
import QrCodeIcon from '@mui/icons-material/QrCode'
import EmailIcon from '@mui/icons-material/Email'
import { useNavigate } from 'react-router-dom'
import { httpClient } from '../../../services/httpClient'

interface UserTicket {
  id: string
  event_id: string
  event_title: string
  event_slug: string
  event_start_date: string
  event_image?: string
  venue_address?: string
  is_online: boolean
  ticket_type: string
  ticket_price: number
  qr_code_url?: string
  ticket_image_url?: string
  checked_in: boolean
  status: string
  created_at: string
}

interface TicketsResponse {
  tickets: UserTicket[]
  total: number
}

export const TicketsTab: React.FC = () => {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const fetchTickets = async () => {
    try {
      setLoading(true)
      // Placeholder endpoint - backend needs to implement this
      const response = await httpClient.get<TicketsResponse>('/user/tickets')
      setTickets(response.data?.tickets || [])
    } catch (err: any) {
      // If endpoint doesn't exist yet, show empty state gracefully
      console.log('Tickets endpoint not yet implemented:', err)
      setTickets([])
      setError(null) // Don't show error for missing endpoint
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async (ticketId: string) => {
    setResending(ticketId)
    try {
      await httpClient.post(`/tickets/${ticketId}/resend-email`)
      setSnackbar({
        open: true,
        message: '¡Entrada enviada a tu correo!',
        severity: 'success'
      })
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: 'Error al reenviar. Inténtalo de nuevo.',
        severity: 'error'
      })
    } finally {
      setResending(null)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Gratis'
    return `${(cents / 100).toFixed(2)}€`
  }

  if (loading) {
    return (
      <Box>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{ mb: 3, color: 'var(--Gray-800)' }}
        >
          🎫 Mis Entradas
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton
                variant='rounded'
                height={280}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color='error'>{error}</Typography>
        <Button variant='outlined' onClick={fetchTickets} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    )
  }

  if (tickets.length === 0) {
    return (
      <Box>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{ mb: 3, color: 'var(--Gray-800)' }}
        >
          🎫 Mis Entradas
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed #CBD5E1'
          }}
        >
          <ConfirmationNumberIcon
            sx={{ fontSize: 64, color: '#94A3B8', mb: 2 }}
          />
          <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
            No tienes entradas todavía
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Cuando compres entradas para eventos, aparecerán aquí
          </Typography>
          <Button
            variant='contained'
            onClick={() => navigate('/eventos')}
            sx={{
              bgcolor: 'var(--color-cadetblue)',
              '&:hover': { bgcolor: '#3a8e99' }
            }}
          >
            Explorar Eventos
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box>
      <Typography
        variant='h5'
        fontWeight='bold'
        sx={{ mb: 3, color: 'var(--Gray-800)' }}
      >
        🎫 Mis Entradas ({tickets.length})
      </Typography>

      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid item xs={12} md={6} key={ticket.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {/* Ticket Image / QR */}
              <Box
                sx={{
                  position: 'relative',
                  bgcolor: '#1E293B',
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {ticket.ticket_image_url ? (
                  <CardMedia
                    component='img'
                    height='140'
                    image={ticket.ticket_image_url}
                    alt='Ticket'
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                ) : ticket.qr_code_url ? (
                  <Box
                    component='img'
                    src={ticket.qr_code_url}
                    alt='QR Code'
                    sx={{
                      height: 120,
                      width: 120,
                      bgcolor: '#FFF',
                      p: 1,
                      borderRadius: 2
                    }}
                  />
                ) : (
                  <QrCodeIcon sx={{ fontSize: 80, color: '#64748B' }} />
                )}

                {/* Status Badge */}
                <Chip
                  label={ticket.checked_in ? '✓ Check-in' : 'Válida'}
                  size='small'
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: ticket.checked_in ? '#22C55E' : '#0EA5E9',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              </Box>

              <CardContent sx={{ pb: 1 }}>
                {/* Event Title */}
                <Typography
                  variant='h6'
                  fontWeight='bold'
                  sx={{
                    cursor: 'pointer',
                    color: 'var(--Gray-800)',
                    '&:hover': { color: 'var(--color-cadetblue)' },
                    mb: 1.5
                  }}
                  onClick={() => navigate(`/eventos/${ticket.event_slug}`)}
                >
                  {ticket.event_title}
                </Typography>

                {/* Date */}
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <CalendarTodayIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    {formatDate(ticket.event_start_date)}
                  </Typography>
                </Box>

                {/* Location */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1.5
                  }}
                >
                  <LocationOnIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant='body2' color='text.secondary'>
                    {ticket.is_online
                      ? 'Evento Online'
                      : ticket.venue_address || 'Por confirmar'}
                  </Typography>
                </Box>

                {/* Ticket Type & Price */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={ticket.ticket_type}
                    size='small'
                    sx={{
                      bgcolor: '#DBEAFE',
                      color: '#1D4ED8',
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography variant='body2' fontWeight='bold' color='primary'>
                    {formatPrice(ticket.ticket_price)}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions
                sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}
              >
                {ticket.ticket_image_url && (
                  <Button
                    size='small'
                    variant='outlined'
                    startIcon={<DownloadIcon />}
                    href={ticket.ticket_image_url}
                    download
                    sx={{
                      borderColor: '#E2E8F0',
                      color: 'text.secondary',
                      '&:hover': { borderColor: 'var(--color-cadetblue)' }
                    }}
                  >
                    Descargar
                  </Button>
                )}
                <Button
                  size='small'
                  variant='outlined'
                  startIcon={
                    resending === ticket.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <EmailIcon />
                    )
                  }
                  onClick={() => handleResendEmail(ticket.id)}
                  disabled={resending === ticket.id}
                  sx={{
                    borderColor: '#E2E8F0',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'var(--color-cadetblue)' }
                  }}
                >
                  {resending === ticket.id ? 'Enviando...' : 'Reenviar'}
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  onClick={() => navigate(`/eventos/${ticket.event_slug}`)}
                  sx={{
                    bgcolor: 'var(--color-cadetblue)',
                    '&:hover': { bgcolor: '#3a8e99' }
                  }}
                >
                  Ver Evento
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
