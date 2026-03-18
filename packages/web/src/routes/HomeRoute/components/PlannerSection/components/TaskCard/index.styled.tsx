import { styled } from '@mui/material/styles'

export const CardWrapper = styled('div')<{ $dueDateClass?: string }>(({ theme, $dueDateClass }) => ({
  borderRadius: '12px',
  padding: '0.5rem 0.65rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)',
  border: '1px solid rgba(99, 102, 241, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '3px',
    background:
      $dueDateClass === 'overdue'
        ? theme.palette.error.main
        : $dueDateClass === 'today'
        ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
        : 'transparent',
    borderRadius: '3px 0 0 3px',
  },
  '&:active': {
    transform: 'scale(0.985)',
  },
}))

export const CardHeader = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '0.5rem',
  marginBottom: '0.2rem',
  cursor: 'pointer',
})

export const TaskTitle = styled('div')(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const DueLabel = styled('span')<{ $dueDateClass?: string }>(({ theme, $dueDateClass }) => ({
  fontSize: '0.68rem',
  fontWeight: 600,
  flexShrink: 0,
  padding: '0.1rem 0.4rem',
  borderRadius: '6px',
  color:
    $dueDateClass === 'overdue'
      ? theme.palette.error.main
      : $dueDateClass === 'today'
      ? '#d97706'
      : theme.palette.text.secondary,
  background:
    $dueDateClass === 'overdue'
      ? `${theme.palette.error.main}14`
      : $dueDateClass === 'today'
      ? 'rgba(217, 119, 6, 0.1)'
      : 'rgba(99, 102, 241, 0.06)',
}))

export const ProgressBarTrack = styled('div')({
  width: '100%',
  height: '4px',
  borderRadius: '2px',
  background: 'rgba(99, 102, 241, 0.08)',
  overflow: 'hidden',
  marginBottom: '0.1rem',
})

export const ProgressBarFill = styled('div')<{ $percent: number }>(({ $percent }) => ({
  height: '100%',
  borderRadius: '2px',
  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
  width: `${$percent}%`,
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}))

export const ProgressLabel = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textAlign: 'right',
  marginBottom: '0.25rem',
}))

export const StepsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
})

export const StepRow = styled('div')<{ $isDone: boolean }>(({ theme, $isDone }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.2rem 0.15rem',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.05)',
  },
  '&:active': {
    background: 'rgba(99, 102, 241, 0.1)',
  },
  '& .step-checkbox': {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    border: $isDone
      ? 'none'
      : `1.5px solid rgba(99, 102, 241, 0.35)`,
    background: $isDone
      ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
      : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    color: 'white',
    fontSize: '0.6rem',
  },
  '& .step-name': {
    fontSize: '0.72rem',
    color: $isDone ? theme.palette.text.disabled : theme.palette.text.primary,
    textDecoration: $isDone ? 'line-through' : 'none',
    lineHeight: 1.3,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}))
