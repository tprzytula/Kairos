import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const TaskRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.4rem',
  fontSize: '0.75rem',
  color: theme.palette.text.primary,
  lineHeight: '1.3',
}))

export const TaskDot = styled('div')<{ $class?: string }>(({ theme, $class }) => ({
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  flexShrink: 0,
  marginTop: '0.3rem',
  backgroundColor:
    $class === 'overdue'
      ? theme.palette.error.main
      : $class === 'today'
      ? '#667eea'
      : theme.palette.text.disabled,
}))

export const TaskName = styled('span')({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const OverdueBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: theme.palette.error.main,
  background: `${theme.palette.error.main}18`,
  borderRadius: '8px',
  padding: '0.1rem 0.4rem',
  marginBottom: '0.35rem',
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
}))

export const TaskSubLine = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  marginTop: '0.05rem',
  marginBottom: '0.15rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))
