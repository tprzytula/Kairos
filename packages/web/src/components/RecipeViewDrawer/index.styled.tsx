import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { COLORS, GRADIENTS, PLACEHOLDER_GRADIENTS } from '../../constants/colors'

export const HeroImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  display: 'block',
})

export const HeroPlaceholder = styled(Box)<{ seed?: number }>(({ seed = 0 }) => ({
  width: '100%',
  height: '200px',
  borderRadius: '12px',
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const RecipeTitle = styled('h2')({
  margin: 0,
  fontSize: '1.35rem',
  fontWeight: 700,
  color: 'rgba(0, 0, 0, 0.87)',
  lineHeight: 1.3,
})

export const ExternalLinkRow = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: COLORS.orange.primary,
  fontSize: '0.85rem',
  fontWeight: 500,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
})

export const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '0.5rem',
})

export const SectionLabel = styled('span')({
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  color: COLORS.orange.primary,
})

export const SectionBadge = styled('span')({
  fontSize: '0.7rem',
  fontWeight: 600,
  color: COLORS.orange.primary,
  background: COLORS.orange.bg,
  borderRadius: '999px',
  padding: '1px 8px',
  lineHeight: 1.6,
})

export const IngredientRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '8px',
  padding: '4px 4px 4px 0',
  '&:hover': {
    background: COLORS.orange.bgSubtle,
  },
})

export const IngredientIcon = styled('img')({
  width: '28px',
  height: '28px',
  objectFit: 'contain',
  flexShrink: 0,
})

export const IngredientQuantity = styled('span')({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: COLORS.orange.primary,
  minWidth: '60px',
  textAlign: 'right' as const,
  flexShrink: 0,
})

export const IngredientName = styled('span')<{ checked?: boolean }>(({ checked }) => ({
  fontSize: '0.9rem',
  color: checked ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.75)',
  textDecoration: checked ? 'line-through' : 'none',
  transition: 'color 0.15s ease, text-decoration 0.15s ease',
}))

export const StepRow = styled(Box)({
  display: 'flex',
  gap: '0.6rem',
  borderRadius: '8px',
  padding: '6px 4px 6px 0',
  alignItems: 'flex-start',
  '&:hover': {
    background: COLORS.orange.bgSubtle,
  },
})

export const StepNumber = styled(Box)({
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  background: GRADIENTS.orange,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'white',
  marginTop: '2px',
})

export const StepText = styled('span')<{ checked?: boolean }>(({ checked }) => ({
  fontSize: '0.9rem',
  color: checked ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.75)',
  textDecoration: checked ? 'line-through' : 'none',
  lineHeight: 1.6,
  flex: 1,
  transition: 'color 0.15s ease, text-decoration 0.15s ease',
}))

export const Footer = styled(Box)({
  padding: '0.5rem 1.25rem',
  paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

export const ShopSelector = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0',
})
