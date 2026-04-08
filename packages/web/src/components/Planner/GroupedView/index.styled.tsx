import { styled } from '@mui/material/styles'
import { Chip } from '@mui/material'

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1em',
  width: '100%',
  height: '100%',
  flex: 1,
  margin: '0',
  boxSizing: 'border-box',
})

export const TypeDivider = styled('div')({
  height: '6px',
})

export const TaskCountBadge = styled(Chip)({
  height: '22px',
  fontSize: '0.7rem',
  fontWeight: 600,
  backgroundColor: '#ecfdf5',
  color: '#059669',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
})
