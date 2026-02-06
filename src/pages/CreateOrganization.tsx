// src/pages/CreateOrganization.tsx
import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  InputAdornment,
  Divider,
  Container,
  Fade
} from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { PageTransition } from '../components/PageTransition'
import { motion, AnimatePresence } from 'framer-motion'
import BusinessIcon from '@mui/icons-material/Business'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LanguageIcon from '@mui/icons-material/Language'
import MapIcon from '@mui/icons-material/Map'
import InfoIcon from '@mui/icons-material/Info'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { httpClient } from '../services/httpClient'

interface CreateOrganizationDTO {
  name: string
  tax_id: string
  email: string
  description?: string
  website?: string
  phone?: string // Opcional
  city?: string
  country?: string
}

const steps = ['Datos Básicos', 'Contacto', 'Confirmación']

const CreateOrganization: FunctionComponent = () => {
  const navigate = useNavigate()
  const { user, refreshUserData } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si el usuario ya tiene organización, redirigir al panel
  useEffect(() => {
    if (user?.organization) {
      navigate('/panel-de-organizador', { replace: true })
    }
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid }
  } = useForm<CreateOrganizationDTO>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      tax_id: '',
      email: user?.email || '', // Pre-fill with user email as default
      description: '',
      website: '',
      phone: '',
      city: '',
      country: ''
    }
  })

  const handleNext = async () => {
    let fieldsToValidate: (keyof CreateOrganizationDTO)[] = []
    if (activeStep === 0) {
      fieldsToValidate = ['name', 'tax_id', 'description']
    } else if (activeStep === 1) {
      fieldsToValidate = ['email', 'phone', 'website']
    }

    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const onSubmit: SubmitHandler<CreateOrganizationDTO> = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      // POST request to create organization
      await httpClient.post('/organizations', data)

      // Refrescar datos del usuario para obtener la nueva organización
      const { getMe } = await import('../services/apiService')
      const freshUser = await getMe()
      refreshUserData(freshUser)

      // Usar sessionStorage para persistencia a prueba de recargas
      sessionStorage.setItem('organization_created', 'true')

      // Redirigir inmediatamente al panel
      navigate('/panel-de-organizador', {
        replace: true
      })
    } catch (err: any) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al crear la organización.'
      )
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'var(--background-default)',
          pt: 12, // Space for fixed header
          pb: 8
        }}
      >
        <Container maxWidth='md'>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Typography
              variant='h4'
              fontWeight='bold'
              align='center'
              gutterBottom
            >
              Registra tu Organización
            </Typography>
            <Typography
              variant='body1'
              align='center'
              color='text.secondary'
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Completa la información legal y de contacto para empezar a
              publicar eventos en CybESphere.
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Message */}
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component='form' onSubmit={handleSubmit(onSubmit)}>
              {/* STEP 0: Datos Básicos */}
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Alert severity='info' icon={<InfoIcon />} sx={{ mb: 2 }}>
                      Este nombre será visible públicamente en tus eventos.
                    </Alert>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label='Nombre de la Organización'
                      required
                      {...register('name', {
                        required: 'El nombre es obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                      })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <BusinessIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label='CIF / NIF (Tax ID)'
                      required
                      {...register('tax_id', {
                        required: 'El CIF/NIF es obligatorio para facturación'
                      })}
                      error={!!errors.tax_id}
                      helperText={errors.tax_id?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <AssignmentIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label='Descripción Breve'
                      multiline
                      rows={3}
                      {...register('description', {
                        required: 'La descripción es obligatoria',
                        minLength: {
                          value: 10,
                          message: 'Mínimo 10 caracteres'
                        }
                      })}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      placeholder='Cuéntanos qué hace tu organización...'
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 1: Contacto */}
              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Email de Contacto Público'
                      required
                      type='email'
                      {...register('email', {
                        required: 'El email público es obligatorio',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Email inválido'
                        }
                      })}
                      error={!!errors.email}
                      helperText={
                        errors.email?.message || 'Visible para los asistentes'
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <EmailIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Teléfono (Opcional)'
                      type='tel'
                      {...register('phone')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <PhoneIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label='Sitio Web'
                      type='url'
                      {...register('website', {
                        pattern: {
                          value: /^https?:\/\/.*/,
                          message: 'Debe comenzar con http:// o https://'
                        }
                      })}
                      error={!!errors.website}
                      helperText={errors.website?.message}
                      placeholder='https://www.miempresa.com'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <LanguageIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Ciudad'
                      {...register('city')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <MapIcon color='action' />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='País'
                      {...register('country')}
                    />
                  </Grid>
                </Grid>
              )}

              {/* STEP 2: Confirmación */}
              {activeStep === 2 && (
                <Box textAlign='center'>
                  <Typography variant='h6' gutterBottom>
                    ¡Casi listo!
                  </Typography>
                  <Typography color='text.secondary' paragraph>
                    Al hacer clic en "Crear Organización", tu solicitud será
                    enviada. Recuerda que tu cuenta estará en estado{' '}
                    <strong>Pendiente de Aprobación</strong> hasta que
                    verifiquemos tus datos.
                  </Typography>

                  <Typography variant='body2' color='text.secondary'>
                    Al continuar, aceptas los Términos y Condiciones para
                    Organizadores de CybESphere.
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity='error' sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}
              >
                {activeStep > 0 ? (
                  <Button
                    onClick={handleBack}
                    variant='secondary'
                    disabled={isLoading}
                  >
                    Atrás
                  </Button>
                ) : (
                  <Button
                    variant='text'
                    onClick={() => navigate('/panel-de-usuario')}
                  >
                    Cancelar y salir
                  </Button>
                )}

                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant='primary'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color='inherit' />
                    ) : (
                      'Crear Organización'
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant='primary'>
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PageTransition>
  )
}

export default CreateOrganization
