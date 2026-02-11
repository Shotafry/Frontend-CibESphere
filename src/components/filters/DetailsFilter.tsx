import React from 'react'
import { Grid, Autocomplete, TextField } from '@mui/material'
import { EVENT_LEVELS } from '../../constants/filters'
import { filterInputSx } from '../../styles/filterStyles'

interface DetailsFilterProps {
  modality: string | null
  onModalityChange: (event: React.SyntheticEvent, value: string | null) => void
  levels: string[]
  onLevelsChange: (event: React.SyntheticEvent, value: string[]) => void
  languages: string[]
  onLanguagesChange: (event: React.SyntheticEvent, value: string[]) => void
  timeFilter: string | null
  onTimeFilterChange: (value: string | null) => void
  hasDates: boolean
}

export const DetailsFilter: React.FC<DetailsFilterProps> = ({
  modality,
  onModalityChange,
  levels,
  onLevelsChange,
  languages,
  onLanguagesChange,
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
      <Grid size={{ xs: 12, md: 3 }}>
        <Autocomplete
          options={['Online', 'Presencial']}
          value={modality}
          onChange={onModalityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Modalidad'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Autocomplete
          multiple
          options={EVENT_LEVELS}
          value={EVENT_LEVELS.filter((level) => levels.includes(level.value))}
          onChange={(event, value) => {
            onLevelsChange(
              event,
              value.map((v) => v.value)
            )
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Nivel'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Autocomplete
          multiple
          options={[
            'Español',
            'Inglés',
            'Catalán',
            'Euskera',
            'Gallego',
            'Valenciano'
          ]}
          value={languages}
          onChange={onLanguagesChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Idioma'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
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
              label='Estado'
              variant='filled'
              sx={filterInputSx}
              helperText={hasDates ? 'Deshabilitado (fechas)' : undefined}
            />
          )}
        />
      </Grid>
    </>
  )
}
