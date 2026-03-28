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
import { Button } from '../components/Button'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import { motion } from 'framer-motion'
import { CollaboratorCard } from '../components/collaborators/CollaboratorCard'
import { HeroSection } from '../components/ui/HeroSection'
import JoinTeamCTA from '../components/about/JoinTeamCTA'

// Imágenes (Rutas públicas)
const angelImg = '/img/team/angel.jpg'
const brayImg = '/img/team/bray.jpg'
const carolinaImg = '/img/collaborators/carolina.jpg'

// Datos del equipo (Miembros Principales)
const TEAM_MEMBERS = [
  {
    name: 'Angel Caparros',
    role: 'Cloud Engineer',
    image: angelImg,
    bio: 'Apasionado por la tecnología y la innovación. Mi objetivo es utilizar mis habilidades técnicas para ayudar a las empresas a adoptar la nube y optimizar su infraestructura. Experiencia en AWS y Azure, y proyectos de migración cloud.',
    skills: ['AWS', 'Azure', 'Infrastructure', 'Cloud Migration'],
    social: {
      linkedin: 'https://www.linkedin.com/in/cloud-engenieer-angcapb/',
      github: 'https://github.com/kubaliski'
    }
  },
  {
    name: 'Bray Lozano',
    role: 'Analista de Ciberseguridad Jr',
    image: brayImg,
    bio: 'Analista con orientación a SOC y base técnica en sistemas, redes y pentesting. Cuento con Máster en Ciberseguridad y certificación eJPT. Experiencia desplegando SOC con Wazuh y realizando hardening de servidores.',
    skills: ['SOC', 'Pentesting', 'Wazuh', 'Linux/Windows', 'eJPT'],
    social: {
      linkedin: 'https://www.linkedin.com/in/braylozano',
      github: 'https://github.com/Shotafry'
    }
  }
]

// Datos de Colaboradores
const COLLABORATORS = [
  {
    name: 'Carolina Romero',
    role: 'Full-Stack Dev',
    image: carolinaImg,
    contributions: [
      'Unificar los estilos de botones en el componente button.',
      'Creación de un plan inicial de refactorización (Beta 0.2.0).'
    ],
    social: {
      linkedin: 'https://www.linkedin.com/in/carolina-romero-c/',
      github: 'https://github.com/Carol-88'
    }
  }
]

const AboutUs: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12 }}>
      {/* HERO SECTION - Updated to Secondary Variant */}
      <HeroSection
        title='Conoce al Equipo'
        subtitle='Las mentes detrás de CybESphere. Un grupo de profesionales apasionados por la ciberseguridad y el desarrollo tecnológico, unidos para fortalecer la comunidad.'
        variant='secondary'
      />

      {/* TEAM GRID (MIEMBROS) */}

      {/* TEAM GRID (MIEMBROS) */}
      <Container maxWidth='lg'>
        <Grid container spacing={4} justifyContent='center'>
          {TEAM_MEMBERS.map((member, index) => (
            <Grid size={{ xs: 12, md: 5 }} key={member.name}>
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
                    sx={{ pt: 10, px: 4, pb: 4, textAlign: 'center' }}
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
                        rel='noopener noreferrer'
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
                        rel='noopener noreferrer'
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

        {/* SECTION DIVIDER */}
        <Box sx={{ py: 8 }}>
          <Box
            sx={{
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, #E2E8F0, transparent)'
            }}
          />
        </Box>

        {/* COLLABORATORS SECTION */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant='h4'
            fontWeight='900'
            textAlign='center'
            sx={{ mb: 1, color: 'var(--Gray-900)' }}
          >
            Nuestros Colaboradores
          </Typography>
          <Typography
            textAlign='center'
            color='text.secondary'
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Personas talentosas que han aportado su granito de arena para hacer
            crecer CybESphere.
          </Typography>

          <Grid container spacing={3} justifyContent='center'>
            {COLLABORATORS.map((collab, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 5 }} key={collab.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CollaboratorCard {...collab} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* JOIN US CTA (Dual Path) */}
        <JoinTeamCTA />
      </Container>
    </Box>
  )
}

export default AboutUs
