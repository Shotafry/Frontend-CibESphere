import React from 'react'
import { Box } from '@mui/material'

interface OrgHeroProps {
  bannerUrl?: string
}

export const OrgHero: React.FC<OrgHeroProps> = ({ bannerUrl }) => {
  return (
    <Box
      sx={{
        height: { xs: 200, md: 350 },
        width: '100%',
        backgroundImage: `url(${bannerUrl || '/default-banner.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
        }
      }}
    />
  )
}
