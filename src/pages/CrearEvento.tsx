import { FunctionComponent } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Button } from '../components/Button'
import {
  useEventForm,
  BasicInfoSection,
  DateLocationSection,
  CapacityPriceSection,
  AgendaSection,
  SpeakersSection
} from './crear-evento'
import { PageTransition } from '../components/PageTransition'

import { useAuth } from '../context/AuthContext'
import * as apiService from '../services/apiService'
import { useEffect, useState } from 'react'

const CrearEvento: FunctionComponent = () => {
  const { user } = useAuth()
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [blockReason, setBlockReason] = useState<
    'suspended' | 'pending' | null
  >(null)

  useEffect(() => {
    const checkOrgStatus = async () => {
      try {
        const org = await apiService.getMyOrganization()
        if (org.status === 'suspended') setBlockReason('suspended')
        else if (org.status === 'pending') setBlockReason('pending')
        else setBlockReason(null)
      } catch (error) {
        console.error('Error checking organization status:', error)
        // Fallback to user context if API fails
        if (user?.organization?.status === 'suspended')
          setBlockReason('suspended')
        else if (user?.organization?.status === 'pending')
          setBlockReason('pending')
      } finally {
        setIsCheckingStatus(false)
      }
    }
    checkOrgStatus()
  }, [user])

  const isSuspended = blockReason === 'suspended'
  const isPending = blockReason === 'pending'

  const {
    formData,
    isLoading,
    error,
    isEditMode,
    availableCities,
    handleChange,
    handleDateChange,
    handleAutocompleteChange,
    handleLanguageChange,
    handleSingleAutocompleteChange,
    handleAddAgendaItem,
    handleRemoveAgendaItem,
    handleAgendaItemChange,
    handleAddSpeaker,
    handleRemoveSpeaker,
    handleSpeakerChange,
    handleLocationChange,
    handleImageChange,
    handleAddTicketType,
    handleRemoveTicketType,
    handleTicketTypeChange,
    handleSubmit
  } = useEventForm()

  // Block access if suspended or pending
  if (isSuspended || isPending) {
    return (
      <Container maxWidth='md' sx={{ my: 10 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '25px',
            textAlign: 'center',
            bgcolor: '#FFF'
          }}
        >
          <Typography
            variant='h4'
            color={isSuspended ? 'error' : 'warning.main'}
            fontWeight='bold'
            gutterBottom
          >
            {isSuspended ? 'Acceso Restringido' : 'En Revisión'}
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            {isSuspended
              ? 'Tu organización ha sido suspendida. No puedes crear ni editar eventos en este momento. Por favor, contacta con el soporte para resolver esta situación.'
              : 'Tu organización está pendiente de verificación. Podrás crear eventos una vez que tu cuenta haya sido aprobada.'}
          </Typography>
          <Button variant='primary' onClick={() => window.history.back()}>
            Volver al Panel
          </Button>
        </Paper>
      </Container>
    )
  }

  if (isLoading || isCheckingStatus) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PageTransition>
        <Container maxWidth='md' sx={{ my: 5 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: '25px',
              background: 'var(--White)',
              boxShadow: 'var(--shadow-drop)'
            }}
          >
            <Typography
              variant='h4'
              component='h1'
              fontWeight='bold'
              gutterBottom
              sx={{ color: 'var(--color-cadetblue)', mb: 3 }}
            >
              {isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </Typography>

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <ErrorBoundary>
              <Box component='form' onSubmit={handleSubmit} noValidate>
                {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Información Básica
                  </Typography>
                  <BasicInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    handleAutocompleteChange={handleAutocompleteChange}
                    handleLanguageChange={handleLanguageChange}
                    handleImageChange={handleImageChange}
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* SECCIÓN 2: FECHA Y UBICACIÓN */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Fecha y Ubicación
                  </Typography>
                  <DateLocationSection
                    formData={formData}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleSingleAutocompleteChange={
                      handleSingleAutocompleteChange
                    }
                    handleLocationChange={handleLocationChange}
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* SECCIÓN 3: CAPACIDAD Y PRECIO */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Capacidad y Precio
                  </Typography>
                  <CapacityPriceSection
                    formData={formData}
                    handleChange={handleChange}
                    handleAddTicketType={handleAddTicketType}
                    handleRemoveTicketType={handleRemoveTicketType}
                    handleTicketTypeChange={handleTicketTypeChange}
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* SECCIÓN 4: ITINERARIO (AGENDA Y PONENTES) */}
                <Card
                  variant='outlined'
                  sx={{
                    borderRadius: '16px',
                    borderColor: 'var(--Gray-300)',
                    mt: 2,
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <CardContent>
                    <Typography
                      variant='h6'
                      fontWeight='bold'
                      sx={{ color: 'var(--color-cadetblue)', mb: 2 }}
                    >
                      Itinerario / Agenda
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mb: 3 }}
                    >
                      Añade los detalles de la agenda y ponentes. Si dejas esto
                      vacío, no se mostrará en la página del evento.
                    </Typography>

                    <AgendaSection
                      agenda={formData.agenda}
                      handleAddAgendaItem={handleAddAgendaItem}
                      handleRemoveAgendaItem={handleRemoveAgendaItem}
                      handleAgendaItemChange={handleAgendaItemChange}
                    />

                    <SpeakersSection
                      speakers={formData.speakers}
                      handleAddSpeaker={handleAddSpeaker}
                      handleRemoveSpeaker={handleRemoveSpeaker}
                      handleSpeakerChange={handleSpeakerChange}
                    />
                  </CardContent>
                </Card>

                <Box
                  sx={{
                    mt: 4,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2
                  }}
                >
                  <Button
                    variant='secondary'
                    onClick={() => window.history.back()}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' variant='primary'>
                    {isEditMode ? 'Guardar Cambios' : 'Crear Evento'}
                  </Button>
                </Box>
              </Box>
            </ErrorBoundary>
          </Paper>
        </Container>
      </PageTransition>
    </LocalizationProvider>
  )
}

export default CrearEvento
