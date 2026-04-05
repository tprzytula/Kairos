import { styled } from '@mui/system'
import { Card, CardActionArea, CardContent } from '@mui/material'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'

export const Container = styled(Card)(({ theme }) => ({
  display: 'flex',
  borderRadius: '14px',
  minHeight: '64px',
  margin: '2px 0',
  width: '100%',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: '0 3px 16px rgba(0, 0, 0, 0.08), 0 1px 6px rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme?.palette?.divider || 'rgba(0, 0, 0, 0.06)'}`,
  backgroundColor: theme?.palette?.background?.paper || '#ffffff',
  background: `linear-gradient(145deg, ${theme?.palette?.background?.paper || '#ffffff'}, ${theme?.palette?.background?.default || '#fafafa'})`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(180deg, #06b6d4, #0891b2)',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.005)',
    boxShadow: '0 10px 32px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.08)',
    borderColor: theme?.palette?.primary?.light || '#e3f2fd',
  },
}))

export const ActionArea = styled(CardActionArea)({
  display: 'flex',
  padding: '0',
  borderRadius: '14px',
  height: '100%',
  '&:hover .MuiCardActionArea-focusHighlight': {
    opacity: 0,
  },
})

export const Content = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'left',
  flexGrow: 1,
  padding: '16px 18px',
  gap: '4px',
  borderRadius: '14px',
  background: 'transparent',
  height: '100%',
  minHeight: '64px',
  '&:last-child': {
    paddingBottom: '16px',
  },
})

export const Name = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '17px',
  fontWeight: 600,
  color: theme?.palette?.text?.primary || '#1a1a1a',
  letterSpacing: '-0.3px',
  lineHeight: '1.25',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  maxWidth: '100%',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}))

export const DetailRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 400,
  color: theme?.palette?.text?.secondary || '#6b7280',
  lineHeight: '1.4',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}))

export const AdventureIcon = styled(ExploreOutlinedIcon)({
  fontSize: '18px',
  color: '#06b6d4',
})
