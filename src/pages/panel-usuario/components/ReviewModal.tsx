import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Rating,
  TextField
} from '@mui/material'
import { Button } from '../../../components/Button'
import { Event, User } from '../../../types'
import { createReview, getEventReviews } from '../../../services/apiService'

interface ReviewModalProps {
  open: boolean
  onClose: () => void
  event: Event | null
  user: User | null
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  event,
  user,
  onSuccess,
  onError
}) => {
  const [reviewRating, setReviewRating] = useState<number | null>(5)
  const [reviewComment, setReviewComment] = useState('')
  const [internalMessage, setInternalMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setReviewRating(5)
      setReviewComment('')
      setInternalMessage(null)
      checkExistingReview()
    }
  }, [open, event])

  const checkExistingReview = async () => {
    if (!event || !user) return
    try {
      const existingReviews = await getEventReviews(event.id)
      const userReview = existingReviews.find((r) => r.userId === user.id)
      if (userReview) {
        setInternalMessage({
          type: 'error',
          text: 'Ya has escrito una reseña para este evento. Solo se permite una por usuario.'
        })
      }
    } catch (error) {
      console.error('Error checking reviews:', error)
    }
  }

  const handleSubmitReview = async () => {
    if (!event || !user) return

    // Validate if user already reviewed (double check) based on local state if needed,
    // but the backend should also enforce it.
    if (internalMessage?.type === 'error') return

    try {
      await createReview({
        eventId: event.id,
        userId: user.id,
        userName: user.first_name + ' ' + user.last_name,
        userAvatar: user.avatar_url,
        userCompany: user.employer,
        userPosition: user.position,
        userQuote: (user as any).personal_quote,
        rating: reviewRating || 5,
        comment: reviewComment
      })
      onSuccess('Reseña enviada correctamente')
      onClose()
    } catch (error: any) {
      console.error('Error submitting review:', error)
      if (error.response?.status === 409) {
        const msg = 'Ya has enviado una reseña para este evento.'
        setInternalMessage({ type: 'error', text: msg })
        onError(msg)
      } else {
        const msg = 'Error al enviar la reseña'
        setInternalMessage({ type: 'error', text: msg })
        onError(msg)
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Escribir Reseña</DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Comparte tu experiencia en {event?.title}
        </Typography>

        {internalMessage && (
          <Alert severity={internalMessage.type} sx={{ mb: 2 }}>
            {internalMessage.text}
          </Alert>
        )}

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography component='legend'>Valoración:</Typography>
          <Rating
            value={reviewRating}
            onChange={(e, n) => setReviewRating(n)}
          />
        </Box>
        <TextField
          autoFocus
          margin='dense'
          label='Tu comentario'
          fullWidth
          multiline
          rows={4}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          disabled={internalMessage?.type === 'error'}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant='secondary'>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmitReview}
          variant='primary'
          disabled={internalMessage?.type === 'error'}
        >
          Enviar Reseña
        </Button>
      </DialogActions>
    </Dialog>
  )
}
