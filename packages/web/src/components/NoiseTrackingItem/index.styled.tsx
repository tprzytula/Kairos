import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const DeleteButton = styled(Button)({
  margin: '0 0.25em',
  padding: '0.25em',
  minWidth: '2em',
  width: '2em',
})
