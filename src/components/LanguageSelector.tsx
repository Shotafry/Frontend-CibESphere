import React from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, MenuItem, Typography, Box } from '@mui/material'
import { Button } from './Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (lang?: string) => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
    setAnchorEl(null)
  }

  const currentLang = i18n.language.split('-')[0].toUpperCase()

  return (
    <Box>
      <Button
        variant='text'
        onClick={handleClick}
        endIcon={
          <ExpandMoreIcon
            sx={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: '0.3s',
              fontSize: '1rem'
            }}
          />
        }
      >
        <Typography variant='body2' fontWeight={700}>
          {currentLang}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '12px',
            mt: 1,
            minWidth: 120,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => handleClose('es')}
          selected={currentLang === 'ES'}
          sx={{
            fontWeight: currentLang === 'ES' ? 700 : 400,
            fontSize: '0.9rem',
            py: 1
          }}
        >
          🇪🇸 Español
        </MenuItem>
        <MenuItem
          onClick={() => handleClose('en')}
          selected={currentLang === 'EN'}
          sx={{
            fontWeight: currentLang === 'EN' ? 700 : 400,
            fontSize: '0.9rem',
            py: 1
          }}
        >
          🇬🇧 English
        </MenuItem>
      </Menu>
    </Box>
  )
}
