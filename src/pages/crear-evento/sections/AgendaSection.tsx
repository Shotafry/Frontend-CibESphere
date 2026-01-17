import React from 'react'
import { Box, Typography, TextField, IconButton, Divider } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { Button } from '../../../components/Button'
import { AgendaItem } from '../../../types'
import { commonInputSx } from '../styles'

interface AgendaSectionProps {
  agenda: AgendaItem[]
  handleAddAgendaItem: () => void
  handleRemoveAgendaItem: (id: string) => void
  handleAgendaItemChange: (
    id: string,
    field: keyof AgendaItem,
    value: string
  ) => void
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({
  agenda,
  handleAddAgendaItem,
  handleRemoveAgendaItem,
  handleAgendaItemChange
}) => {
  return (
    <>
      <Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 1 }}>
        Agenda
      </Typography>
      {agenda.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            alignItems: 'flex-start'
          }}
        >
          <TextField
            label='Hora'
            value={item.time}
            onChange={(e) =>
              handleAgendaItemChange(item.id, 'time', e.target.value)
            }
            variant='filled'
            size='small'
            sx={{ ...commonInputSx, width: '120px' }}
            placeholder='09:00'
          />
          <TextField
            label='Título / Actividad'
            value={item.title}
            onChange={(e) =>
              handleAgendaItemChange(item.id, 'title', e.target.value)
            }
            variant='filled'
            size='small'
            fullWidth
            sx={commonInputSx}
          />
          <TextField
            label='Descripción (Opcional)'
            value={item.description}
            onChange={(e) =>
              handleAgendaItemChange(item.id, 'description', e.target.value)
            }
            variant='filled'
            size='small'
            fullWidth
            sx={commonInputSx}
          />
          <IconButton
            onClick={() => handleRemoveAgendaItem(item.id)}
            color='error'
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant='primary'
        startIcon={<AddIcon />}
        onClick={handleAddAgendaItem}
        sx={{ mb: 4 }}
      >
        Añadir Actividad
      </Button>

      <Divider sx={{ my: 2 }} />
    </>
  )
}
