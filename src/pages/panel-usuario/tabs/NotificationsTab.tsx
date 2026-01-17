import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button } from '../../../components/Button'

export const NotificationsTab: React.FC = () => {
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  return (
    <Container maxWidth='md'>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant='h6' fontWeight='bold'>
            Configuración de Notificaciones
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {saveMessage && (
          <Alert severity={saveMessage.type} sx={{ mb: 3 }}>
            {saveMessage.text}
          </Alert>
        )}

        <FormGroup>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={
              <Box>
                <Typography fontWeight='500'>
                  Notificaciones por Email
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Recibe correos sobre tus eventos próximos y novedades.
                </Typography>
              </Box>
            }
            sx={{ mb: 3, alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={
              <Box>
                <Typography fontWeight='500'>Notificaciones Push</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Recibe alertas en el navegador cuando estés en línea.
                </Typography>
              </Box>
            }
            sx={{ mb: 3, alignItems: 'flex-start' }}
          />
        </FormGroup>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='secondary'
            onClick={() =>
              setSaveMessage({
                type: 'success',
                text: 'Preferencias guardadas correctamente'
              })
            }
          >
            Guardar Preferencias
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
