import React from 'react'
import { Grid, Autocomplete, TextField } from '@mui/material'
import { EVENT_LEVELS } from '../../constants/filters'
import { filterInputSx } from '../../styles/filterStyles'

interface TypeFilterProps {
  modality: string | null
  onModalityChange: (event: React.SyntheticEvent, value: string | null) => void
  levels: string[]
  onLevelsChange: (event: React.SyntheticEvent, value: string[]) => void
  languages: string[]
  onLanguagesChange: (event: React.SyntheticEvent, value: string[]) => void
}

export const TypeFilter: React.FC<TypeFilterProps> = ({
  modality,
  onModalityChange,
  levels,
  onLevelsChange,
  languages,
  onLanguagesChange
}) => {
  return (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
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

      <Grid size={{ xs: 12, md: 4 }}>
        <Autocomplete
          multiple
          options={EVENT_LEVELS}
          value={levels}
          onChange={onLevelsChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Nivel del Evento'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
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
    </>
  )
}
