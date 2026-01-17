import React from 'react'
import { Box, Container, Grid, Skeleton, Paper } from '@mui/material'

export const EventDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth='xl' sx={{ mt: 8, mb: 8, px: { xs: 2, md: 8 } }}>
      <Grid container spacing={8} justifyContent='center'>
        {/* Main Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              backgroundColor: 'var(--White)',
              borderRadius: '25px',
              p: { xs: 3, md: 6 },
              boxShadow: 'var(--shadow-drop)',
              overflow: 'hidden'
            }}
          >
            {/* Hero Skeleton */}
            <Skeleton
              variant='rectangular'
              width='100%'
              height={400}
              sx={{ borderRadius: '20px', mb: 4 }}
            />

            {/* Title & Info */}
            <Skeleton variant='text' height={60} width='80%' sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Skeleton variant='rounded' width={100} height={32} />
              <Skeleton variant='rounded' width={100} height={32} />
            </Box>

            {/* Description */}
            <Skeleton variant='text' height={20} />
            <Skeleton variant='text' height={20} />
            <Skeleton variant='text' height={20} width='60%' />

            {/* Tabs / Itinerary */}
            <Box sx={{ mt: 6 }}>
              <Skeleton
                variant='rectangular'
                height={200}
                sx={{ borderRadius: '16px' }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Sidebar Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Paper sx={{ p: 4, borderRadius: '25px', height: 500 }}>
              <Skeleton variant='text' height={40} width='50%' sx={{ mb: 3 }} />
              <Skeleton
                variant='rectangular'
                height={100}
                sx={{ mb: 3, borderRadius: '12px' }}
              />
              <Skeleton
                variant='rectangular'
                height={50}
                sx={{ borderRadius: '25px' }}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
