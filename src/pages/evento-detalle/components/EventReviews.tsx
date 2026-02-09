import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  Popover
} from '@mui/material'
import { Link } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { Review } from '../../../types'

interface EventReviewsProps {
  reviews: Review[]
}

export const EventReviews: React.FC<EventReviewsProps> = ({ reviews }) => {
  // Popover Logic
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [popoverUser, setPopoverUser] = useState<{
    name: string
    avatar?: string
    quote?: string
    id: string
  } | null>(null)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: any
  ) => {
    setAnchorEl(event.currentTarget)
    setPopoverUser(user)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setPopoverUser(null)
  }

  const open = Boolean(anchorEl)

  const renderStars = (rating: number) => {
    return (
      <Box sx={{ display: 'flex' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return (
              <StarIcon key={star} sx={{ color: '#faaf00', fontSize: 20 }} />
            )
          } else if (rating >= star - 0.5) {
            return (
              <StarHalfIcon
                key={star}
                sx={{ color: '#faaf00', fontSize: 20 }}
              />
            )
          } else {
            return (
              <StarOutlineIcon
                key={star}
                sx={{ color: '#faaf00', fontSize: 20 }}
              />
            )
          }
        })}
      </Box>
    )
  }

  if (reviews.length === 0) return null

  return (
    <>
      <Divider sx={{ my: 4, borderColor: 'var(--Gray-300)' }} />
      <Box>
        <Typography
          variant='h4'
          fontWeight='bold'
          gutterBottom
          sx={{ color: 'var(--color-cadetblue)', mb: 3 }}
        >
          Reseñas y Opiniones
        </Typography>
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Paper
              key={review.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer'
                  }}
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup='true'
                  onMouseEnter={(e) =>
                    handlePopoverOpen(e, {
                      name: review.userName,
                      avatar: review.userAvatar,
                      quote: review.userQuote,
                      id: review.userId
                    })
                  }
                  onMouseLeave={handlePopoverClose}
                >
                  <Link
                    to={`/u/${review.userSlug || review.userId}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <Avatar
                      src={review.userAvatar}
                      sx={{ bgcolor: 'var(--color-cadetblue)' }}
                    >
                      {review.userName?.[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography
                        fontWeight='bold' // Keeping bold
                        sx={{
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {review.userName}
                      </Typography>
                      {(review.userCompany || review.userPosition) && (
                        <Typography
                          variant='caption'
                          sx={{
                            color: 'var(--color-cadetblue)',
                            fontWeight: 600,
                            display: 'block',
                            mt: 0.5
                          }}
                        >
                          {[review.userPosition, review.userCompany]
                            .filter(Boolean)
                            .join(' | ')}
                        </Typography>
                      )}
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
                {renderStars(review.rating)}
              </Box>
              <Typography variant='body1' color='var(--Gray-700)'>
                {review.comment}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Popover
          id='mouse-over-popover'
          sx={{ pointerEvents: 'none' }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {popoverUser && (
            <Box sx={{ p: 2, maxWidth: 300 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}
              >
                <Avatar src={popoverUser.avatar} />
                <Typography fontWeight='bold'>{popoverUser.name}</Typography>
              </Box>
              {popoverUser.quote && (
                <Typography variant='body2' fontStyle='italic'>
                  "{popoverUser.quote}"
                </Typography>
              )}
            </Box>
          )}
        </Popover>
      </Box>
    </>
  )
}
