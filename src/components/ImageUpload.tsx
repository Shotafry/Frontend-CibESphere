import React, { useRef, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { Button } from './Button'
import { uploadImage } from '../services/apiService'

interface ImageUploadProps {
  currentUrl?: string
  onUpload: (url: string) => void
  label: string
  altText: string
  isBanner?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentUrl,
  onUpload,
  label,
  altText,
  isBanner = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null) // Reset error

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes (JPG, PNG, WebP).')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande. Máximo 5MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setIsLoading(true)
    try {
      const type = isBanner ? 'banner' : 'avatar'
      const url = await uploadImage(file, type)
      onUpload(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Error al subir la imagen. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
      // Clear input so same file can be selected again if needed (though usually successful upload clears need not apply, but here we don't clear on success to avoid clearing the preview prematurely if logic relied on it, but usually standard practice)
      // Actually, if we clear it, we can re-upload the same file if something went wrong elsewhere.
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        width: '100%'
      }}
    >
      <Typography variant='subtitle1' fontWeight='bold'>
        {label}
      </Typography>

      <Box
        sx={{
          width: isBanner ? '100%' : 150,
          height: isBanner ? 200 : 150,
          borderRadius: isBanner ? 2 : '50%',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3,
          border: '2px solid white'
        }}
      >
        {currentUrl ? (
          <Box
            component='img'
            src={currentUrl}
            alt={altText}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <Typography color='text.secondary'>Sin Imagen</Typography>
        )}

        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/png, image/jpeg, image/webp'
        style={{ display: 'none' }}
      />

      <Button
        variant='secondary'
        onClick={handleClick}
        disabled={isLoading}
        size='small'
      >
        {isLoading ? 'Subiendo...' : 'Cambiar Imagen'}
      </Button>

      {error && (
        <Typography variant='caption' color='error'>
          {error}
        </Typography>
      )}
    </Box>
  )
}
