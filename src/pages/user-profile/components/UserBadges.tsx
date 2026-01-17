import React from 'react'
import { Paper, Typography, Box, Tooltip, Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { PublicUserProfile } from '../../../types'

interface UserBadgesProps {
  user: PublicUserProfile
}

export const UserBadges: React.FC<UserBadgesProps> = ({ user }) => {
  let badgeList: Array<{
    id: string
    url: string
    name: string
  }> = []

  try {
    if ((user as any).badges) {
      badgeList = JSON.parse((user as any).badges)
    }
  } catch {
    badgeList = []
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          bgcolor: '#F8FAFC'
        }}
      >
        <Typography
          variant='subtitle2'
          fontWeight='bold'
          mb={2}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <EmojiEventsIcon sx={{ color: 'var(--color-cadetblue)' }} />
          Certificaciones
        </Typography>

        {badgeList.length === 0 ? (
          <Typography
            variant='caption'
            color='text.secondary'
            textAlign='center'
            display='block'
          >
            Este usuario aún no tiene certificaciones.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center'
            }}
          >
            {badgeList.map((badge) => (
              <Tooltip key={badge.id} title={badge.name}>
                <Avatar
                  src={badge.url}
                  alt={badge.name}
                  sx={{
                    width: 60,
                    height: 60,
                    border: '3px solid var(--color-cadetblue)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        )}
      </Paper>
    </motion.div>
  )
}
