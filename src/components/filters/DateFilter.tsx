import React from 'react'
import { Grid } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { filterInputSx } from '../../styles/filterStyles'

interface DateFilterProps {
  startDate: Date | null
  endDate: Date | null
  onDateChange: (field: 'startDate' | 'endDate') => (date: Date | null) => void
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onDateChange
}) => {
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          label='Desde'
          value={startDate}
          onChange={onDateChange('startDate')}
          sx={{ width: '100%' }}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              hiddenLabel: false,
              sx: filterInputSx
            },
            actionBar: {
              actions: ['cancel', 'accept'],
              sx: {
                '& .MuiButton-root:first-of-type': {
                  // Estilo Secondary (Cancelar)
                  background: 'var(--White)',
                  color: 'var(--color-cadetblue)',
                  border: '1px solid var(--color-cadetblue)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'var(--gradient-button-primary)',
                    color: 'var(--White)',
                    border: '1px solid transparent'
                  }
                },
                '& .MuiButton-root:last-of-type': {
                  // Estilo Primary (Aceptar)
                  background: 'var(--gradient-button-primary)',
                  color: 'var(--White)',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'var(--White)',
                    color: 'var(--color-cadetblue)',
                    border: '1px solid var(--color-cadetblue)'
                  }
                }
              }
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          label='Hasta'
          value={endDate}
          onChange={onDateChange('endDate')}
          sx={{ width: '100%' }}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              sx: filterInputSx
            },
            actionBar: {
              actions: ['cancel', 'accept'],
              sx: {
                '& .MuiButton-root:first-of-type': {
                  // Estilo Secondary (Cancelar)
                  background: 'var(--White)',
                  color: 'var(--color-cadetblue)',
                  border: '1px solid var(--color-cadetblue)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'var(--gradient-button-primary)',
                    color: 'var(--White)',
                    border: '1px solid transparent'
                  }
                },
                '& .MuiButton-root:last-of-type': {
                  // Estilo Primary (Aceptar)
                  background: 'var(--gradient-button-primary)',
                  color: 'var(--White)',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'var(--White)',
                    color: 'var(--color-cadetblue)',
                    border: '1px solid var(--color-cadetblue)'
                  }
                }
              }
            }
          }}
        />
      </Grid>
    </>
  )
}
