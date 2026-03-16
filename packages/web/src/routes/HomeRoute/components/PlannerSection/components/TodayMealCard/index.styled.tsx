import { styled } from '@mui/material/styles'

export const MealName = styled('div')(({ theme }) => ({
  fontSize: '0.78rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: '1.3',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}))

export const AdditionalMeals = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
}))
