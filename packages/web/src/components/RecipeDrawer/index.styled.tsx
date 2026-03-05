import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
})

export const DrawerHeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const DrawerIconBox = styled(Box)({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
  },
})

export const DrawerTitle = styled('span')({
  fontSize: '1.1rem',
  fontWeight: '700',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '0.3px',
})

export const ContentContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})
