import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  gap: '1rem',
  flex: 1,
  minHeight: 0,
})

export const ScrollableContainer = styled(Box)({
  flex: 1,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: '0 0.5rem',
  margin: '0 -0.5rem',
  minHeight: 0,
})

export const FormContainer = styled(Box)({
  padding: '0 0.5rem',
})
