import React from 'react'
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Collapse
} from '@mui/material'
import { commonInputSx } from '../styles'

interface CapacityPriceSectionProps {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const CapacityPriceSection: React.FC<CapacityPriceSectionProps> = ({
  formData,
  handleChange
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          name='max_attendees'
          label='Límite de Asistentes'
          type='number'
          fullWidth
          variant='filled'
          value={formData.max_attendees}
          onChange={handleChange}
          helperText='Dejar en 0 para aforo ilimitado'
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
      <Collapse in={!formData.is_free} sx={{ width: '100%', px: 2 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name='price'
            label='Precio'
            type='number'
            fullWidth
            variant='filled'
            value={formData.price}
            onChange={handleChange}
            sx={commonInputSx}
            InputProps={{
              startAdornment: '€'
            }}
          />
        </Grid>
      </Collapse>
    </Grid>
  )
}
