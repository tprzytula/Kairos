import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const Container = styled(Paper)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  borderRadius: '0',
  background: theme.palette.custom?.background,
  backgroundImage: 'none !important',
  backgroundColor: 'transparent',
  margin: '0 auto',
  flexDirection: 'column',
  boxShadow: 'none',
}))

export const Divider = styled('div')(({ theme }) => ({
  width: '85%',
  height: '1px',
  backgroundColor: 'rgba(0, 0, 0, 0.06)',
  border: 'none',
  margin: '0 auto',
  marginTop: '0.5em',
}))

export const ItemsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '0.5em',
  padding: '1em 0.5em',
})

