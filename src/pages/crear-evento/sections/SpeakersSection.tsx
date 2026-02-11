import React from 'react'
import { Box, Typography, TextField, IconButton } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { Button } from '../../../components/Button'
import { Speaker } from '../../../types'
import { commonInputSx } from '../styles'

interface SpeakersSectionProps {
  speakers: Speaker[]
  handleAddSpeaker: () => void
  handleRemoveSpeaker: (id: string) => void
  handleSpeakerChange: (id: string, field: keyof Speaker, value: string) => void
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  speakers,
  handleAddSpeaker,
  handleRemoveSpeaker,
  handleSpeakerChange
}) => {
  return (
    <>
      <Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 1 }}>
        Ponentes
      </Typography>
      {speakers.map((speaker, index) => (
        <Box
          key={speaker.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 3,
            p: 2,
            border: '1px dashed #ccc',
            borderRadius: '8px'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='caption' color='text.secondary'>
              Ponente #{index + 1}
            </Typography>
            <IconButton
              onClick={() => handleRemoveSpeaker(speaker.id)}
              color='error'
              size='small'
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label='Nombre'
              value={speaker.name}
              onChange={(e) =>
                handleSpeakerChange(speaker.id, 'name', e.target.value)
              }
              variant='filled'
              size='small'
              fullWidth
              sx={commonInputSx}
            />
            <TextField
              label='Cargo / Rol'
              value={speaker.role}
              onChange={(e) =>
                handleSpeakerChange(speaker.id, 'role', e.target.value)
              }
              variant='filled'
              size='small'
              fullWidth
              sx={commonInputSx}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label='Tema / Título de la Charla'
              value={speaker.topic}
              onChange={(e) =>
                handleSpeakerChange(speaker.id, 'topic', e.target.value)
              }
              variant='filled'
              size='small'
              fullWidth
              sx={commonInputSx}
            />
            <TextField
              label='URL de la Foto'
              value={speaker.avatar_url || ''}
              onChange={(e) =>
                handleSpeakerChange(speaker.id, 'avatar_url', e.target.value)
              }
              variant='filled'
              size='small'
              fullWidth
              sx={commonInputSx}
              placeholder='https://...'
            />
            <TextField
              label='Hora Ligada'
              value={speaker.time}
              onChange={(e) =>
                handleSpeakerChange(speaker.id, 'time', e.target.value)
              }
              variant='filled'
              size='small'
              sx={{ ...commonInputSx, width: '150px' }}
              placeholder='09:00'
            />
          </Box>
        </Box>
      ))}
      <Button
        variant='secondary'
        startIcon={<AddIcon />}
        onClick={handleAddSpeaker}
      >
        Añadir Ponente
      </Button>
    </>
  )
}
