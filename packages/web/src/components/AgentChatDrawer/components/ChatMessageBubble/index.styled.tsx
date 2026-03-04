import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const BubbleWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAgent',
})<{ isAgent?: boolean }>(({ isAgent }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: isAgent ? 'flex-start' : 'flex-end',
}))

export const BubbleRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAgent',
})<{ isAgent?: boolean }>(({ isAgent }) => ({
  display: 'flex',
  flexDirection: isAgent ? 'row' : 'row-reverse',
  alignItems: 'flex-end',
  gap: '8px',
  maxWidth: '80%',
}))

export const AgentAvatar = styled(Box)(({ theme }) => ({
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

export const Bubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isAgent',
})<{ isAgent?: boolean }>(({ theme, isAgent }) => ({
  background: isAgent
    ? theme.palette.grey[100]
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: isAgent ? theme.palette.text.primary : 'white',
  padding: '0.6rem 0.9rem',
  borderRadius: isAgent ? '4px 12px 12px 12px' : '12px 12px 4px 12px',
  wordBreak: 'break-word',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  boxShadow: isAgent ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
}))

export const BubbleTimestamp = styled('span', {
  shouldForwardProp: (prop) => prop !== 'isAgent',
})<{ isAgent?: boolean }>(({ theme, isAgent }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  marginTop: '0.25rem',
  textAlign: isAgent ? 'left' : 'right',
  paddingLeft: isAgent ? '36px' : 0,
}))
