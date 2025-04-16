import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
})

export const Header = styled('div')({
  padding: '1em',
  fontSize: '2em',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
})
