import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ReceipLongIcon from '@mui/icons-material/ReceiptLong'
import InfoIcon from '@mui/icons-material/Info'
import { useSearchParams } from 'react-router-dom'
import { OrganizationSummary } from '../../../types'
import {
  getMyOrganization,
  connectStripe
} from '../../../services/api/organizations.service'

export const PaymentsTab: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationSummary | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const [successInfo, setSuccessInfo] = useState<string | null>(null)

  const fetchOrganization = async () => {
    try {
      setLoading(true)
      const data = await getMyOrganization()
      setOrganization(data)
    } catch (err) {
      console.error(err)
      setError('Error al cargar la información de la organización.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganization()
  }, [])

  useEffect(() => {
    if (searchParams.get('stripe_success') === 'true') {
      setSuccessInfo(
        '¡Cuenta conectada correctamente! Ahora puedes recibir pagos.'
      )
      // Limpiar params URL sin recargar
      setSearchParams({})
      fetchOrganization()
    }
    if (searchParams.get('stripe_refresh') === 'true') {
      // Usuario canceló o recargó, no hacer nada especial, tal vez refetch
      setSearchParams({})
      fetchOrganization()
    }
  }, [searchParams, setSearchParams])

  const handleConnect = async () => {
    setConnecting(true)
    setError(null)
    try {
      const response = await connectStripe()
      if (response.url) {
        window.location.href = response.url
      } else {
        setError('No se pudo obtener la URL de conexión.')
      }
    } catch (err: any) {
      console.error(err)
      setError(
        err.response?.data?.message ||
          'Error al conectar con Stripe. Inténtalo de nuevo.'
      )
      setConnecting(false)
    }
  }

  if (loading && !organization) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // TODO: Estos campos deben venir del backend.
  // Por ahora si existe stripe_account_id, asumimos conectado/pendiente de verify
  const isStripeConnected = !!organization?.stripe_account_id
  const isOnboardingComplete = organization?.stripe_onboarding_complete

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5' fontWeight='bold' sx={{ mb: 1 }}>
          Pagos e Ingresos
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Gestiona tus métodos de cobro y visualiza tus ganancias.
        </Typography>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successInfo && (
        <Alert
          severity='success'
          sx={{ mb: 3 }}
          onClose={() => setSuccessInfo(null)}
        >
          {successInfo}
        </Alert>
      )}

      {/* STRIPE CONNECT STATUS CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          background: isStripeConnected
            ? 'linear-gradient(to right, #F0F9FF, #E0F2FE)'
            : 'linear-gradient(to right, #FFF7ED, #FFEDD5)'
        }}
      >
        <Grid container spacing={3} alignItems='center'>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceIcon
                sx={{
                  mr: 2,
                  fontSize: 32,
                  color: isStripeConnected ? '#0284C7' : '#EA580C'
                }}
              />
              <Typography variant='h6' fontWeight='bold'>
                {isStripeConnected
                  ? 'Cuenta Vinculada con Stripe'
                  : 'Configura tus Pagos'}
              </Typography>
              <Chip
                label={
                  isOnboardingComplete
                    ? 'Activo'
                    : isStripeConnected
                    ? 'Pendiente Verificación'
                    : 'Configuración Pendiente'
                }
                color={isOnboardingComplete ? 'success' : 'warning'}
                size='small'
                sx={{ ml: 2, fontWeight: 600 }}
              />
            </Box>
            <Typography variant='body1' sx={{ mb: 2, maxWidth: '600px' }}>
              {isStripeConnected
                ? 'Tu cuenta está vinculada. Stripe gestionará los pagos y transferencias automáticamente a tu cuenta bancaria.'
                : 'Para vender entradas en CybESphere, necesitas conectar tu cuenta bancaria a través de Stripe. Es seguro, rápido y transparente.'}
            </Typography>

            {!isStripeConnected && (
              <Box
                sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}
              >
                <InfoIcon fontSize='small' color='action' />
                <Typography variant='caption' color='text.secondary'>
                  Serás redirigido a Stripe para completar el proceso de alta de
                  forma segura.
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <Button
              variant='contained'
              size='large'
              disabled={connecting}
              sx={{
                bgcolor: isStripeConnected ? '#0284C7' : '#635BFF',
                '&:hover': {
                  bgcolor: isStripeConnected ? '#0284C7' : '#4B44CC'
                },
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(99, 91, 255, 0.3)'
              }}
              onClick={handleConnect}
            >
              {connecting ? (
                <CircularProgress size={24} color='inherit' />
              ) : isStripeConnected ? (
                'Gestionar en Stripe'
              ) : (
                'Conectar con Stripe'
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* METRICS PREVIEW */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              height: '100%'
            }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ color: '#10B981', mr: 1 }} />
              <Typography variant='h6' fontWeight='bold'>
                Ingresos Totales
              </Typography>
            </Box>
            <Typography variant='h3' fontWeight='900' sx={{ mb: 1 }}>
              €0,00
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Ingresos netos después de comisiones
            </Typography>
            {!isStripeConnected && (
              <Alert severity='info' sx={{ mt: 2, borderRadius: '8px' }}>
                Conecta tu cuenta para empezar a generar ingresos.
              </Alert>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              height: '100%'
            }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceipLongIcon sx={{ color: '#6366F1', mr: 1 }} />
              <Typography variant='h6' fontWeight='bold'>
                Transacciones Recientes
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                color: 'text.secondary'
              }}
            >
              <Typography>No hay transacciones recientes</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
