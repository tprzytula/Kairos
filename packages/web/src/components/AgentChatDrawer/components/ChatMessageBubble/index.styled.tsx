import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const BubbleWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const Bubble = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '0.6rem 0.9rem',
  borderRadius: '12px 12px 4px 12px',
  maxWidth: '80%',
  wordBreak: 'break-word',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
})

export const BubbleTimestamp = styled('span')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  marginTop: '0.25rem',
  textAlign: 'right',
}))
