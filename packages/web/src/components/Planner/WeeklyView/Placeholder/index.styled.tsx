import { styled } from '@mui/material/styles'
import { shimmerStyles } from '../../../../utils/styles/shimmer'

export const NavButtonPlaceholder = styled('div')({
  width: 34,
  height: 34,
  borderRadius: '50%',
  flexShrink: 0,
  ...shimmerStyles,
})

export const WeekLabelPlaceholder = styled('div')({
  width: 140,
  height: 20,
  borderRadius: 4,
  flex: 1,
  margin: '0 8px',
  ...shimmerStyles,
})

export const DayNamePlaceholder = styled('div')({
  width: 24,
  height: 8,
  borderRadius: 3,
  marginBottom: 5,
  ...shimmerStyles,
})

export const DayNumberPlaceholder = styled('div')({
  width: 22,
  height: 22,
  borderRadius: 4,
  ...shimmerStyles,
})

export const DayItemPlaceholder = styled('div')<{ width?: number }>(({ width = 80 }) => ({
  width,
  height: 28,
  borderRadius: 8,
  flexShrink: 0,
  ...shimmerStyles,
}))
