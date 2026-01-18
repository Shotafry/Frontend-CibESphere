// src/components/LocationPicker.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from 'react-leaflet'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// Nominatim API result type
interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address?: {
    road?: string
    house_number?: string
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    postcode?: string
  }
}

export interface LocationData {
  latitude: number
  longitude: number
  address: string
  city?: string
  country?: string
}

interface LocationPickerProps {
  value?: LocationData | null
  onChange: (location: LocationData | null) => void
  disabled?: boolean
  label?: string
  helperText?: string
  sx?: object
}

// Component to recenter map when coordinates change
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 15)
  }, [center, map])
  return null
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'Buscar ubicación',
  helperText,
  sx
}) => {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    value ? [value.latitude, value.longitude] : [40.416775, -3.70379] // Default: Madrid
  )
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch suggestions from Nominatim API with debounce
  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 3) {
      setOptions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&countrycodes=es&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CybESphere/1.0 (contact@cybesphere.com)'
            }
          }
        )
        const data: NominatimResult[] = await response.json()
        setOptions(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'CybESphere/1.0 (contact@cybesphere.com)'
          }
        }
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  // Handle selection from autocomplete
  const handleSelect = async (result: NominatimResult | null) => {
    if (!result) {
      onChange(null)
      return
    }

    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const city =
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      ''

    setMapCenter([lat, lng])
    onChange({
      latitude: lat,
      longitude: lng,
      address: result.display_name,
      city,
      country: result.address?.country || 'España'
    })
  }

  // Handle map click
  const handleMapClick = async (lat: number, lng: number) => {
    setMapCenter([lat, lng])
    const address = await reverseGeocode(lat, lng)
    onChange({
      latitude: lat,
      longitude: lng,
      address
    })
    setInputValue(address)
  }

  // Update input value when value prop changes
  useEffect(() => {
    if (value?.address) {
      setInputValue(value.address)
      setMapCenter([value.latitude, value.longitude])
    }
  }, [value])

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Address Search */}
      <Autocomplete
        freeSolo
        disabled={disabled}
        options={options}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.display_name
        }
        inputValue={inputValue}
        onInputChange={(_, newValue) => {
          setInputValue(newValue)
          fetchSuggestions(newValue)
        }}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            fetchSuggestions(newValue)
          } else {
            handleSelect(newValue as NominatimResult | null)
          }
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant='filled'
            helperText={
              helperText || 'Busca una dirección o haz clic en el mapa'
            }
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <LocationOnIcon
                  sx={{ color: 'var(--color-cadetblue)', mr: 1 }}
                />
              ),
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: '#F3F6F9',
                borderRadius: '12px',
                border: '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: '#EBEEF2' },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  borderColor: 'var(--color-cadetblue)',
                  boxShadow: '0 0 0 4px rgba(79, 186, 200, 0.1)'
                },
                '&:before, &:after': { display: 'none' }
              }
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.place_id}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOnIcon
                sx={{ color: 'var(--color-cadetblue)', mt: 0.5 }}
              />
              <Typography variant='body2' sx={{ lineHeight: 1.4 }}>
                {option.display_name}
              </Typography>
            </Box>
          </li>
        )}
        PaperComponent={(props) => (
          <Paper
            {...props}
            sx={{
              borderRadius: '12px',
              mt: 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          />
        )}
      />

      {/* Mini Map Preview */}
      <Box
        sx={{
          mt: 2,
          height: 200,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #E0E0E0',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={value ? 15 : 6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <MapUpdater center={mapCenter} />
          <MapClickHandler onLocationSelect={handleMapClick} />
          {value && <Marker position={[value.latitude, value.longitude]} />}
        </MapContainer>
      </Box>

      {/* Coordinates Display */}
      {value && (
        <Typography
          variant='caption'
          sx={{ mt: 1, display: 'block', color: 'text.secondary' }}
        >
          📍 Coordenadas: {value.latitude.toFixed(6)},{' '}
          {value.longitude.toFixed(6)}
        </Typography>
      )}
    </Box>
  )
}
