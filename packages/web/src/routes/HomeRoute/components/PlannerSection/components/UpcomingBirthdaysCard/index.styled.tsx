import { styled } from '@mui/material/styles'

export const BirthdayList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const CollapseGrid = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const BirthdayEntryContainer = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.35rem 0.5rem',
  borderRadius: '10px',
  ...($isToday && {
    background: 'rgba(236, 72, 153, 0.06)',
  }),
}))

export const DateBadge = styled('div')<{ $isToday?: boolean }>(({ $isToday }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '8px',
  background: $isToday
    ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    : 'rgba(0, 0, 0, 0.04)',
}))

export const DateBadgeDay = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  fontSize: '0.9rem',
  fontWeight: 700,
  lineHeight: 1,
  color: $isToday ? '#fff' : theme.palette.text.primary,
}))

export const BirthdayInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  gap: '0.05rem',
})

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: '0.8rem',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const BirthdaySubLine = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const DaysUntilPill = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  flexShrink: 0,
  fontSize: '0.65rem',
  fontWeight: 700,
  lineHeight: 1,
  padding: '0.25rem 0.5rem',
  borderRadius: '99px',
  whiteSpace: 'nowrap',
  ...($isToday
    ? {
        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        color: '#fff',
      }
    : {
        background: 'rgba(0, 0, 0, 0.05)',
        color: theme.palette.text.secondary,
      }),
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  paddingLeft: '0.5rem',
  paddingTop: '0.15rem',
}))
