import { styled } from '@mui/material/styles'

export const BirthdayList = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.35rem',
})

export const CollapseGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.35rem',
})

export const BirthdayEntryContainer = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.4rem 0.5rem',
  borderRadius: '10px',
  ...($isToday && {
    background: 'rgba(236, 72, 153, 0.06)',
  }),
}))

export const DateBadge = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.8rem',
  padding: '0.3rem 0.2rem',
  borderRadius: '8px',
  background: $isToday
    ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    : 'rgba(0, 0, 0, 0.04)',
}))

export const DateBadgeMonth = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.55rem',
  fontWeight: 600,
  lineHeight: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: $isToday ? 'rgba(255, 255, 255, 0.85)' : theme.palette.text.secondary,
}))

export const DateBadgeDay = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '1.05rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: $isToday ? '#fff' : theme.palette.text.primary,
}))

export const DateBadgeWeekday = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.5rem',
  fontWeight: 600,
  lineHeight: 1,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  color: $isToday ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.disabled,
}))

export const BirthdayInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  gap: '0.1rem',
})

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: '0.85rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const BirthdaySubLine = styled('div')(({ theme }) => ({
  fontSize: '0.68rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const DaysUntil = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  flexShrink: 0,
  fontSize: '0.75rem',
  fontWeight: 700,
  color: $isToday ? '#ec4899' : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  paddingLeft: '0.5rem',
  paddingTop: '0.15rem',
  gridColumn: '1 / -1',
}))
