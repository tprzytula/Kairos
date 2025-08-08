import { styled } from '@mui/system'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  width: '100%'
})

export const ScrollableContainer = styled('div')({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  paddingBottom: '1rem',
})

export const ActionArea = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  gap: '1em',
})
