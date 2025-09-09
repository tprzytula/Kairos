import { styled } from '@mui/material/styles'

export const GroceryStats = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: '0',
  gap: '0.5rem',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
})

export const GroceryImagesGrid = styled('div')<{ itemCount: number }>(({ itemCount }) => {
  const rowCount = Math.ceil(itemCount / 5)
  const gridHeight = Math.max(1, rowCount) * 48 + (Math.max(0, rowCount - 1) * 12)
  
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: `repeat(${rowCount}, 48px)`,
    gap: '0.75rem',
    maxWidth: '100%',
    minHeight: `${gridHeight}px`,
    height: 'auto',
    alignItems: 'center',
    justifyItems: 'center',
    marginTop: '0rem',
    marginBottom: '0rem',
    WebkitAlignItems: 'center',
    WebkitJustifyItems: 'center',
  }
})

export const GroceryImageItem = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '48px',
  height: '48px',
  minWidth: '48px',
  minHeight: '48px',
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
  WebkitAlignItems: 'center',
  WebkitJustifyContent: 'center',
  flexShrink: 0,
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
