import React from 'react'
import { Grid, Autocomplete, TextField } from '@mui/material'
import { CYBERSECURITY_TAGS } from '../../constants/filters'
import { filterInputSx } from '../../styles/filterStyles'

interface CategoryTagsFilterProps {
  tags: string[]
  onTagsChange: (event: React.SyntheticEvent, value: string[]) => void
  timeFilter: string | null
  onTimeFilterChange: (value: string | null) => void
  hasDates: boolean
}

export const CategoryTagsFilter: React.FC<CategoryTagsFilterProps> = ({
  tags,
  onTagsChange,
  timeFilter,
  onTimeFilterChange,
  hasDates
}) => {
  const getTimeFilterLabel = (val: string | null) => {
    if (val === 'upcoming') return 'Próximos'
    if (val === 'past') return 'Finalizados'
    if (val === 'all') return 'Todos'
    return 'Próximos'
  }

  return (
    <>
      <Grid size={{ xs: 12, md: 8 }}>
        <Autocomplete
          multiple
          options={CYBERSECURITY_TAGS}
          value={tags}
          onChange={onTagsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Categorías / Tags'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Autocomplete
          options={['Próximos', 'Finalizados', 'Todos']}
          value={getTimeFilterLabel(timeFilter)}
          onChange={(_, value) => {
            if (value === 'Próximos') onTimeFilterChange('upcoming')
            else if (value === 'Finalizados') onTimeFilterChange('past')
            else if (value === 'Todos') onTimeFilterChange('all')
            else onTimeFilterChange('upcoming')
          }}
          disabled={hasDates}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Estado del Evento'
              variant='filled'
              sx={filterInputSx}
              helperText={
                hasDates ? 'Deshabilitado al usar filtro de fechas' : undefined
              }
            />
          )}
        />
      </Grid>
    </>
  )
}
