import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  IconButton
} from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import { motion } from 'framer-motion'

// Datos del equipo
const TEAM_MEMBERS = [
  {
    name: 'Angel Caparros',
    role: 'Cloud Engineer',
    image: '/team/angel.jpg',
    bio: 'Apasionado por la tecnología y la innovación. Mi objetivo es utilizar mis habilidades técnicas para ayudar a las empresas a adoptar la nube y optimizar su infraestructura. Experiencia en AWS y Azure, y proyectos de migración cloud.',
    skills: ['AWS', 'Azure', 'Infrastructure', 'Cloud Migration'],
    social: {
      linkedin: '#',
      github: '#'
    }
  },
  {
    name: 'Bray Lozano',
    role: 'Analista de Ciberseguridad Jr',
    image: '/team/bray.jpg',
    bio: 'Analista con orientación a SOC y base técnica en sistemas, redes y pentesting. Cuento con Máster en Ciberseguridad y certificación eJPT. Experiencia desplegando SOC con Wazuh y realizando hardening de servidores.',
    skills: ['SOC', 'Pentesting', 'Wazuh', 'Linux/Windows', 'eJPT'],
    social: {
      linkedin: '#',
      github: '#'
    }
  },
  {
    name: 'Carolina Romero',
    role: 'Desarrolladora Full-Stack',
    image: '/team/carolina.jpg',
    bio: 'Desarrolladora Web con enfoque Frontend, buscando la excelencia técnica y UX accesibles. Especializada en el ecosistema JavaScript/TypeScript (React, Next.js) y Spring Boot. Pasión por el código limpio y escalable.',
    skills: ['React', 'TypeScript', 'Next.js', 'Java', 'Spring Boot'],
    social: {
      linkedin: '#',
      github: '#'
    }
  }
]

const AboutUs: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: 'var(--gradient-header-footer)',
          color: 'white',
          pt: { xs: 12, md: 20 },
          pb: { xs: 12, md: 16 },
          clipPath: 'ellipse(150% 100% at 50% 0%)',
          textAlign: 'center',
          mb: 8
        }}
      >
        <Container maxWidth='md'>
          <Typography
            variant='h2'
            fontWeight='900'
            sx={{
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            Conoce al Equipo
          </Typography>
          <Typography
            variant='h6'
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Las mentes detrás de CibESphere. Un grupo de profesionales
            apasionados por la ciberseguridad y el desarrollo tecnológico,
            unidos para fortalecer la comunidad.
          </Typography>
        </Container>
      </Box>

      {/* TEAM GRID */}
      <Container maxWidth='xl'>
        <Grid container spacing={4} justifyContent='center'>
          {TEAM_MEMBERS.map((member, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={member.name}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '24px',
                    overflow: 'visible',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    mt: 8, // Espacio para el avatar que sobresale
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0, 217, 255, 0.15)',
                      borderColor: 'rgba(0, 217, 255, 0.3)'
                    }
                  }}
                >
                  {/* AVATAR SOBRESALIENDO */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: -60,
                      left: 0,
                      right: 0
                    }}
                  >
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        bgcolor: 'var(--color-cadetblue)',
                        fontSize: '3rem'
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{ pt: 8, px: 4, pb: 4, textAlign: 'center' }}
                  >
                    <Typography variant='h5' fontWeight='800' gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      sx={{
                        color: 'var(--color-cadetblue)',
                        fontWeight: 'bold',
                        mb: 2,
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                        letterSpacing: '1px'
                      }}
                    >
                      {member.role}
                    </Typography>

                    <Typography
                      color='text.secondary'
                      sx={{ mb: 3, lineHeight: 1.7 }}
                    >
                      {member.bio}
                    </Typography>

                    {/* SKILLS */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      {member.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size='small'
                          sx={{
                            bgcolor: '#F1F5F9',
                            color: '#475569',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>

                    {/* SOCIAL */}
                    <Stack
                      direction='row'
                      spacing={2}
                      justifyContent='center'
                      sx={{ mt: 2 }}
                    >
                      <IconButton
                        href={member.social.linkedin}
                        target='_blank'
                        sx={{
                          color: '#0A66C2',
                          '&:hover': { bgcolor: 'rgba(10, 102, 194, 0.1)' }
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                      <IconButton
                        href={member.social.github}
                        target='_blank'
                        sx={{
                          color: '#333',
                          '&:hover': { bgcolor: 'rgba(51, 51, 51, 0.1)' }
                        }}
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default AboutUs
