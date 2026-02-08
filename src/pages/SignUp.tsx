// src/pages/SignUp.tsx
import { FunctionComponent, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
  Alert,
  useTheme,
  Collapse,
  CardContent,
  Stack,
  Chip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Role, RegisterDTO } from '../types'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PersonIcon from '@mui/icons-material/Person'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import QrCodeIcon from '@mui/icons-material/QrCode'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Button } from '../components/Button'
import { SuspensionModal } from '../components/SuspensionModal'

// Componente visual para la promoción de Organizador
const OrganizerPromoCard = ({
  selected,
  onToggle
}: {
  selected: boolean
  onToggle: () => void
}) => {
  return (
    <motion.div
      layout
      onClick={onToggle}
      initial={false}
      animate={
        selected
          ? {
              backgroundImage:
                'linear-gradient(135deg, rgba(82, 255, 237, 0.1) 0%, rgba(0, 163, 255, 0.05) 100%)',
              borderColor: 'var(--color-cadetblue)',
              boxShadow: '0 8px 32px rgba(82, 255, 237, 0.15)'
            }
          : {
              backgroundImage: 'none',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              boxShadow: 'none'
            }
      }
      style={{
        border: '2px solid',
        borderRadius: '16px',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '16px'
      }}
      transition={{ duration: 0.3 }}
    >
      <CardContent sx={{ p: '24px !important' }}>
        <Stack
          direction='row'
          alignItems='center'
          spacing={2}
          mb={selected ? 2 : 0}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: selected
                ? 'rgba(82, 255, 237, 0.2)'
                : 'rgba(0,0,0,0.05)',
              color: selected ? 'var(--color-cadetblue)' : 'text.disabled',
              transition: 'all 0.3s ease'
            }}
          >
            <AddBusinessIcon fontSize='large' />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant='h6'
              fontWeight='bold'
              color={selected ? 'var(--color-cadetblue)' : 'text.primary'}
            >
              Organizar Eventos
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {selected
                ? '¡Modo Organizador Activado!'
                : '¿Quieres crear eventos en CybESphere?'}
            </Typography>
          </Box>
          <Box
            sx={{
              color: selected ? 'var(--color-cadetblue)' : 'text.disabled'
            }}
          >
            {selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </Box>
        </Stack>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}
              >
                <Typography variant='subtitle2' fontWeight='bold' gutterBottom>
                  Beneficios incluidos:
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      icon: <AnalyticsIcon fontSize='small' />,
                      text: 'Analíticas'
                    },
                    {
                      icon: <QrCodeIcon fontSize='small' />,
                      text: 'Ticketing & QR'
                    },
                    {
                      icon: <VerifiedUserIcon fontSize='small' />,
                      text: 'Perfil Verificado'
                    },
                    {
                      icon: <AddBusinessIcon fontSize='small' />,
                      text: 'Gestión de Staff'
                    }
                  ].map((item, idx) => (
                    <Grid size={{ xs: 6 }} key={idx}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Box sx={{ color: 'var(--color-cadetblue)' }}>
                          {item.icon}
                        </Box>
                        <Typography variant='caption'>{item.text}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Chip
                  label='Configuración en el siguiente paso'
                  size='small'
                  sx={{
                    mt: 2,
                    width: '100%',
                    bgcolor: 'rgba(82, 255, 237, 0.1)',
                    color: 'var(--color-deep-teal)'
                  }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </motion.div>
  )
}

const SignUp: FunctionComponent = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const theme = useTheme()
  const [isLogin, setIsLogin] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado para modal de suspensión
  const [showSuspendedModal, setShowSuspendedModal] = useState(false)
  const [suspendedMessage, setSuspendedMessage] = useState('')

  // Extendemos RegisterDTO localmente para incluir el checkbox
  interface SignUpFormData extends RegisterDTO {
    wantsToOrganize: boolean
  }

  const {
    register: registerForm,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: Role.User, // Default a User
      wantsToOrganize: false
    }
  })

  const onSubmit: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    if (e) e.preventDefault() // Force prevent default

    setIsLoading(true)
    setError(null)
    try {
      if (isLogin) {
        await login(data.email, data.password)
      } else {
        // En registro
        const registerData: RegisterDTO = {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.wantsToOrganize ? Role.Organizer : Role.User
          // Eliminamos campos de org aquí, se llenarán en el onboarding
        }
        await register(registerData)
        navigate('/check-email')
      }
    } catch (err: any) {
      console.error(err)

      // Detectar error de cuenta suspendida
      const responseData = err.response?.data
      const errorDetails = responseData?.error

      // El backend devuelve { error: { code: 'account_suspended', ... } }
      console.log('Error recibido en SignUp:', errorDetails) // DEBUG
      if (errorDetails?.code === 'account_suspended') {
        console.log('Activando modal de suspensión') // DEBUG
        setSuspendedMessage(
          errorDetails.message || 'Tu cuenta ha sido suspendida.'
        )
        setShowSuspendedModal(true)
        setIsLoading(false) // Stop loading explicitly
        return // No mostramos el error genérico en la UI
      }

      setError(errorDetails?.message || err.message || 'Ha ocurrido un error.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        p: 3
      }}
    >
      <SuspensionModal
        open={showSuspendedModal}
        onClose={() => setShowSuspendedModal(false)}
        message={suspendedMessage}
      />

      <Grid
        container
        justifyContent='center'
        sx={{
          maxWidth: '900px',
          width: '100%',
          boxShadow: 'var(--shadow-drop)',
          borderRadius: '25px',
          overflow: 'hidden'
        }}
      >
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            background: 'var(--gradient-header-footer)',
            color: 'var(--Gray-700)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography variant='h4' fontWeight='bold'>
            {isLogin ? '¡Bienvenido de vuelta!' : 'Únete a la Comunidad'}
          </Typography>
          <Typography sx={{ mt: 2, color: 'var(--Gray-500)' }}>
            {isLogin
              ? 'Inicia sesión para acceder a tu panel y gestionar tus eventos.'
              : 'Regístrate para descubrir, participar y organizar los mejores eventos de ciberseguridad.'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 4, background: 'white' }}>
          <Typography variant='h5' fontWeight='bold' mb={2}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Typography>
          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              required
              margin='normal'
              label='Email'
              type='email'
              {...registerForm('email', {
                required: 'El email es obligatorio',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Formato de email incorrecto'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <MailOutlineIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              required
              margin='normal'
              label='Contraseña'
              type={showPassword ? 'text' : 'password'}
              {...registerForm('password', {
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                }
              })}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Requisitos de password */}
            <Collapse
              in={
                !isLogin &&
                (isPasswordFocused ||
                  !!(watch('password') && watch('password').length > 0))
              }
            >
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography
                  variant='caption'
                  color='textSecondary'
                  gutterBottom
                >
                  Requisitos de seguridad:
                </Typography>
                {[
                  {
                    pass: watch('password')?.length >= 8,
                    text: 'Mínimo 8 caracteres'
                  },
                  {
                    pass: /[a-zA-Z]/.test(watch('password') || ''),
                    text: 'Al menos una letra'
                  },
                  {
                    pass: /\d/.test(watch('password') || ''),
                    text: 'Al menos un número'
                  },
                  {
                    pass: /[!@#$%^&*(),.?":{}|<>]/.test(
                      watch('password') || ''
                    ),
                    text: 'Al menos un carácter especial (!@#$%...)'
                  }
                ].map((req, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: req.pass ? 'success.main' : 'error.main',
                        mr: 1
                      }}
                    />
                    <Typography
                      variant='caption'
                      color={req.pass ? 'text.primary' : 'text.secondary'}
                      sx={{
                        textDecoration: req.pass ? 'line-through' : 'none',
                        opacity: req.pass ? 0.7 : 1
                      }}
                    >
                      {req.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>

            <Collapse in={!isLogin}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required={!isLogin}
                    margin='normal'
                    label='Nombre'
                    {...registerForm('first_name', {
                      required: !isLogin ? 'El nombre es obligatorio' : false
                    })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <PersonIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required={!isLogin}
                    margin='normal'
                    label='Apellidos'
                    {...registerForm('last_name', {
                      required: !isLogin
                        ? 'Los apellidos son obligatorios'
                        : false
                    })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                </Grid>
              </Grid>

              {/* Enhanced Organizer Promo Card */}
              <Box sx={{ mt: 3, mb: 1 }}>
                <OrganizerPromoCard
                  selected={watch('wantsToOrganize')}
                  onToggle={() => {
                    const current = watch('wantsToOrganize')
                    setValue('wantsToOrganize', !current, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  }}
                />
              </Box>
            </Collapse>

            {error && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type='submit'
              fullWidth
              variant='primary'
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '25px'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color='inherit' />
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Registrarse'
              )}
            </Button>

            <Divider>O</Divider>

            <Button
              fullWidth
              variant='secondary'
              onClick={() => setIsLogin(!isLogin)}
              sx={{ mt: 2 }}
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia Sesión'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignUp
