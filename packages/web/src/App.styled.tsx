import './App.module.scss'

import { styled } from '@mui/system'

export const ApplicationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  background: theme.palette.custom.background,
  justifyContent: 'center',
  alignItems: 'center',
}))

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxHeight: '1000px',
  maxWidth: '400px',
  height: '100%',
  width: '100%',
  margin: 0,
})
