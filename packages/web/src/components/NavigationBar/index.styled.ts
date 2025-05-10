import { styled } from '@mui/material/styles'
import { Box, Paper } from '@mui/material'

export const Container = styled(Paper)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  borderRadius: '0',
  background: theme.palette.custom?.background,
  margin: '0 auto',
  flexDirection: 'column',
}))

export const Divider = styled('div')(({ theme }) => ({
  width: '85%',
  border: '1px solid #E0E0E0',
  background: theme.palette.custom?.background,
  margin: '0 auto',
  marginTop: '0.5em',
}))

export const ItemsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1em',
  padding: '1em',
})

