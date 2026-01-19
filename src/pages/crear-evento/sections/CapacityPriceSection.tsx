import React from 'react'
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Collapse,
  Button,
  Paper,
  IconButton,
  Typography,
  Box,
  InputAdornment
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { commonInputSx } from '../styles'
import { TicketType } from '../../../types'

interface CapacityPriceSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddTicketType: () => void
  handleRemoveTicketType: (id: string) => void
  handleTicketTypeChange: (
    id: string,
    field: keyof TicketType,
    value: string | number | boolean
  ) => void
}

export const CapacityPriceSection: React.FC<CapacityPriceSectionProps> = ({
  formData,
  handleChange,
  handleAddTicketType,
  handleRemoveTicketType,
  handleTicketTypeChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          name='max_attendees'
          label='Aforo Máximo del Recinto (Global)'
          type='number'
          fullWidth
          variant='filled'
          value={formData.max_attendees}
          onChange={handleChange}
          helperText='Límite físico total. Deja 0 para ilimitado.'
          sx={commonInputSx}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.is_free}
              onChange={handleChange}
              name='is_free'
            />
          }
          label='Evento Gratuito'
        />
      </Grid>

      <Collapse in={!formData.is_free} sx={{ width: '100%' }}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: '#f8fafc',
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Typography variant='subtitle1' fontWeight='bold'>
              Tipos de Entrada (Tiers)
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant='contained'
              size='small'
              onClick={handleAddTicketType}
            >
              Añadir Entrada
            </Button>
          </Box>

          {!formData.ticket_types || formData.ticket_types.length === 0 ? (
            <Typography color='text.secondary' align='center' sx={{ py: 3 }}>
              No has definido tipos de entrada. Añade al menos una (ej:
              General).
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.ticket_types.map((ticket: TicketType) => (
                <Paper
                  key={ticket.id}
                  variant='outlined'
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: 'divider',
                    backgroundColor: '#fff'
                  }}
                >
                  <Grid container spacing={2} alignItems='flex-start'>
                    {/* Fila superior: Nombre, Precio, Stock y Borrar */}
                    <Grid size={{ xs: 12, md: 5 }}>
                      <TextField
                        label='Nombre de Entrada'
                        variant='outlined'
                        size='small'
                        fullWidth
                        value={ticket.name}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            ticket.id,
                            'name',
                            e.target.value
                          )
                        }
                        disabled={ticket.sold > 0}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <TextField
                        label='Precio'
                        type='number'
                        variant='outlined'
                        size='small'
                        fullWidth
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            ticket.id,
                            'price',
                            Number(e.target.value)
                          )
                        }
                        disabled={ticket.sold > 0}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>€</InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <TextField
                        label='Stock'
                        type='number'
                        variant='outlined'
                        size='small'
                        fullWidth
                        value={ticket.capacity}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            ticket.id,
                            'capacity',
                            Number(e.target.value)
                          )
                        }
                        helperText={
                          ticket.sold > 0 ? `Vendidos: ${ticket.sold}` : ''
                        }
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12, md: 1 }}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <IconButton
                        color='error'
                        onClick={() => handleRemoveTicketType(ticket.id)}
                        disabled={ticket.sold > 0}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>

                    {/* Fila inferior: Descripción completa */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label='Descripción / Beneficios'
                        variant='outlined'
                        size='small'
                        fullWidth
                        multiline
                        rows={2}
                        placeholder='Incluye acceso a...'
                        value={ticket.description || ''}
                        onChange={(e) =>
                          handleTicketTypeChange(
                            ticket.id,
                            'description',
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Grid>
  )
}
