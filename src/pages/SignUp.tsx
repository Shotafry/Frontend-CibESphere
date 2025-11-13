// src/pages/SignUp.tsx
import { FunctionComponent, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Collapse,
  Grid,
  Alert
} from '@mui/material'
import { useNavigate } from 'react-router-dom' // <-- Importación (ya estaba)
import { useAuth } from '../context/AuthContext'
import { Role, RegisterDTO } from '../types'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'

const SignUp: FunctionComponent = () => {
  // --- ARREGLO DEL CRASH ---
  // Esta línea faltaba en mi código anterior, ¡mil disculpas!
  const navigate = useNavigate()
  // --- FIN DEL ARREGLO ---

  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
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
      organization_website: ''
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
        await register(data)
      }
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error.')
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
          item
          size={{ xs: 12, md: 5 }}
          sx={{
            // --- CAMBIO DE COLOR ---
            background: 'var(--gradient-header-footer)', // <-- Tu gradiente
            color: 'var(--Gray-700)', // <-- Texto oscuro
            // --- FIN CAMBIO DE COLOR ---
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
            {' '}
            {/* Texto secundario */}
            {isLogin
              ? 'Inicia sesión para acceder a tu panel y gestionar tus eventos.'
              : 'Regístrate para descubrir, participar y organizar los mejores eventos de ciberseguridad.'}
          </Typography>
        </Grid>

        <Grid item size={{ xs: 12, md: 7 }} sx={{ p: 4, background: 'white' }}>
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

            <Collapse in={!isLogin}>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6 }}>
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
                <Grid item size={{ xs: 12, sm: 6 }}>
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
              variant='contained'
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '25px',
                background: 'var(--gradient-button-primary)',
                '&:hover': {
                  background: 'var(--gradient-button-primary-hover)'
                }
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
