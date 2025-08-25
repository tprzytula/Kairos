import { styled } from "@mui/system";
import { Card, CardActionArea, CardContent, CardProps } from '@mui/material'

export const Container = styled(({ isSelected, ...props }: { isSelected: boolean } & CardProps) => (
  <Card {...props} />
))(({ isSelected, theme }: { isSelected: boolean } & any) => ({
  display: 'flex',
  borderRadius: '14px',
  minHeight: '64px',
  margin: '2px 0',
  width: '100%',
  justifyContent: 'flex-start',
  boxSizing: 'border-box',
  opacity: isSelected ? 0.7 : 1,
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  boxShadow: isSelected 
    ? '0 8px 28px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1)'
    : '0 3px 16px rgba(0, 0, 0, 0.08), 0 1px 6px rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme?.palette?.divider || 'rgba(0, 0, 0, 0.06)'}`,
  backgroundColor: theme?.palette?.background?.paper || '#ffffff',
  background: `linear-gradient(145deg, ${theme?.palette?.background?.paper || '#ffffff'}, ${theme?.palette?.background?.default || '#fafafa'})`,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.005)',
    boxShadow: '0 10px 32px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.08)',
    borderColor: theme?.palette?.primary?.light || '#e3f2fd',
  },
  ...(isSelected ? {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${theme?.palette?.primary?.main || '#667eea'}, ${theme?.palette?.secondary?.main || '#764ba2'})`,
      opacity: 1,
      transition: 'opacity 300ms ease-in-out',
    },
  } : {}),
  '&::after': isSelected ? {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    height: '3px',
    backgroundColor: theme?.palette?.text?.secondary || '#6b7280',
    borderRadius: '2px',
    opacity: 0.8,
  } : {},
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

export const Content = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'left',
  flexGrow: '1',
  padding: '16px 18px',
  gap: '8px',
  borderRadius: '14px',
  background: 'transparent',
  height: '100%',
  minHeight: '64px',
  '&:last-child': {
    paddingBottom: '16px',
  },
}))

export const Name = styled('div')(({ theme }) => ({
  fontSize: '17px',
  fontWeight: 600,
  color: theme?.palette?.text?.primary || '#1a1a1a',
  letterSpacing: '-0.3px',
  lineHeight: '1.25',
  transition: 'color 300ms ease-in-out',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  maxWidth: '100%',
  marginBottom: '3px',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}))

export const Description = styled('div')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: theme?.palette?.text?.secondary || '#6b7280',
  lineHeight: '1.45',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  maxWidth: '100%',
  opacity: 0.85,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  flex: 1,
}))

export const DueDate = styled('div')(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: theme?.palette?.text?.secondary || '#6b7280',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '6px',
  padding: '6px 10px',
  backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)',
  borderRadius: '10px',
  alignSelf: 'flex-start',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  letterSpacing: '0.1px',
  border: `1px solid ${theme?.palette?.divider || 'rgba(0, 0, 0, 0.08)'}`,
  transition: 'all 200ms ease-in-out',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
  '&::before': {
    content: '"📅"',
    fontSize: '13px',
    lineHeight: 1,
  },
}))
