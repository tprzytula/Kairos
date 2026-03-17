import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.875rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: '#f5f4f9'
})