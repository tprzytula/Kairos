import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column',
})

export const StyledButton = styled('div')(({ theme }) => ({
  margin: '0.5em',
  padding: '1em',
  width: '10em',
  height: '2em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '0.5em',
  cursor: 'pointer',
  fontSize: '1.2em',
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

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
