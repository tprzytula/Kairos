import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2em',
  width: '100%',
  flex: 1,
  margin: '0',
  boxSizing: 'border-box'
})

export const EmptyListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  flex: 1,
  gap: '12px',
  opacity: 0.6,
  minHeight: '300px',
  '& svg': {
    fontSize: '3rem',
    color: '#bbb',
  },
})

export const EmptyStateText = styled('div')(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
  textAlign: 'center',
}))
