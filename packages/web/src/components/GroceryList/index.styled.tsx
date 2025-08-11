import { styled } from '@mui/material/styles'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flex: 1,
  margin: 0,
  padding: 0
})

export const EmptyListContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  flex: 1,
  '& svg': {
    fontSize: '4rem',
    color: '#bbb',
  },
})


