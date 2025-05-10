import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const EmptyListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const EmptyListMessage = styled(Typography)({
  fontSize: '1.2em',
  fontWeight: 'bold',
  textAlign: 'center',
})
