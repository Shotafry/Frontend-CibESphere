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
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  Grid,
  Alert,
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Role, RegisterDTO } from '../types'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import { Button } from '../components/Button'

const SignUp: FunctionComponent = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const theme = useTheme() // Added useTheme hook
  const [isLogin, setIsLogin] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false) // Added new state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerForm,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<RegisterDTO>({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: Role.User,
      organization_name: '',
      organization_website: '' // Opcional
    }
  })

  const role = watch('role')

  const onSubmit: SubmitHandler<RegisterDTO> = async (data: RegisterDTO) => {
    setIsLoading(true)
    setError(null)
    try {
      if (isLogin) {
        await login(data.email, data.password)
      } else {
        // En registro, aseguramos que los campos opcionales no vayan null si son string
        const registerData = { ...data }
        await register(registerData)
        navigate('/check-email')
      }
    } catch (err: any) {
      console.error(err)
      setError(
        err.response?.data?.message || err.message || 'Ha ocurrido un error.'
      )
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
            {!isLogin && (
              <Box mb={2}>
                <Controller
                  name='role'
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      value={field.value}
                      exclusive
                      onChange={(e, newRole) =>
                        newRole !== null && field.onChange(newRole)
                      }
                      fullWidth
                    >
                      <ToggleButton value={Role.User}>Asistente</ToggleButton>
                      <ToggleButton value={Role.Organizer}>
                        Organizador
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Box>
            )}

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

            {/* Mostrar panel solo si se está escribiendo o está enfocado */}
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
            </Collapse>

            <Collapse in={!isLogin && role === Role.Organizer}>
              <Divider sx={{ my: 2 }}>Información de la Organización</Divider>
              <TextField
                fullWidth
                required={!isLogin && role === Role.Organizer}
                margin='normal'
                label='Nombre de la Organización'
                {...registerForm('organization_name', {
                  required:
                    role === Role.Organizer
                      ? 'El nombre de la organización es obligatorio'
                      : false
                })}
                error={!!errors.organization_name}
                helperText={errors.organization_name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <BusinessIcon />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                margin='normal'
                label='Sitio Web (Opcional)'
                type='url'
                {...registerForm('organization_website')}
              />
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
