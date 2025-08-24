import { styled } from '@mui/material/styles'
import { Box, Button, IconButton } from '@mui/material'

export const InviteDisplayContainer = styled(Box)({
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '8px',
  border: '1px solid #e2e8f0',
  position: 'relative',
})

export const InviteDisplayHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
})

export const InviteLabel = styled(Box)({
  fontSize: '12px',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const InviteCodeContainer = styled(Box)(({ compact }: { compact?: boolean }) => ({
  display: 'flex',
  gap: compact ? '6px' : '8px',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '12px',
}))

export const InviteCodeDigit = styled(Box)(({ compact }: { compact?: boolean }) => ({
  width: compact ? '28px' : '36px',
  height: compact ? '32px' : '40px',
  background: 'white',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Courier New, monospace',
  fontSize: compact ? '14px' : '16px',
  fontWeight: 700,
  color: '#1e293b',
  textTransform: 'uppercase',
  userSelect: 'none',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.8,
  },
}))

export const ActionsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
})

export const CopyButton = styled(Button)({
  minWidth: '80px',
  height: '32px',
  background: '#667eea',
  color: 'white',
  fontSize: '12px',
  fontWeight: 600,
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  border: 'none',
  '&:hover': {
    background: '#5a67d8',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  },
  '&.copied': {
    background: '#10b981',
    '&:hover': {
      background: '#059669',
    },
  },
})

export const ShareButtonsContainer = styled(Box)({
  display: 'flex',
  gap: '6px',
})

export const ShareButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'buttonColor',
})<{ buttonColor?: string }>(({ buttonColor }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: buttonColor || '#f1f5f9',
  color: 'white',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${buttonColor ? `${buttonColor}40` : 'rgba(0, 0, 0, 0.1)'}`,
  },
}))

export const QuickCopyText = styled(Box)({
  fontSize: '10px',
  color: '#64748b',
  textAlign: 'center',
  marginTop: '8px',
  opacity: 0.8,
})

export const CompactContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '12px',
  background: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
})

export const CompactActionsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  flexWrap: 'wrap',
})
