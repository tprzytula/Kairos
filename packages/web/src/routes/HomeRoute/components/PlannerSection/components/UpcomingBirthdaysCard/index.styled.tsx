import { styled } from '@mui/material/styles'

export const BirthdayList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
})

export const BirthdayEntryContainer = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  display: 'grid',
  gridTemplateColumns: '3.2rem 1fr auto',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.2rem 0.25rem',
  borderRadius: '8px',
  ...($isToday && {
    background: 'rgba(236, 72, 153, 0.06)',
  }),
}))

export const DateBadge = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  padding: '0.15rem 0',
  borderRadius: '6px',
  background: $isToday
    ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    : 'rgba(0, 0, 0, 0.04)',
}))

export const DateBadgeDate = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  lineHeight: 1,
  color: $isToday ? '#fff' : theme.palette.text.primary,
  whiteSpace: 'nowrap',
}))

export const DateBadgeDay = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.55rem',
  fontWeight: 600,
  lineHeight: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  color: $isToday ? 'rgba(255, 255, 255, 0.85)' : theme.palette.text.secondary,
}))

export const BirthdayInfo = styled('div')({
  gridColumn: 2,
  minWidth: 0,
})

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.75rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block',
}))

export const DaysUntil = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  color: $isToday ? '#ec4899' : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  textAlign: 'right',
}))

export const BirthdaySubLine = styled('div')(({ theme }) => ({
  fontSize: '0.6rem',
  color: theme.palette.text.secondary,
  marginTop: '0.05rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  paddingLeft: '0.25rem',
  paddingTop: '0.1rem',
}))
