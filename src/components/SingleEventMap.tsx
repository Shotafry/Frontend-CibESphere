// src/components/SingleEventMap.tsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box, Typography } from '@mui/material'
import { Event } from '../types'
import { Height } from '@mui/icons-material'

interface SingleEventMapProps {
  event: Event
}

export const SingleEventMap: React.FC<SingleEventMapProps> = ({ event }) => {
  // Si no hay lat/long (ej. evento online), no renderizar el mapa
  if (!event.latitude || !event.longitude) {
    return null
  }

  const position: [number, number] = [event.latitude, event.longitude]

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: 'inherit',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            <Typography variant='h6' component='div' sx={{ fontWeight: 700 }}>
              {event.venue_name || event.title}
            </Typography>
            <Typography variant='body2'>{event.venue_address}</Typography>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  )
}
