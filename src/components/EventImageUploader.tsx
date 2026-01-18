// src/components/EventImageUploader.tsx
import React, { useRef, useState } from 'react'
import { Box, Typography, CircularProgress, IconButton } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import { uploadImage } from '../services/api/auth.service'

interface EventImageUploaderProps {
  imageUrl: string | null
  onImageChange: (url: string | null) => void
  disabled?: boolean
}

export const EventImageUploader: React.FC<EventImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes')
      return
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const url = await uploadImage(file, 'event')
      onImageChange(url)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onImageChange(null)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant='body2'
        sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}
      >
        Imagen del Evento
      </Typography>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Upload area or preview */}
      <Box
        onClick={handleClick}
        sx={{
          width: '100%',
          height: 200,
          borderRadius: '12px',
          border: imageUrl ? 'none' : '2px dashed #ccc',
          backgroundColor: imageUrl ? 'transparent' : '#F3F6F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'default' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: disabled ? '#ccc' : 'var(--color-cadetblue)',
            backgroundColor: imageUrl ? 'transparent' : '#EBEEF2'
          }
        }}
      >
        {uploading ? (
          <CircularProgress />
        ) : imageUrl ? (
          <>
            <Box
              component='img'
              src={imageUrl}
              alt='Event preview'
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Overlay with remove button */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 }
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: '#fff' }
                }}
              >
                <DeleteIcon color='error' />
              </IconButton>
            </Box>
          </>
        ) : (
          <>
            <CloudUploadIcon
              sx={{ fontSize: 48, color: 'var(--color-cadetblue)', mb: 1 }}
            />
            <Typography variant='body2' color='text.secondary'>
              Haz clic para subir una imagen
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              JPG, PNG o WebP (máx. 5MB)
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Typography
          variant='caption'
          color='error'
          sx={{ mt: 1, display: 'block' }}
        >
          {error}
        </Typography>
      )}
    </Box>
  )
}
