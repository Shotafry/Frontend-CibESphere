import React from 'react'
import { Box, Skeleton, Grid, Paper } from '@mui/material'

export const EventCardSkeleton: React.FC = () => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: 'white',
          height: '100%',
          border: '1px solid #e2e8f0'
        }}
      >
        <Skeleton variant='rectangular' width='100%' height={200} />
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant='rounded' width={80} height={24} />
            <Skeleton variant='rounded' width={60} height={24} />
          </Box>
          <Skeleton variant='text' height={32} width='90%' sx={{ mb: 1 }} />
          <Skeleton variant='text' height={20} width='60%' sx={{ mb: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant='circular' width={32} height={32} />
              <Box>
                <Skeleton variant='text' width={80} height={16} />
                <Skeleton variant='text' width={50} height={12} />
              </Box>
            </Box>
            <Skeleton variant='rounded' width={40} height={40} />
          </Box>
        </Box>
      </Paper>
    </Grid>
  )
}
