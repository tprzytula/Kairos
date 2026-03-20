import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { SECTION_GRADIENTS } from '../../constants/sectionColors'
import { gradientTextStyles } from '../../utils/styles/gradientText'

export const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
})

export const DrawerHeaderLeft = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const DrawerIconBox = styled(Box)<{ gradient?: string }>(
  ({ gradient = SECTION_GRADIENTS.recipe }) => ({
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '10px',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
      color: 'white',
    },
  })
)

export const DrawerTitle = styled('span')<{ gradient?: string }>(
  ({ gradient = SECTION_GRADIENTS.recipe }) => ({
    fontSize: '1.1rem',
    fontWeight: '700',
    ...gradientTextStyles(gradient),
    letterSpacing: '0.3px',
  })
)

export const ContentContainer = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})
