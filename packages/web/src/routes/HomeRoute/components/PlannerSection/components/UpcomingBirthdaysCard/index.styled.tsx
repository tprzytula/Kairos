import { styled } from '@mui/material/styles'

export const BirthdayList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
})

export const BirthdayEntryContainer = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.35rem 0.5rem',
  borderRadius: '10px',
  ...($isToday && {
    background: 'rgba(236, 72, 153, 0.08)',
  }),
}))

export const DateBadge = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.6rem',
  padding: '0.25rem 0.15rem',
  borderRadius: '8px',
  background: $isToday
    ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    : 'rgba(0, 0, 0, 0.04)',
}))

export const DateBadgeDate = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: $isToday ? '#fff' : theme.palette.text.primary,
  whiteSpace: 'nowrap',
}))

export const DateBadgeDay = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.55rem',
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  color: $isToday ? 'rgba(255, 255, 255, 0.85)' : theme.palette.text.secondary,
}))

export const BirthdayInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.78rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const DaysUntil = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  flexShrink: 0,
  fontSize: '0.68rem',
  fontWeight: 700,
  color: $isToday ? '#ec4899' : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}))

export const BirthdaySubLine = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  marginTop: '0.05rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  paddingLeft: '0.5rem',
}))
