import { styled } from '@mui/material/styles'
import { Box, Card, CardContent } from '@mui/material'

export const MiniCardsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto auto',
  gap: '0.875rem',
  width: '100%',
})

export const MiniCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '110px',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 1,
  },
  '&:active': {
    transform: 'scale(0.985)',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)',
  },
})

export const MiniCardContent = styled(CardContent)({
  padding: '0.875rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  '&:last-child': {
    paddingBottom: '0.875rem',
  },
})

export const MiniCardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  marginBottom: '0.25rem',
})

export const MiniCardIcon = styled('div')({
  '& .MuiSvgIcon-root': {
    fontSize: '0.85rem',
    padding: '0.2rem',
    borderRadius: '5px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'block',
  },
})

export const MiniCardTitle = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}))

export const MiniCardBody = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  overflow: 'hidden',
})

// Kept for backward compatibility with existing tests
export const CompactItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const MoreItemsIndicator = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(102, 126, 234, 0.02) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.12)',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    color: theme.palette.text.primary,
  },
}))
