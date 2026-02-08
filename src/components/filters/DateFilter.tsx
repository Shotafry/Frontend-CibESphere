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
            }
          }}
        />
      </Grid>
    </>
  )
}
