// src/components/EventMap.tsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box, Typography, Button, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Event } from '../types'
// No importamos L (Leaflet) ni el icono

// Iconos para el popup (look tecnológico)
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// --- SIN Icono personalizado ---
// (Usaremos el default de Leaflet)

// --- AÑADIR ESTA INTERFAZ ---
interface EventMapProps {
  events: Event[]
}

// --- Componente interno para el contenido del Popup ---
const EventPopupContent: React.FC<{ event: Event }> = ({ event }) => {
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate(`/eventos/${event.slug}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Box sx={{ width: 320, p: 0.5, fontFamily: "'Satoshi', sans-serif" }}>
      {/* 1. Imagen del Evento (Banner) */}
      <Box
        component='img'
        src={
          event.image_url ||
          '/cyberLogo-gigapixel-art-scale-2-00x-godpix-1@2x.png'
        }
        alt={event.title}
        sx={{
          width: '100%',
          height: 140,
          objectFit: 'cover',
          borderRadius: '15px',
          mb: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />

      {/* 2. Título del Evento */}
      <Typography
        variant='h6'
        component='h3'
        sx={{
          fontWeight: 900,
          color: 'var(--Gray-900)',
          mb: 1,
          lineHeight: 1.2
        }}
      >
        {event.title}
      </Typography>

      {/* 3. Info Rápida */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon
            sx={{ fontSize: 16, color: 'var(--color-cadetblue)' }}
          />
          <Typography
            variant='body2'
            sx={{ color: 'var(--Gray-600)', fontWeight: 500 }}
          >
            {formatDate(event.start_date)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon
            sx={{ fontSize: 16, color: 'var(--color-cadetblue)' }}
          />
          <Typography
            variant='body2'
            sx={{ color: 'var(--Gray-600)', fontWeight: 500 }}
          >
            {event.is_online ? 'Online' : `${event.venue_city}`}
          </Typography>
        </Box>
      </Box>

      {/* 4. Breve Descripción (Restaurada) */}
      <Typography
        variant='body2'
        sx={{
          mb: 2,
          color: 'var(--Gray-700)',
          fontStyle: 'italic',
          fontSize: '0.85rem',
          lineHeight: 1.4
        }}
      >
        {event.short_desc}
      </Typography>

      {/* 5. Tags (Filtrando la ciudad) */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {event.tags
          .filter((tag) => tag !== event.venue_city) // Eliminamos tag de ciudad
          .slice(0, 3)
          .map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size='small'
              sx={{
                backgroundColor: 'rgba(79, 186, 200, 0.1)',
                color: 'var(--color-cadetblue)',
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '8px'
              }}
            />
          ))}
      </Box>

      {/* 6. Botón de Acción */}
      <Button
        variant='contained'
        fullWidth
        onClick={handleNavigate}
        sx={{
          borderRadius: '12px',
          py: 1,
          background: 'var(--gradient-button-primary)',
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: '0 4px 14px rgba(0, 217, 255, 0.3)',
          '&:hover': {
            background: 'var(--gradient-button-primary-hover)',
            boxShadow: '0 6px 20px rgba(0, 217, 255, 0.5)'
          }
        }}
      >
        Ver Detalles
      </Button>
    </Box>
  )
}

// --- COMPONENTE PRINCIPAL DEL MAPA (Modificado) ---
export const EventMap: React.FC<EventMapProps> = ({ events }) => {
  // Centramos el mapa en España
  const mapCenter: [number, number] = [40.416775, -3.70379]

  return (
    <Box
      sx={{
        height: '836px',
        width: '100%',
        maxWidth: '1340px',
        borderRadius: '25px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-drop)'
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* Iteramos sobre los eventos y creamos un marcador para cada uno */}
        {events.map((event) => {
          // Solo mostramos eventos con coordenadas (no online)
          if (event.latitude && event.longitude) {
            return (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
                // No hay prop "icon", por lo que usará el default
              >
                <Popup>
                  {/* USAMOS EL COMPONENTE PERSONALIZADO */}
                  <EventPopupContent event={event} />
                </Popup>
              </Marker>
            )
          }
          return null // No renderizar marcador para eventos online
        })}
      </MapContainer>
    </Box>
  )
}
