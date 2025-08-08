import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
  width: '100%',
  margin: '0',
  boxSizing: 'border-box'
})

export const EmptyListMessage = styled(Typography)({
  fontSize: '1.2em',
  fontWeight: 'bold',
  textAlign: 'center',
})
