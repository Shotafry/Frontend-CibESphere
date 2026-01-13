import React, { useState } from 'react'
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Fade,
  Backdrop
} from '@mui/material'
import CampaignIcon from '@mui/icons-material/Campaign'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CloseIcon from '@mui/icons-material/Close'
import GroupsIcon from '@mui/icons-material/Groups'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ComunidadBox: React.FC = () => {
  const [openOrganizer, setOpenOrganizer] = useState(false)
  const [openParticipant, setOpenParticipant] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleOrganizerClick = () => {
    setOpenOrganizer(true)
  }

  const handleParticipantClick = () => {
    setOpenParticipant(true)
  }

  const handleGoToLogin = (type: 'organizer' | 'participant') => {
    setOpenOrganizer(false)
    setOpenParticipant(false)
    navigate(type === 'organizer' ? '/login?role=organizer' : '/login')
  }

  // Modal styles
  const modalBoxStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '24px',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
    p: { xs: 3, md: 5 },
    maxWidth: 480,
    width: '92%',
    textAlign: 'center' as const,
    outline: 'none',
    overflow: 'hidden'
  }

  return (
    <Box
      className='comunidad-hero'
      sx={{
        width: '100%',
        margin: '0 auto',
        mb: { xs: 3, md: 6 },
        minHeight: { xs: 340, md: 520 },
        px: { xs: 1, sm: 3, md: 0 },
        py: { xs: 2, md: 0 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(120deg, #01c0fa 0%, #282828 100%)',
        boxShadow: '0 8px 32px rgba(36, 165, 182, 0.15)',
        borderRadius: { xs: 3, md: 24 },
        animation: 'fadeInHero 1.2s cubic-bezier(.4,0,.2,1)'
      }}
    >
      <style>
        {`
          @keyframes fadeInHero {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes iconPulse {
            0% { transform: scale(1);}
            50% { transform: scale(1.15);}
            100% { transform: scale(1);}
          }
          @keyframes modalSlideIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8);}
            to { opacity: 1; transform: translate(-50%, -50%) scale(1);}
          }
        `}
      </style>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: { xs: 2, md: 4 },
          mb: 2,
          animation: 'iconPulse 2s infinite'
        }}
      >
        <CampaignIcon
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            color: '#01c0fa',
            textShadow: '0 4px 16px #01c0fa'
          }}
        />
      </Box>
      <Typography
        variant='h1'
        sx={{
          fontSize: { xs: '2.2rem', md: '3.5rem' },
          fontWeight: 900,
          textAlign: 'center',
          textShadow: '0 2px 8px #282828',
          mb: 4,
          letterSpacing: 2,
          fontFamily: 'Satoshi, Arial, Helvetica, sans-serif',
          animation: 'fadeInHero 1.5s cubic-bezier(.4,0,.2,1)'
        }}
      >
        Sé parte de nuestra comunidad
      </Typography>
      <Typography
        sx={{
          color: '#004F6A',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          textAlign: 'left',
          maxWidth: 700,
          mb: 3,
          fontWeight: 500,
          animation: 'fadeInHero 1.8s cubic-bezier(.4,0,.2,1)'
        }}
      >
        Únete a CybESphere y participa en la comunidad de ciberseguridad en
        España.
        <br /> <br />
        Colabora, comparte eventos, aprende y conecta con otros profesionales y
        entusiastas. <br />
        <br />
      </Typography>
      <Typography
        sx={{
          color: '#fff',
          fontSize: { xs: '1.1rem', md: '1.3rem' },
          textAlign: 'center',
          mb: 2,
          fontWeight: 700,
          animation: 'fadeInHero 2s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <em>¡Tu participación hace crecer la comunidad!</em>
        </span>
      </Typography>
      <Typography
        sx={{
          color: '#fff',
          fontSize: { xs: '1.1rem', md: '1.3rem' },
          textAlign: 'center',
          mb: 2,
          fontWeight: 700,
          animation: 'fadeInHero 2.2s cubic-bezier(.4,0,.2,1)'
        }}
      >
        ¿Cómo participar?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          mt: 2,
          width: '100%',
          animation: 'fadeInHero 2.4s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <Button variant='primary' onClick={handleOrganizerClick}>
          Soy Organizador
        </Button>
        <Button variant='secondary' onClick={handleParticipantClick}>
          Soy Participante
        </Button>
      </Box>

      {/* MODAL ORGANIZADOR */}
      <Modal
        open={openOrganizer}
        onClose={() => setOpenOrganizer(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.5)' }
          }
        }}
      >
        <Fade in={openOrganizer}>
          <Box sx={modalBoxStyle}>
            {/* X Close Button */}
            <IconButton
              onClick={() => setOpenOrganizer(false)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#64748B',
                '&:hover': { color: '#1E293B', bgcolor: '#F1F5F9' }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Decorative top bar */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(90deg, #01c0fa, #00d9ff)'
              }}
            />

            <EmojiEventsIcon
              sx={{ fontSize: '4rem', color: '#01c0fa', mb: 2 }}
            />

            {user ? (
              // User is logged in
              <>
                <Typography
                  variant='h5'
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    color: '#1E293B'
                  }}
                >
                  ¡Ya estás a bordo! 🚀
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#475569'
                  }}
                >
                  No necesitas hacer nada más, ya formas parte de la comunidad
                  CybESphere.
                  {user.role === 'organizer' || user.role === 'admin' ? (
                    <>
                      <br />
                      <br />
                      <strong>
                        Como organizador, puedes crear y gestionar eventos desde
                        tu panel.
                      </strong>
                    </>
                  ) : (
                    <>
                      <br />
                      <br />
                      Si quieres organizar eventos, contacta con nosotros para
                      obtener acceso de organizador.
                    </>
                  )}
                </Typography>
                <Button
                  variant='primary'
                  onClick={() => setOpenOrganizer(false)}
                >
                  ¡Entendido!
                </Button>
              </>
            ) : (
              // User not logged in
              <>
                <Typography
                  variant='h5'
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    color: '#1E293B'
                  }}
                >
                  ¿Organizas eventos de ciberseguridad?
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#475569',
                    textAlign: 'left'
                  }}
                >
                  <strong>CybESphere</strong> es la plataforma perfecta para dar
                  visibilidad a tus eventos. Únete como organizador y:
                  <br />
                  <br />
                  ✓ Publica y promociona tus eventos gratis
                  <br />
                  ✓ Llega a una audiencia apasionada por la ciberseguridad
                  <br />
                  ✓ Gestiona inscripciones y feedback
                  <br />✓ Conecta con la comunidad profesional
                </Typography>
                <Button
                  variant='primary'
                  onClick={() => handleGoToLogin('organizer')}
                >
                  Empezar como Organizador
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* MODAL PARTICIPANTE */}
      <Modal
        open={openParticipant}
        onClose={() => setOpenParticipant(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
            sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0,0,0,0.5)' }
          }
        }}
      >
        <Fade in={openParticipant}>
          <Box sx={modalBoxStyle}>
            {/* X Close Button */}
            <IconButton
              onClick={() => setOpenParticipant(false)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: '#64748B',
                '&:hover': { color: '#1E293B', bgcolor: '#F1F5F9' }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Decorative top bar */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: 'linear-gradient(90deg, #282828, #01c0fa)'
              }}
            />

            <GroupsIcon sx={{ fontSize: '4rem', color: '#01c0fa', mb: 2 }} />

            {user ? (
              // User is logged in
              <>
                <Typography
                  variant='h5'
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    color: '#1E293B'
                  }}
                >
                  ¡Ya eres parte de la familia! 🎉
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#475569'
                  }}
                >
                  Genial, ya tienes tu cuenta en CybESphere. Explora los eventos
                  disponibles, inscríbete y conecta con otros profesionales de
                  la ciberseguridad.
                  <br />
                  <br />
                  <strong>¡Nos vemos en el próximo evento!</strong>
                </Typography>
                <Button
                  variant='primary'
                  onClick={() => setOpenParticipant(false)}
                >
                  ¡Perfecto!
                </Button>
              </>
            ) : (
              // User not logged in
              <>
                <Typography
                  variant='h5'
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    color: '#1E293B'
                  }}
                >
                  ¡Únete a la comunidad!
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#475569',
                    textAlign: 'left'
                  }}
                >
                  Regístrate en <strong>CybESphere</strong> y accede a todo lo
                  que la comunidad ofrece:
                  <br />
                  <br />
                  ✓ Descubre eventos de ciberseguridad en España
                  <br />
                  ✓ Guarda tus eventos favoritos
                  <br />
                  ✓ Inscríbete y recibe recordatorios
                  <br />
                  ✓ Conecta con profesionales del sector
                  <br />✓ Muestra tus certificaciones en tu perfil
                </Typography>
                <Button
                  variant='primary'
                  onClick={() => handleGoToLogin('participant')}
                >
                  Crear mi cuenta gratis
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default ComunidadBox
