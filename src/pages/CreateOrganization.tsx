// src/pages/CreateOrganization.tsx
import { FunctionComponent, useState } from 'react'
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
  Container
} from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
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
      fieldsToValidate = ['name', 'tax_id']
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

      // Force refresh of user data to get the new role and OrganizationID
      // Note: Backend logic should have updated User to Role.Organizer and assigned OrgID
      if (user) {
        // We might need a slightly more robust way to refresh,
        // but getting 'me' again is standard.
        // For now, assume success redirects to organizer panel
        // and the AuthContext initialization or refresh handles the rest.
        // A full page reload might be safest for role changes if context sync is tricky.
        // But let's try clean navigation.
        navigate('/panel-de-organizador')
        window.location.reload() // Ensuring context update for role change
      }
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
            Completa la información legal y de contacto para empezar a publicar
            eventos en CybESphere.
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 0: Datos Básicos */}
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity='info' icon={<InfoIcon />} sx={{ mb: 2 }}>
                    Este nombre será visible públicamente en tus eventos.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label='Descripción Breve'
                    multiline
                    rows={3}
                    {...register('description')}
                    placeholder='Cuéntanos qué hace tu organización...'
                  />
                </Grid>
              </Grid>
            )}

            {/* STEP 1: Contacto */}
            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='País' {...register('country')} />
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

                <Alert
                  severity='warning'
                  sx={{ mt: 2, mb: 4, textAlign: 'left' }}
                >
                  Asegúrate de haber verificado tu dirección de email personal
                  antes de continuar.
                </Alert>

                <Divider sx={{ my: 3 }} />

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
                  variant='outline'
                  disabled={isLoading}
                >
                  Atrás
                </Button>
              ) : (
                <Button
                  variant='text'
                  color='secondary'
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
  )
}

export default CreateOrganization
