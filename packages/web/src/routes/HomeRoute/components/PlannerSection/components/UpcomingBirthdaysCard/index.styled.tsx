import { styled } from '@mui/material/styles'

export const BirthdayList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const BirthdayRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.4rem 0',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
    paddingBottom: 0,
  },
  '&:first-of-type': {
    paddingTop: 0,
  },
}))

export const BirthdayAvatar = styled('div')<{ $gradient: string }>(({ $gradient }) => ({
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '50%',
  background: $gradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'white',
  flexShrink: 0,
  letterSpacing: 0,
}))

export const BirthdayInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.05rem',
  overflow: 'hidden',
  minWidth: 0,
})

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: '0.78rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const BirthdayDate = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.65rem',
  whiteSpace: 'nowrap',
}))

export type DaysUrgency = 'today' | 'soon' | 'week' | 'later'

const urgencyStyles: Record<DaysUrgency, { background: string; color: string }> = {
  today: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
  },
  soon: {
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    color: 'white',
  },
  week: {
    background: 'rgba(99, 102, 241, 0.13)',
    color: '#6366f1',
  },
  later: {
    background: 'rgba(0, 0, 0, 0.06)',
    color: 'inherit',
  },
}

export const DaysUntilBadge = styled('div')<{ $urgency: DaysUrgency }>(({ theme, $urgency }) => {
  const { background, color } = urgencyStyles[$urgency]
  return {
    flexShrink: 0,
    fontSize: '0.62rem',
    fontWeight: 700,
    padding: '0.18rem 0.45rem',
    borderRadius: '20px',
    background,
    color: color === 'inherit' ? theme.palette.text.secondary : color,
    whiteSpace: 'nowrap',
    letterSpacing: '0.01em',
  }
})

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.68rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  textAlign: 'center',
  paddingTop: '0.35rem',
}))
