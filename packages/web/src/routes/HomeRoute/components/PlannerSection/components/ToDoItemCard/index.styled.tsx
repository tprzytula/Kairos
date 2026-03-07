import { styled } from '@mui/material/styles'

export const CompactItemText = styled('li')<{ $isExpanded?: boolean }>(({ theme, $isExpanded }) => ({
  fontSize: '0.8rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  padding: '0.75rem 1rem',
  background: $isExpanded 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(102, 126, 234, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  borderRadius: '12px',
  border: $isExpanded 
    ? `1px solid rgba(102, 126, 234, 0.2)`
    : `1px solid rgba(102, 126, 234, 0.08)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  cursor: 'pointer',
  lineHeight: 1.4,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  overflow: 'hidden',
  
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: $isExpanded ? 1 : 0,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  '&:after': $isExpanded ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.4) 30%, rgba(102, 126, 234, 0.6) 70%, transparent 100%)',
    opacity: 1,
  } : {},
  
  '&:hover': {
    backgroundColor: $isExpanded 
      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(102, 126, 234, 0.04) 100%)'
      : 'rgba(102, 126, 234, 0.04)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: $isExpanded
      ? '0 8px 24px rgba(102, 126, 234, 0.15)'
      : '0 4px 16px rgba(102, 126, 234, 0.1)',
  },
  
  '&:hover:before': {
    opacity: 1,
  },
  
  '&:active': {
    transform: $isExpanded ? 'translateY(-1px)' : 'translateY(-1px)',
  },
}))

export const CompactItemHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
})

export const CompactItemContent = styled('div')({
  flex: 1,
  minWidth: 0,
})

export const CompactItemMeta = styled('div')({
  marginLeft: '0.5rem',
  flexShrink: 0,
})

export const CompactDescription = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  marginTop: '0.15rem',
  lineHeight: 1.2,
}))

export const DueDateText = styled('span')(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  background: 'rgba(102, 126, 234, 0.08)',
  padding: '0.15rem 0.4rem',
  borderRadius: '6px',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  '&.overdue': {
    color: theme.palette.error.main,
    background: 'rgba(244, 67, 54, 0.1)',
  },
  '&.today': {
    color: theme.palette.warning.main,
    background: 'rgba(255, 152, 0, 0.1)',
  },
  '&.soon': {
    color: theme.palette.primary.main,
    background: 'rgba(102, 126, 234, 0.12)',
  },
}))

export const ExpandedToDoContent = styled('div')(({ theme }) => ({
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(102, 126, 234, 0.02)',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.08)'}`,
  position: 'relative',
  overflow: 'hidden',
  animation: 'expandIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
}))

export const ExpandedDescription = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  marginBottom: '1rem',
  padding: '0.75rem',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)'}`,
}))

export const ExpandedMetadata = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
}))

export const MetadataRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 0.75rem',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)'}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.05)',
    transform: 'translateX(2px)',
  },
}))

export const MetadataIcon = styled('div')(({ theme }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '0.75rem',
  flexShrink: 0,
  
  '& svg': {
    fontSize: '12px',
    color: 'white',
  },
}))

export const MetadataContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const MetadataLabel = styled('span')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}))

export const MetadataValue = styled('span')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}))

export const DueDateChip = styled('div')<{ $isOverdue?: boolean; $isToday?: boolean; $isSoon?: boolean }>(({ theme, $isOverdue, $isToday, $isSoon }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.375rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '600',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  
  ...$isOverdue && {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: theme.palette.error.main,
    border: `1px solid rgba(244, 67, 54, 0.2)`,
  },
  
  ...$isToday && {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    color: theme.palette.warning.main,
    border: `1px solid rgba(255, 152, 0, 0.2)`,
  },
  
  ...$isSoon && {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    color: theme.palette.primary.main,
    border: `1px solid rgba(102, 126, 234, 0.2)`,
  },
  
  ...(!$isOverdue && !$isToday && !$isSoon) && {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(102, 126, 234, 0.08)',
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
  },
  
  '& svg': {
    fontSize: '12px',
  },
}))
