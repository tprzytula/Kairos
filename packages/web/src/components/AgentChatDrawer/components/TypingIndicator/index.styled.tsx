import { styled, keyframes } from '@mui/material/styles'
import { Box } from '@mui/material'

const bounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
`

export const Wrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
})

export const Avatar = styled(Box)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: theme.palette.text.secondary,
}))

export const Bubble = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[100],
  borderRadius: '4px 12px 12px 12px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
}))

export const Dot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: number }>(({ delay }) => ({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: '#9e9e9e',
  animation: `${bounce} 1.2s ease-in-out infinite`,
  animationDelay: `${delay}ms`,
}))
