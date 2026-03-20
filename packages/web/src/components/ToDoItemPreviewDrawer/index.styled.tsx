import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'

export const TODO_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

export const ItemName = styled('h2')({
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 700,
  color: 'rgba(0,0,0,0.87)',
  lineHeight: 1.3,
})

export const MetaRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'rgba(0,0,0,0.5)',
  fontSize: '0.875rem',
})

export const DescriptionText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: 'rgba(0,0,0,0.75)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
})

export const NoDescriptionText = styled('p')({
  margin: 0,
  fontSize: '0.875rem',
  color: 'rgba(0,0,0,0.35)',
  fontStyle: 'italic',
})

export const Footer = styled(Box)({
  padding: '0.75rem 1.25rem',
  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
  borderTop: '1px solid rgba(0,0,0,0.06)',
  flexShrink: 0,
})
