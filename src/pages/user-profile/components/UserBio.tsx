import React from 'react'
import { Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'

interface UserBioProps {
  bio?: string
}

export const UserBio: React.FC<UserBioProps> = ({ bio }) => {
  if (!bio) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          background: 'white'
        }}
      >
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          Sobre mí
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
        >
          {bio}
        </Typography>
      </Paper>
    </motion.div>
  )
}
