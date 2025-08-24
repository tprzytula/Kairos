import { styled } from '@mui/material'

export const BubbleContainer = styled('div')<{ $arrowOffset?: number }>(({ theme, $arrowOffset = 0 }) => ({
  position: 'fixed',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${theme.palette.divider}`,
  zIndex: 9999,
  maxWidth: '240px',
  minWidth: '180px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  transform: 'translateX(-50%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: `translateX(calc(-50% + ${$arrowOffset}px))`,
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: `8px solid ${theme.palette.background.paper}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 'calc(100% + 1px)',
    left: '50%',
    transform: `translateX(calc(-50% + ${$arrowOffset}px))`,
    width: 0,
    height: 0,
    borderLeft: '9px solid transparent',
    borderRight: '9px solid transparent',
    borderTop: `9px solid ${theme.palette.divider}`,
    zIndex: -1,
  }
}))

export const BubbleOverlay = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9998,
  background: 'transparent',
}))



export const ItemDetails = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px'
}))

export const ItemName = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: '600',
  color: theme.palette.text.primary,
  textAlign: 'center',
  lineHeight: 1.3
}))

export const ItemQuantity = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  fontWeight: '500'
}))
