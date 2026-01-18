import React from 'react'
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Collapse,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
              variant='outlined'
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
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: '1px solid #e0e0e0' }}
            >
              <Table size='small'>
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell width='30%'>Nombre</TableCell>
                    <TableCell width='20%'>Precio (€)</TableCell>
                    <TableCell width='20%'>Stock</TableCell>
                    <TableCell width='30%'>Descripción</TableCell>
                    <TableCell width='5%'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.ticket_types.map((ticket: TicketType) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <TextField
                          variant='standard'
                          placeholder='Ej: General'
                          fullWidth
                          value={ticket.name}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              ticket.id,
                              'name',
                              e.target.value
                            )
                          }
                          disabled={ticket.sold > 0} // Bloquear nombre si ya hay ventas (opcional, usuario pidió bloquear precio)
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type='number'
                          variant='standard'
                          fullWidth
                          value={ticket.price}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              ticket.id,
                              'price',
                              Number(e.target.value)
                            )
                          }
                          disabled={ticket.sold > 0} // CRÍTICO: Bloquear precio si hay ventas
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                €
                              </InputAdornment>
                            )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type='number'
                          variant='standard'
                          fullWidth
                          value={ticket.capacity}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              ticket.id,
                              'capacity',
                              Number(e.target.value)
                            )
                          }
                          helperText={`Vendidos: ${ticket.sold}`}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          variant='standard'
                          placeholder='Info adicional...'
                          fullWidth
                          value={ticket.description || ''}
                          onChange={(e) =>
                            handleTicketTypeChange(
                              ticket.id,
                              'description',
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleRemoveTicketType(ticket.id)}
                          disabled={ticket.sold > 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Collapse>
    </Grid>
  )
}
