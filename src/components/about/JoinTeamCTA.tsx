import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  Grid
} from '@mui/material'
import { motion } from 'framer-motion'
import { Button } from '../Button'
import GroupsIcon from '@mui/icons-material/Groups'
import CodeIcon from '@mui/icons-material/Code'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StarIcon from '@mui/icons-material/Star'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const JoinTeamCTA: React.FC = () => {
  const theme = useTheme()

  const cards = [
    {
      title: 'Ser Miembro',
      subtitle: 'Compromiso & Liderazgo',
      description:
        'Únete al núcleo de CybESphere. Lidera iniciativas, toma decisiones arquitectónicas y construye el futuro de la plataforma.',
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#fff' }} />,
      benefits: [
        'Reconocimiento Oficial',
        'Toma de Decisiones',
        'Networking Directo'
      ],
      ctaText: 'Aplicar como Miembro',
      ctaLink: 'https://www.linkedin.com/company/cybesphere/',
      variant: 'primary',
      delay: 0.2
    },
    {
      title: 'Ser Colaborador',
      subtitle: 'Flexibilidad & Aprendizaje',
      description:
        'Aporta tu granito de arena. Ideal para mejorar tu portafolio, aprender nuevas tecnologías y ayudar con tareas específicas.',
      icon: <CodeIcon sx={{ fontSize: 40, color: 'var(--color-cadetblue)' }} />,
      benefits: [
        'Mejora tu Portafolio',
        'Sin Horarios Fijos',
        'Visibilidad en GitHub'
      ],
      ctaText: 'Empezar a Colaborar',
      ctaLink: 'https://www.linkedin.com/company/cybesphere/',
      variant: 'secondary',
      delay: 0.4
    }
  ]

  return (
    <Box
      sx={{
        position: 'relative',
        py: 10,
        px: 2,
        borderRadius: '40px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        mt: 8
      }}
    >
      {/* Background Decor */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background:
            'radial-gradient(circle, rgba(95, 186, 200, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      <Stack
        spacing={2}
        textAlign='center'
        sx={{ mb: 8, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Typography
            variant='h3'
            fontWeight='900'
            sx={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Únete a la Revolución
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Typography
            variant='h6'
            color='text.secondary'
            sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400 }}
          >
            Buscamos mentes brillantes y manos inquietas. Ya sea que busques
            liderar o aprender, hay un lugar para ti en CybESphere.
          </Typography>
        </motion.div>
      </Stack>

      <Grid container spacing={4} justifyContent='center'>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, md: 5 }} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '32px',
                  background:
                    card.variant === 'primary'
                      ? 'linear-gradient(135deg, var(--color-cadetblue) 0%, #47a0b0 100%)'
                      : 'white',
                  color: card.variant === 'primary' ? 'white' : 'text.primary',
                  boxShadow:
                    card.variant === 'primary'
                      ? '0 20px 40px rgba(95, 186, 200, 0.3)'
                      : '0 10px 30px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  position: 'relative',
                  border:
                    card.variant === 'secondary'
                      ? '1px solid rgba(95, 186, 200, 0.2)'
                      : 'none'
                }}
              >
                <CardContent
                  sx={{
                    p: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  {/* Icon Badge */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '24px',
                      background:
                        card.variant === 'primary'
                          ? 'rgba(255,255,255,0.2)'
                          : 'rgba(95, 186, 200, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    variant='overline'
                    sx={{ opacity: 0.8, letterSpacing: 2, fontWeight: 700 }}
                  >
                    {card.subtitle}
                  </Typography>

                  <Typography variant='h4' fontWeight='800' sx={{ mb: 2 }}>
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{ mb: 4, opacity: 0.9, lineHeight: 1.7, flexGrow: 1 }}
                  >
                    {card.description}
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 5 }}>
                    {card.benefits.map((benefit) => (
                      <Stack
                        direction='row'
                        alignItems='center'
                        spacing={2}
                        key={benefit}
                      >
                        <StarIcon
                          sx={{
                            fontSize: 20,
                            color:
                              card.variant === 'primary'
                                ? '#fff'
                                : 'var(--color-cadetblue)',
                            opacity: card.variant === 'primary' ? 0.7 : 1
                          }}
                        />
                        <Typography variant='body2' fontWeight={600}>
                          {benefit}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    href={card.ctaLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    variant={
                      card.variant === 'primary' ? 'secondary' : 'primary'
                    }
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: '20px',
                      bgcolor: card.variant === 'primary' ? 'white' : undefined,
                      color:
                        card.variant === 'primary'
                          ? 'var(--color-cadetblue)'
                          : undefined,
                      '&:hover': {
                        bgcolor:
                          card.variant === 'primary'
                            ? 'rgba(255,255,255,0.9)'
                            : undefined
                      }
                    }}
                  >
                    {card.ctaText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default JoinTeamCTA
