import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
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

export const DrawerIconBox = styled(Box)({
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: 'white',
  },
})

export const DrawerTitle = styled('span')({
  fontSize: '1.1rem',
  fontWeight: '700',
  ...gradientTextStyles('linear-gradient(135deg, #ec4899 0%, #db2777 100%)'),
  letterSpacing: '0.3px',
})

export const ContentContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const PersonName = styled('h2')({
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

export const NotesText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: 'rgba(0,0,0,0.75)',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
})

export const NoNotesText = styled('p')({
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
  display: 'flex',
  gap: '0.75rem',
})
