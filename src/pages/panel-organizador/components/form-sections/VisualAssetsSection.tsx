import React from 'react'
import { Box, Typography, Paper, Stack } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import { Control, Controller } from 'react-hook-form'
import { OrganizationResponse } from '../../../../types'
import { ImageUpload } from '../../../../components/ImageUpload'

interface VisualAssetsSectionProps {
  control: Control<OrganizationResponse>
}

export const VisualAssetsSection: React.FC<VisualAssetsSectionProps> = ({
  control
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ p: 4, borderRadius: '24px', border: '1px solid #E2E8F0' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <ImageIcon sx={{ color: 'var(--color-cadetblue)' }} />
        <Typography variant='h6' fontWeight='bold'>
          Recursos Visuales
        </Typography>
      </Box>
      <Stack spacing={3}>
        <Controller
          name='logo_url'
          control={control}
          render={({ field }) => (
            <ImageUpload
              currentUrl={field.value}
              onUpload={field.onChange}
              label='Logo'
              altText='Organization Logo'
              isBanner={false}
            />
          )}
        />
        <Controller
          name='banner_url'
          control={control}
          render={({ field }) => (
            <ImageUpload
              currentUrl={field.value}
              onUpload={field.onChange}
              label='Banner'
              altText='Organization Banner'
              isBanner={true}
            />
          )}
        />
      </Stack>
    </Paper>
  )
}
