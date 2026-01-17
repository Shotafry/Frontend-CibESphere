import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Button as MuiButton,
  Avatar
} from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { User } from '../../../types'
import { uploadImage } from '../../../services/apiService'
import { Button } from '../../../components/Button'

interface BadgeUploaderProps {
  control: Control<User>
}

export const BadgeUploader: React.FC<BadgeUploaderProps> = ({ control }) => {
  return (
    <Paper sx={{ p: 4, borderRadius: '24px', mt: 3 }}>
      <Typography variant='h6' fontWeight='bold' mb={2}>
        Certificaciones y Badges
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={3}>
        Sube hasta 10 imágenes de tus certificaciones. Aparecerán como iconos
        circulares en tu perfil público.
      </Typography>
      <Controller
        name='badges'
        control={control}
        render={({ field: { value, onChange } }) => {
          // Parse badges JSON
          let badgeList: Array<{
            id: string
            url: string
            name: string
          }> = []
          try {
            if (value) {
              badgeList = JSON.parse(value as string)
            }
          } catch {
            badgeList = []
          }

          const handleAddBadge = async (file: File) => {
            if (badgeList.length >= 10) {
              alert('Máximo 10 badges permitidos')
              return
            }
            try {
              const url = await uploadImage(file, 'badge')
              const newBadge = {
                id: Date.now().toString(),
                url,
                name: file.name.replace(/\.[^/.]+$/, '')
              }
              const updated = [...badgeList, newBadge]
              onChange(JSON.stringify(updated))
            } catch (error) {
              console.error('Error uploading badge:', error)
              alert('Error al subir el badge')
            }
          }

          const handleRemoveBadge = (id: string) => {
            const updated = badgeList.filter((b) => b.id !== id)
            onChange(JSON.stringify(updated))
          }

          return (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 3
                }}
              >
                {badgeList.map((badge) => (
                  <Box
                    key={badge.id}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80
                    }}
                  >
                    <Avatar
                      src={badge.url}
                      alt={badge.name}
                      sx={{
                        width: 80,
                        height: 80,
                        border: '2px solid #E2E8F0'
                      }}
                    />
                    <Box
                      onClick={() => handleRemoveBadge(badge.id)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'error.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      ×
                    </Box>
                    <Typography
                      variant='caption'
                      sx={{
                        display: 'block',
                        textAlign: 'center',
                        mt: 0.5,
                        maxWidth: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {badge.name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {badgeList.length < 10 && (
                <Box>
                  <input
                    type='file'
                    id='badge-upload'
                    accept='image/png, image/jpeg, image/webp'
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleAddBadge(file)
                        e.target.value = ''
                      }
                    }}
                  />
                  <label htmlFor='badge-upload'>
                    <Button
                      variant='secondary'
                      size='small'
                      onClick={() =>
                        document.getElementById('badge-upload')?.click()
                      }
                    >
                      + Añadir Badge ({badgeList.length}/10)
                    </Button>
                  </label>
                </Box>
              )}
            </Box>
          )
        }}
      />
    </Paper>
  )
}
