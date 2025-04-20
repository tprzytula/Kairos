import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
})

export const ActionArea = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '1em',
})
