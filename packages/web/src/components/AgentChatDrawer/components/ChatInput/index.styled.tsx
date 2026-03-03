import { styled } from '@mui/material/styles'
import { Box, IconButton } from '@mui/material'

export const ChatInputContainer = styled(Box)({
  padding: '0.75rem 1.25rem',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  display: 'flex',
  alignItems: 'flex-end',
  gap: '0.5rem',
  flexShrink: 0,
})

export const SendButton = styled(IconButton)<{ active?: string }>(({ active }) => ({
  width: '2.5rem',
  height: '2.5rem',
  flexShrink: 0,
  background:
    active === 'true'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(0, 0, 0, 0.06)',
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    color: active === 'true' ? 'white' : 'rgba(0,0,0,0.3)',
  },
  '&:hover': {
    background:
      active === 'true'
        ? 'linear-gradient(135deg, #5a6fd6 0%, #6a3d8f 100%)'
        : 'rgba(0, 0, 0, 0.08)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 0, 0, 0.06)',
  },
}))
