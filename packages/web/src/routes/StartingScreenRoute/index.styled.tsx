import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  flexDirection: 'column',
})

export const StyledButton = styled('div')({
  margin: '1em',
  padding: '1em',
  border: '1px solid black',
  borderRadius: '0.3em',
  cursor: 'pointer',
  fontSize: '1.5em',
  fontWeight: 'bold',
})

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})
