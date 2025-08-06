import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
  width: 'calc(100% - 2em)',
  margin: '0 0.5em',
  padding: '0 0.5em'
})

export const EmptyListMessage = styled(Typography)({
  fontSize: '1.2em',
  fontWeight: 'bold',
  textAlign: 'center',
})
