import React from 'react'
import {
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Stack,
  CircularProgress,
  Divider
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'

import {
  useWatch,
  Control,
  FieldErrors,
  UseFormHandleSubmit
} from 'react-hook-form'
import { OrganizationResponse, User } from '../../../types'
import { Button } from '../../../components/Button'

// Import Sub-Sections
import { ProfileHeaderPreview } from './form-sections/ProfileHeaderPreview'
import { GeneralInfoSection } from './form-sections/GeneralInfoSection'
import { ContactInfoSection } from './form-sections/ContactInfoSection'
import { VisualAssetsSection } from './form-sections/VisualAssetsSection'
import { SocialMediaSection } from './form-sections/SocialMediaSection'

interface OrgProfileFormProps {
  user: User | null
  control: Control<OrganizationResponse>
  errors: FieldErrors<OrganizationResponse>
  isSaving: boolean
  handleSubmit: UseFormHandleSubmit<OrganizationResponse>
  onSaveProfile: (data: OrganizationResponse) => Promise<void>
  saveMessage: { type: 'success' | 'error'; text: string } | null
}

export const OrgProfileForm: React.FC<OrgProfileFormProps> = ({
  user,
  control,
  errors,
  isSaving,
  handleSubmit,
  onSaveProfile,
  saveMessage
}) => {
  // Watch fields for live preview
  const watchedBanner = useWatch({ control, name: 'banner_url' })
  const watchedLogo = useWatch({ control, name: 'logo_url' })
  const watchedName = useWatch({ control, name: 'name' })
  const watchedCity = useWatch({ control, name: 'city' })

  const bannerUrl =
    watchedBanner ||
    user?.organization?.banner_url ||
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'
  const logoUrl =
    watchedLogo || user?.organization?.logo_url || '/default-logo.png'

  return (
    <Box component='form' onSubmit={handleSubmit(onSaveProfile)}>
      {/* 1. HEADER PREVIEW (Immersive) */}
      <ProfileHeaderPreview
        bannerUrl={bannerUrl}
        logoUrl={logoUrl}
        name={watchedName || ''}
        city={watchedCity || ''}
      />

      {saveMessage && (
        <Alert severity={saveMessage.type} sx={{ mb: 4, borderRadius: '12px' }}>
          {saveMessage.text}
        </Alert>
      )}

      {/* 2. FORM GRID */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN: MAIN INFO & CONTACT */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              height: '100%'
            }}
          >
            <Stack spacing={3}>
              <GeneralInfoSection
                control={control}
                errors={errors}
                user={user}
              />

              <Divider sx={{ my: 4 }} />

              <ContactInfoSection control={control} errors={errors} />
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: ASSETS & SOCIAL */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            <VisualAssetsSection control={control} />

            <SocialMediaSection control={control} />

            {/* Save Button */}
            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  <SaveIcon />
                )
              }
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
