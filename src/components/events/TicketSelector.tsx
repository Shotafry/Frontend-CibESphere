import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  IconButton,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Event } from '../../types'
import { purchaseEvent, PurchaseItem } from '../../services/api/events.service'

interface Props {
  open: boolean
  onClose: () => void
  event: Event
}

export const TicketSelector: React.FC<Props> = ({ open, onClose, event }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuantityChange = (ticketId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0
      const newVal = Math.max(0, Math.min(10, current + delta)) // Max 10 per type
      return { ...prev, [ticketId]: newVal }
    })
  }

  const getTotal = () => {
    let total = 0
    event.ticket_types?.forEach((tt) => {
      const qty = quantities[tt.id] || 0
      total += (tt.price || 0) * qty // price in cents
    })
    return total
  }

  const handleBuy = async () => {
    setLoading(true)
    setError(null)
    try {
      const items: PurchaseItem[] = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => ({ ticket_type_id: id, quantity: qty }))

      if (items.length === 0) return

      const response = await purchaseEvent(event.id, items)

      // Redirect to Stripe
      window.location.href = response.url
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Error iniciando compra'
      )
      setLoading(false)
    }
  }

  const totalCents = getTotal()
  const hasItems = Object.values(quantities).some((q) => q > 0)

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>Selecciona tus entradas</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!event.ticket_types || event.ticket_types.length === 0 ? (
          <Alert severity='info'>No hay tipos de entradas disponibles.</Alert>
        ) : (
          <List>
            {event.ticket_types.map((tt) => {
              const qty = quantities[tt.id] || 0
              const soldOut = tt.sold >= tt.capacity

              return (
                <React.Fragment key={tt.id}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      py: 2
                    }}
                  >
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      width='100%'
                      mb={1}
                    >
                      <Box>
                        <Typography variant='h6'>{tt.name}</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {tt.description}
                        </Typography>
                      </Box>
                      <Typography variant='h6' color='primary'>
                        {(tt.price / 100).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </Typography>
                    </Box>

                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                      bgcolor='background.default'
                      p={1}
                      borderRadius={2}
                    >
                      <Typography
                        variant='caption'
                        color={soldOut ? 'error' : 'textSecondary'}
                      >
                        {soldOut
                          ? 'AGOTADO'
                          : `${tt.capacity - tt.sold} disponibles`}
                      </Typography>
                      <Box display='flex' alignItems='center'>
                        <IconButton
                          size='small'
                          onClick={() => handleQuantityChange(tt.id, -1)}
                          disabled={qty === 0 || loading}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography mx={2} fontWeight='bold'>
                          {qty}
                        </Typography>
                        <IconButton
                          size='small'
                          onClick={() => handleQuantityChange(tt.id, 1)}
                          disabled={
                            soldOut ||
                            loading ||
                            qty >= 10 ||
                            tt.sold + qty >= tt.capacity
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider component='li' />
                </React.Fragment>
              )
            })}
          </List>
        )}

        <Box
          mt={2}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
        >
          <Typography variant='h5' fontWeight='bold'>
            Total:{' '}
            {(totalCents / 100).toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR'
            })}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading} color='inherit'>
          Cancelar
        </Button>
        <Button
          onClick={handleBuy}
          variant='contained'
          disabled={!hasItems || loading}
          startIcon={
            loading ? <CircularProgress size={20} color='inherit' /> : null
          }
        >
          {loading ? 'Procesando...' : 'Ir al Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
