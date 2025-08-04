import { styled } from '@mui/system'
import { Typography } from '@mui/material'

export const StyledHeader = styled(Typography)(({ theme }) => ({
  height: '1em',
  padding: '0.5em',
  fontSize: '2em',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textShadow: '1px 1px 0px rgba(0,0,0,0.1)',
  borderBottom: `3px solid ${theme.palette.error.main}`,
  position: 'relative',
  margin: '0 0 0.5em 0',
  transition: 'all 200ms ease-in-out',
  '&:hover': {
    color: theme.palette.custom?.hover?.primary,
    transform: 'translateY(-1px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: '30%',
    width: '40%',
    height: '4px',
    background: theme.palette.primary.main,
    transition: 'all 200ms ease-in-out',
  },
}))
