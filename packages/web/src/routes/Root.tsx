import { styled } from '@mui/system'
import React from 'react'

const Container = styled('div')({
  display: 'flex',
  height: '100%',
  width: 'calc(100% - 5em)',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
})

const Root: React.FC = () => {
  return <Container>Grocery List</Container>
}

export default Root
