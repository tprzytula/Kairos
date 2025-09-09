import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.6rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 50%, rgba(240, 147, 251, 0.02) 100%)'
})