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

export const AddNoiseTrackingItemButton = styled(Button)({
  marginBottom: '1em',
  width: '20em',
  alignSelf: 'center',
})
