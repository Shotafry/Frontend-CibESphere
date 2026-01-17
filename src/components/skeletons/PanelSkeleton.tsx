import React from 'react'
import { Box, Container, Skeleton, Paper, Grid } from '@mui/material'

export const PanelSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 8 }}>
      {/* Header Skeleton */}
      <Box
        sx={{ height: 300, bgcolor: 'var(--Gray-300)', mb: { xs: 2, md: 6 } }}
      >
        <Container maxWidth='xl' sx={{ pt: 10 }}>
          <Skeleton variant='circular' width={64} height={64} sx={{ mb: 2 }} />
          <Skeleton variant='text' height={60} width='40%' />
        </Container>
      </Box>

      {/* Main Content Skeleton */}
      <Container maxWidth='xl' sx={{ mt: -10 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            minHeight: '600px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: 'white'
          }}
        >
          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', md: 280 },
              p: 3,
              borderRight: '1px solid #f1f5f9'
            }}
          >
            <Skeleton variant='text' width='50%' sx={{ mb: 4 }} />
            <Skeleton variant='rounded' height={48} sx={{ mb: 2 }} />
            <Skeleton variant='rounded' height={48} sx={{ mb: 2 }} />
            <Skeleton variant='rounded' height={48} sx={{ mb: 2 }} />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, p: 5 }}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Skeleton
                    variant='rectangular'
                    height={120}
                    sx={{ borderRadius: '20px' }}
                  />
                </Grid>
              ))}
            </Grid>
            <Skeleton
              variant='rectangular'
              height={400}
              sx={{ borderRadius: '20px' }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
