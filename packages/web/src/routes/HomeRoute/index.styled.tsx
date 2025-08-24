import { styled } from '@mui/material/styles'
import { Card, CardContent, Typography, Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.6rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 50%, rgba(240, 147, 251, 0.02) 100%)'
})

export const FullWidthSection = styled(Box)({
  gridColumn: 'auto',
})

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)', // Safari support
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '120px', // Ensure consistent minimum height
  height: 'auto', // Allow natural height expansion
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)', // Remove scale for Safari compatibility
    '&:before': {
      opacity: 1,
    },
  },
}))

export const SectionHeader = styled('div')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  '& .header-content': {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    padding: '0.25rem',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  '& .item-count': {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: theme.palette.text.secondary,
    background: 'rgba(102, 126, 234, 0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    minWidth: '1.5rem',
    textAlign: 'center',
  },
}))

export const SectionContent = styled(CardContent)({
  padding: '1.25rem',
  flex: 1, // Ensure content expands to fill available space
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: '1.25rem',
  },
})

export const ItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const CompactItemList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
})

export const ItemText = styled('li')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  padding: '0.6rem 0.8rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  cursor: 'pointer',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 10px 10px 0',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    transform: 'translateX(2px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    '&:before': {
      opacity: 1,
    },
  },
}))

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
  
  // Left accent border
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
  
  // Top highlight for expanded state
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
  
  // Subtle gradient background
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)',
  },
  
  '@keyframes expandIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-8px) scale(0.98)',
      maxHeight: '0px',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
      maxHeight: '300px',
    },
  },
}))

export const ExpandedDescription = styled('div')(({ theme }) => ({
  fontSize: '0.9rem',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  marginBottom: '1rem',
  whiteSpace: 'pre-wrap',
  fontWeight: '400',
  letterSpacing: '0.01em',
  
  // Better text rendering
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
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
    fontSize: '14px',
  },
}))

export const EmptyState = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '0.75rem 0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px', // Ensure consistent minimum height
  flex: 1, // Allow to expand in flex container
  // Safari-specific alignment fixes
  WebkitAlignItems: 'center',
  WebkitJustifyContent: 'center',
}))

export const NoiseItem = styled('li')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  padding: '0.6rem 0.8rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  cursor: 'pointer',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 10px 10px 0',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    transform: 'translateX(2px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    '&:before': {
      opacity: 1,
    },
  },
}))

export const TimeElapsed = styled('span')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: '500',
}))

export const GroceryStats = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1, // Allow to expand within parent
  minHeight: '0', // Prevent flex shrinking issues in Safari
  gap: '0.5rem', // Add some gap for better spacing
  justifyContent: 'flex-start',
  alignItems: 'stretch',
})

export const ProgressSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const ProgressBar = styled('div')({
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
  position: 'relative',
})

export const ProgressFill = styled('div')<{ percentage: number }>(({ percentage }) => ({
  height: '100%',
  width: `${percentage}%`,
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '4px',
  transition: 'width 0.3s ease',
}))

export const ProgressText = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: '500',
}))

export const StatItem = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.8rem',
  color: theme.palette.text.primary,
  '& .label': {
    color: theme.palette.text.secondary,
  },
  '& .value': {
    fontWeight: '600',
    color: theme.palette.text.primary,
  },
}))

export const QuickItemsList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
})

export const QuickItem = styled('div')(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.primary,
  padding: '0.4rem 0.6rem',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
  borderRadius: '6px',
  border: '1px solid rgba(102, 126, 234, 0.15)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '& .quantity': {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    fontWeight: '500',
  },
}))

export const GroceryImagesGrid = styled('div')<{ itemCount: number }>(({ itemCount }) => {
  const rowCount = Math.ceil(itemCount / 5)
  const gridHeight = Math.max(1, rowCount) * 48 + (Math.max(0, rowCount - 1) * 12) // Calculate explicit height
  
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: `repeat(${rowCount}, 48px)`, // Explicit row height for Safari
    gap: '0.75rem',
    maxWidth: '100%',
    minHeight: `${gridHeight}px`, // Explicit min-height for Safari consistency
    height: 'auto',
    alignItems: 'center',
    justifyItems: 'center',
    marginTop: '0rem',
    marginBottom: '0rem',
    // Safari-specific grid fixes
    WebkitAlignItems: 'center',
    WebkitJustifyItems: 'center',
  }
})

export const GroceryImageItem = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '48px',
  height: '48px',
  minWidth: '48px', // Prevent shrinking in Safari
  minHeight: '48px', // Prevent shrinking in Safari
  borderRadius: '8px',
  backgroundColor: theme.palette.custom?.surfaces?.secondary || '#f5f5f5',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  // Safari-specific flex fixes
  WebkitAlignItems: 'center',
  WebkitJustifyContent: 'center',
  flexShrink: 0, // Prevent flex shrinking
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
}))

export const GroceryImageOverflow = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  backgroundColor: 'rgba(102, 126, 234, 0.12)',
  border: '1px solid rgba(102, 126, 234, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.18)',
    borderColor: 'rgba(102, 126, 234, 0.4)',
    transform: 'scale(1.05)',
  },
}))

export const MoreItemsIndicator = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: '0.5rem 0.8rem',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.15)',
  marginTop: '0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
    color: theme.palette.text.primary,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
  },
}))

export const NoiseStats = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.5rem',
  padding: '0.5rem 0',
})

export const NoiseStatBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 0.5rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(102, 126, 234, 0.12)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  minHeight: '65px',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.06)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
  },
}))

export const NoiseStatCount = styled('div')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: '700',
  color: theme.palette.text.primary,
  marginBottom: '0.25rem',
  lineHeight: 1,
}))

export const NoiseStatLabel = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: '500',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  lineHeight: 1.2,
}))

export const NoiseStatItem = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.6rem 0.8rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    transform: 'translateX(2px)',
  },
}))

export const NoiseDetailHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  paddingBottom: '0.5rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const NoiseDetailTitle = styled('h3')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  margin: 0,
}))

export const NoiseBackButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
}))

export const NoiseDetailList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxHeight: '300px',
  overflowY: 'auto',
})

export const NoiseDetailItem = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem',
  backgroundColor: theme.palette.background.default,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
}))

export const NoiseDetailDate = styled('div')(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
}))

export const NoiseDetailTime = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}))

export const NoiseDetailEmpty = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: '2rem',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}))

