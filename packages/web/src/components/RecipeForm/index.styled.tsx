import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

export const IngredientRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 80px 100px 36px',
  gap: '0.5rem',
  alignItems: 'center',
})

export const IngredientsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const FormActions = styled(Box)({
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  paddingTop: '0.5rem',
})
