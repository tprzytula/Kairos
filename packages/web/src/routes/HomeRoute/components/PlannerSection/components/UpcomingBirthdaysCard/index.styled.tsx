import { styled } from '@mui/material/styles'

export const BirthdayRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.3rem',
  fontSize: '0.75rem',
}))

export const BirthdayName = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
}))

export const DaysUntil = styled('span')<{ $isToday?: boolean }>(({ theme, $isToday }) => ({
  flexShrink: 0,
  fontSize: '0.68rem',
  fontWeight: 700,
  color: $isToday ? '#f093fb' : theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}))

export const BirthdaySubLine = styled('div')(({ theme }) => ({
  fontSize: '0.65rem',
  color: theme.palette.text.secondary,
  marginTop: '0.05rem',
  marginBottom: '0.15rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

export const MoreCount = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
}))
