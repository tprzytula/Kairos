import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.35em',
  width: '100%',
})
export const AddNoiseTrackingItemButton = styled(Button)(({ theme }) => ({
  marginBottom: '1em',
  alignSelf: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '0.5em',
  padding: '0.75em 1.5em',
  fontSize: '1.1em',
  fontWeight: 600,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    backgroundColor: theme.palette.primary.dark,
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }
}))
