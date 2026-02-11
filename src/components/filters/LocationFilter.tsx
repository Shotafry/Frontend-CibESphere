import React from 'react'
import { Grid, Autocomplete, TextField } from '@mui/material'
import { SPANISH_COMMUNITIES } from '../../constants/filters'
import { filterInputSx } from '../../styles/filterStyles'

interface LocationFilterProps {
  selectedCommunities: string[]
  onCommunityChange: (event: React.SyntheticEvent, value: string[]) => void
  availableCities: string[]
  selectedCities: string[]
  onCityChange: (event: React.SyntheticEvent, value: string[]) => void
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedCommunities,
  onCommunityChange,
  availableCities,
  selectedCities,
  onCityChange
}) => {
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          multiple
          options={SPANISH_COMMUNITIES}
          value={selectedCommunities}
          onChange={onCommunityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Comunidad Autónoma'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          multiple
          options={availableCities}
          value={selectedCities}
          onChange={onCityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Ciudad'
              variant='filled'
              sx={filterInputSx}
            />
          )}
        />
      </Grid>
    </>
  )
}
