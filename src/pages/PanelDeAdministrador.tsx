// src/pages/PanelDeAdministrador.tsx
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Stack
} from '@mui/material'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { AdminStats } from '../types'
import {
  DashboardTab,
  OrganizationsTab,
  UsersTab,
  LogsTab,
  ScraperTab // v2.0 - Scraper admin
} from './panel-administrador'

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import VerifiedIcon from '@mui/icons-material/Verified'
import HistoryIcon from '@mui/icons-material/History'
import CodeIcon from '@mui/icons-material/Code' // v2.0 - Scraper

interface AdminLoaderData {
  stats: AdminStats
}

// Tab mapping for URL persistence
const TAB_MAPPING: { [key: number]: string } = {
  0: 'dashboard',
  1: 'organizations',
  2: 'users',
  3: 'logs',
  4: 'scraper' // v2.0
}

const REVERSE_TAB_MAPPING: { [key: string]: number } = {
  dashboard: 0,
  organizations: 1,
  users: 2,
  logs: 3,
  scraper: 4 // v2.0
}

const PanelDeAdministrador: React.FC = () => {
  const { stats } = useLoaderData() as AdminLoaderData
  const [searchParams, setSearchParams] = useSearchParams()

  // Get current tab from URL or default to 0 (dashboard)
  const currentTabSlug = searchParams.get('tab') || 'dashboard'
  const currentTab = REVERSE_TAB_MAPPING[currentTabSlug] ?? 0

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Update URL with new tab
    setSearchParams({ tab: TAB_MAPPING[newValue] })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        pb: 8,
        overflow: 'hidden',
        maxWidth: '100vw',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Premium - Updated to Secondary Hero Style */}
      <Box
        sx={{
          background: 'var(--gradient-hero-secondary)',
          color: 'white',
          pt: { xs: 8, md: 10 },
          pb: { xs: 10, md: 12 },
          clipPath: {
            xs: 'none',
            md: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)'
          },
          mb: { xs: 2, md: 6 },
          position: 'relative'
        }}
      >
        <Container maxWidth='xl' sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            mb={2}
          >
            <VerifiedIcon
              sx={{
                fontSize: { xs: 30, md: 40 },
                opacity: 0.8,
                color: 'white'
              }}
            />
            <Typography
              variant='h3'
              fontWeight='900'
              sx={{
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                color: 'white'
              }}
            >
              Panel de Control
            </Typography>
          </Stack>
          <Typography
            variant='h6'
            sx={{
              opacity: 0.9,
              maxWidth: '600px',
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              color: 'white'
            }}
          >
            Bienvenido, Administrador. Aquí tienes el control total sobre
            usuarios, organizaciones y eventos de CybESphere.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth='xl' sx={{ mt: -10 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            bgcolor: 'white',
            minHeight: '600px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            position: 'relative', // Fix overlap
            zIndex: 100 // Ensure it sits above the Hero
          }}
        >
          {/* Sidebar Navigation (Desktop) / Tabs (Mobile) */}
          <Box
            sx={{
              width: { xs: '100%', md: 280 },
              borderRight: { xs: 'none', md: '1px solid #f1f5f9' },
              borderBottom: { xs: '1px solid #f1f5f9', md: 'none' },
              bgcolor: '#fff',
              p: 2
            }}
          >
            <Typography
              variant='overline'
              fontWeight='bold'
              sx={{ px: 2, color: 'text.secondary', letterSpacing: 1 }}
            >
              Menu
            </Typography>
            <Tabs
              orientation={window.innerWidth >= 900 ? 'vertical' : 'horizontal'}
              value={currentTab}
              onChange={handleTabChange}
              variant='scrollable'
              scrollButtons={false}
              sx={{
                mt: 2,
                '& .MuiTab-root': {
                  justifyContent: 'flex-start',
                  minHeight: 48,
                  borderRadius: '12px',
                  mb: 1,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    color: 'var(--color-cadetblue)'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'var(--color-cadetblue)',
                    color: 'white'
                  }
                },
                '& .MuiTabs-indicator': {
                  display: 'none' // Hide default indicator for "button" look
                }
              }}
            >
              <Tab
                icon={<DashboardIcon />}
                iconPosition='start'
                label='Dashboard'
              />
              <Tab
                icon={<BusinessIcon />}
                iconPosition='start'
                label='Organizaciones'
              />
              <Tab
                icon={<PeopleIcon />}
                iconPosition='start'
                label='Usuarios'
              />
              <Tab
                icon={<HistoryIcon />}
                iconPosition='start'
                label='Logs'
              />
              <Tab
                icon={<CodeIcon />}
                iconPosition='start'
                label='Scraper'
              />
            </Tabs>
          </Box>

          {/* Tab Content Area */}
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, bgcolor: '#fff' }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ width: '100%', minHeight: '100%' }}
              >
                {currentTab === 0 && <DashboardTab stats={stats} />}
                {currentTab === 1 && <OrganizationsTab />}
                {currentTab === 2 && <UsersTab />}
                {currentTab === 3 && <LogsTab />}
                {currentTab === 4 && <ScraperTab />}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PanelDeAdministrador
