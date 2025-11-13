import React, { useState } from 'react';
import { Box, Button, cardHeaderClasses, Modal, Typography } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

const ComunidadBox: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      className="comunidad-hero"
      sx={{
        maxWidth: 1362,
        width: '100%',
        margin: '0 auto',
        mb: 6,
        minHeight: { xs: 400, md: 520 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(120deg, #01c0fa 0%, #282828 100%)',
        boxShadow: '0 8px 32px rgba(36, 165, 182, 0.15)',
        borderRadius: 24,
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
        variant="h1"
        sx={{
          fontSize: { xs: '2.2rem', md: '3.5rem' },
          fontWeight: 900,
          textAlign: 'center',
          textShadow: '0 2px 8px #282828',
          mb: 2,
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
          textAlign: 'center',
          maxWidth: 700,
          mb: 3,
          fontWeight: 500,
          animation: 'fadeInHero 1.8s cubic-bezier(.4,0,.2,1)'
        }}
      >
        Únete a CibESphere y participa en la comunidad de ciberseguridad en España.<br /> <br />
        Colabora, comparte eventos, aprende y conecta con otros profesionales y entusiastas. <br /><br />
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, animation: 'fadeInHero 2.4s cubic-bezier(.4,0,.2,1)' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            background: '#01c0fa',
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'Satoshi, Arial, Helvetica, sans-serif',
            px: 4,
            py: 1.8,
            borderRadius: '16px',
            fontSize: '1.2rem',
            boxShadow: '0 4px 16px rgba(36, 165, 182, 0.18)',
            transition: 'transform 0.2s',
            '&:hover': {
              background: '#00a7d1',
              color: '#fff',
              transform: 'scale(1.07)'
            }
          }}
          onClick={() => setOpen(true)}
        >
          Soy Organizador
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            background: '#01c0fa',
            color: '#fff',
            fontWeight: 700,
            fontFamily: 'Satoshi, Arial, Helvetica, sans-serif',
            px: 4,
            py: 1.8,
            borderRadius: '16px',
            fontSize: '1.2rem',
            boxShadow: '0 4px 16px rgba(36, 165, 182, 0.18)',
            transition: 'transform 0.2s',
            '&:hover': {
              background: '#00a7d1',
              color: '#fff',
              transform: 'scale(1.07)'
            }
          }}
        >
          Soy Participante
        </Button>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            border: '4px solid #01c0fa',
            boxShadow: '0 8px 32px rgba(36, 165, 182, 0.25)',
            borderRadius: 6,
            p: 5,
            maxWidth: 420,
            width: '95%',
            textAlign: 'center',
            color: '#222',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeInHero 0.7s cubic-bezier(.4,0,.2,1)'
          }}
        >
          <CampaignIcon sx={{ fontSize: '5rem', color: '#01c0fa', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 900, letterSpacing: 1, color: '#01c0fa' }}>
            ¡Participa como Organizador!
          </Typography>
          <Typography sx={{ mb: 3, fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.7, color: '#222' }}>
            <span style={{ display: 'block', marginBottom: '1rem' }}>Date de alta como usuario.</span>
            <span style={{ display: 'block', marginBottom: '1rem' }}>Cuéntanos tu evento.</span>
            <span style={{ display: 'block', marginBottom: '1rem' }}>Daremos visibilidad en nuestra plataforma.</span>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              background: '#01c0fa',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px rgba(36, 165, 182, 0.15)',
              mt: 2,
              '&:hover': {
                background: '#282828',
                color: '#fff'
              }
            }}
            onClick={() => setOpen(false)}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ComunidadBox;
