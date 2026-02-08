// src/components/EventFilters.tsx
import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Collapse,
  IconButton
} from '@mui/material'
import ExpandMore from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Button } from './Button'
import { EventFilterParams } from '../types'
import { useEventFilters } from '../hooks/useEventFilters'

// Subcomponents
import { DateFilter } from './filters/DateFilter'
import { LocationFilter } from './filters/LocationFilter'
import { CategoryTagsFilter } from './filters/CategoryTagsFilter'
import { TypeFilter } from './filters/TypeFilter'

interface EventFiltersProps {
  initialFilters: EventFilterParams
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  initialFilters
}) => {
  const {
    isOpen,
    handleToggle,
    dates,
    selectedCommunities,
    selectedCities,
    availableCities,
    tags,
    timeFilter,
    modality,
    levels,
    languages,
    setTags,
    setLevels,
    setLanguages,
    setTimeFilter,
    handleDateChange,
    handleCommunityChange,
    handleCityChange,
    handleModalityChange,
    handleApplyFilters,
    handleClearFilters
  } = useEventFilters(initialFilters)

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 2,
        borderRadius: '15px',
        background: 'var(--White)',
        boxShadow: 'var(--shadow-drop)'
      }}
    >
      <Box
        onClick={handleToggle}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FilterListIcon
            sx={{ color: 'var(--color-cadetblue)', fontSize: 18 }}
          />
          <Typography
            variant='h6'
            sx={{ color: 'var(--color-cadetblue)', fontWeight: 400 }}
          >
            Filtros de Evento
          </Typography>
        </Box>
        <IconButton
          sx={{
            color: 'var(--color-cadetblue)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box component='div' sx={{ pt: { xs: 2, sm: 4 } }}>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {/* FILA 1: FECHAS */}
            <DateFilter
              startDate={dates.startDate}
              endDate={dates.endDate}
              onDateChange={handleDateChange}
            />

            {/* FILA 2: UBICACIÓN */}
            <LocationFilter
              selectedCommunities={selectedCommunities}
              onCommunityChange={handleCommunityChange}
              availableCities={availableCities}
              selectedCities={selectedCities}
              onCityChange={handleCityChange}
            />

            {/* FILA 3: CATEGORÍAS Y ESTADO */}
            <CategoryTagsFilter
              tags={tags}
              onTagsChange={(e, v) => setTags(v)}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              hasDates={!!(dates.startDate || dates.endDate)}
            />

            {/* FILA 4: MODALIDAD, NIVEL, IDIOMA */}
            <TypeFilter
              modality={modality}
              onModalityChange={handleModalityChange}
              levels={levels}
              onLevelsChange={(e, v) => setLevels(v)}
              languages={languages}
              onLanguagesChange={(e, v) => setLanguages(v)}
            />

            {/* BOTONES */}
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'stretch', sm: 'flex-end' },
                gap: { xs: 1, sm: 2 },
                mt: { xs: 1, sm: 2 }
              }}
            >
              <Button
                variant='primary'
                onClick={handleClearFilters}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Limpiar
              </Button>
              <Button
                variant='secondary'
                onClick={handleApplyFilters}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Aplicar Filtros
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}
