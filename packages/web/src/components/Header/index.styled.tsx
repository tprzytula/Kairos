import { styled } from '@mui/system'
import { Typography } from '@mui/material'

export const StyledHeader = styled(Typography)({
  height: '1em',
  padding: '0.5em',
  fontSize: '2em',
  fontWeight: 'bold',
  color: '#56a65a',
  textShadow: '1px 1px 0px rgba(0,0,0,0.1)',
  borderBottom: '3px solid #ff6b6b',
  position: 'relative',
  margin: '0 0 0.5em 0',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: '30%',
    width: '40%',
    height: '4px',
    background: '#83cc61',
  },
})
