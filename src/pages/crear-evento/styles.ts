export const commonInputSx = {
  '& .MuiFilledInput-root': {
    backgroundColor: '#F3F6F9',
    borderRadius: '12px',
    border: '1px solid transparent',
    transition: 'all 0.2s',
    '&:hover': { backgroundColor: '#EBEEF2' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      borderColor: 'var(--color-cadetblue)',
      boxShadow: '0 0 0 4px rgba(79, 186, 200, 0.1)'
    },
    '&:before, &:after': { display: 'none' }
  }
}
