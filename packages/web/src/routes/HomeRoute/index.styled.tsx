import { styled } from '@mui/material/styles'
import { Card, CardContent, Typography, Box } from '@mui/material'

export const Container = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',
  padding: '0 0.75rem 1rem 0.75rem',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 50%, rgba(240, 147, 251, 0.02) 100%)',
  '@media (max-width: 480px)': {
    gridTemplateColumns: '1fr',
    gap: '0.6rem',
    padding: '0 0.5rem 0.75rem 0.5rem',
  },
})

export const FullWidthSection = styled(Box)({
  gridColumn: '1 / -1',
  '@media (max-width: 480px)': {
    gridColumn: 'auto',
  },
})

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  border: 'none',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
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
    transform: 'translateY(-2px) scale(1.02)',
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

export const CompactItemText = styled('li')(({ theme }) => ({
  fontSize: '0.8rem',
  fontWeight: '500',
  color: theme.palette.text.primary,
  padding: '0.4rem 0.6rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
  borderRadius: '8px',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  cursor: 'pointer',
  lineHeight: 1.3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '2px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0 8px 8px 0',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    transform: 'translateX(1px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    '&:before': {
      opacity: 1,
    },
  },
}))

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

export const EmptyState = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '0.75rem 0.5rem',
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
  gap: '0rem',
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

export const GroceryImagesGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '0.75rem',
  maxWidth: '100%',
  alignItems: 'center',
  justifyItems: 'center',
  marginTop: '0rem',
  marginBottom: '0rem',
})

export const GroceryImageItem = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '48px',
  height: '48px',
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
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.12)',
    borderColor: 'rgba(102, 126, 234, 0.25)',
    transform: 'translateY(-1px)',
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